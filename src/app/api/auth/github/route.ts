import { NextResponse } from "next/server";

export async function GET() {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user:email&redirect_uri=${redirectUri}`;
    return NextResponse.redirect(githubAuthUrl);
}
