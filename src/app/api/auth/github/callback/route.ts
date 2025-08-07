import { NextResponse } from "next/server";
import { setGitHubUser } from "@/lib/session";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    // Exchange code for token
    const tokenRes = await fetch(
        "https://github.com/login/oauth/access_token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }),
        }
    );
    const { access_token } = await tokenRes.json();

    // Get user info
    const userRes = await fetch("https://api.github.com/user", {
        headers: { Authorization: `token ${access_token}` },
    });
    const ghUser = await userRes.json();

    // Get primary email
    const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `token ${access_token}` },
    });
    const emails = await emailRes.json();
    const primaryEmail =
        emails.find((e: any) => e.primary)?.email || emails[0]?.email;

    // Save in session
    await setGitHubUser({ login: ghUser.login, email: primaryEmail });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`);
}
