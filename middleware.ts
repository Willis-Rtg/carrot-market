import { NextRequest, NextResponse } from "next/server";
import { boolean } from "zod";
import { getSession } from "./lib/session";
import { redirect } from "next/navigation";

interface IPublicOnlyUrls {
  [key: string]: boolean;
}

const publicOnlyUrls: IPublicOnlyUrls = {
  "/": true,
  "/login": true,
  "/create-account": true,
  "/sms": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL("/", request.nextUrl.origin));
    }
  } else {
    if (exists) {
      return NextResponse.redirect(
        new URL("/products", request.nextUrl.origin)
      );
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
