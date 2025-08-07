import { NextResponse } from "next/server";
import { getGitHubUser } from "@/lib/session";
import nodemailer from "nodemailer";

async function sendPaymentEmail(to: string) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
        from: `"Payments" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Payment Successful",
        text: "Your payment was successful! You now have access to the private GitHub repository.",
    });
}

export async function POST() {
    const ghUser = await getGitHubUser();
    if (!ghUser) {
        return NextResponse.json(
            { success: false, error: "GitHub account not linked" },
            { status: 400 }
        );
    }

    // Invite to repo with read-only access
    await fetch(
        `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/collaborators/${ghUser.login}`,
        {
            method: "PUT",
            headers: {
                Authorization: `token ${process.env.GITHUB_ADMIN_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
            body: JSON.stringify({ permission: "pull" }),
        }
    );

    // Send payment success email
    await sendPaymentEmail(ghUser.email);

    return NextResponse.json({ success: true });
}
