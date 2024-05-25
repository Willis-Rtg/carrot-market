import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface Sessioncontent {
  id?: number;
}

export function getSession() {
  return getIronSession<Sessioncontent>(cookies(), {
    cookieName: "user",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function saveSession(user: { id: number }) {
  const session = await getSession();
  session.id = user.id;
  await session.save();
}
