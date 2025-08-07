import { NextResponse } from "next/server";
import { getGitHubUser } from "@/lib/session";

export async function GET() {
  const ghUser = await getGitHubUser();
  if (!ghUser) {
    return NextResponse.json({ linked: false });
  }
  return NextResponse.json({ linked: true, user: ghUser });
}
