import db from "@/lib/db";
import { getAccessToken, getUserProfile } from "@/lib/github-auth";
import { saveSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, { status: 400 });
  }
  const access_token = await getAccessToken(code);

  const { id, login, email, avatar_url } = await getUserProfile(access_token);

  const user = await db.user.findUnique({
    where: {
      github_id: id,
    },
    select: { id: true },
  });
  if (user) {
    await saveSession(user);
    return redirect("/profile");
  }
  const checkUsername = await db.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    },
  });

  // const userEmailResponse = await (
  //   await fetch("https://api.github.com/user/emails", {
  //     method: "get",
  //     headers: {
  //       Authorization: `Bearer ${access_token}`,
  //     },
  //     cache: "no-cache",
  //   })
  // ).json();
  // const primaryEmail = userEmailResponse.filter(
  //   ({ primary }: { primary: boolean }) => primary
  // );
  // console.log(primaryEmail[0].email);

  const newUser = await db.user.create({
    data: {
      username: checkUsername ? `${login}-gh-${Date.now()}` : login,
      avatar: avatar_url,
      github_id: id,
      email,
    },
    select: {
      id: true,
    },
  });
  if (newUser) {
    await saveSession(newUser);
    return redirect("/profile");
  }
}
