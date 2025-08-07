import { cookies } from "next/headers";

export async function setGitHubUser(user: { login: string; email: string }) {
    const cookieStore = await cookies();
    cookieStore.set("gh_login", user.login, { httpOnly: true });
    cookieStore.set("gh_email", user.email, { httpOnly: true });
}

export async function getGitHubUser() {
    const cookieStore = await cookies();
    const login = cookieStore.get("gh_login")?.value;
    const email = cookieStore.get("gh_email")?.value;
    return login && email ? { login, email } : null;
}
