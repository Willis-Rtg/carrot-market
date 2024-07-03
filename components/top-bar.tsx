"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type TOnlyHomeBtn = {
  [key: string]: boolean;
};
const OnlyHomeBtn: TOnlyHomeBtn = {
  "/home": true,
  "/life": true,
  "/chat": true,
  "/live": true,
  "/profile": true,
};

export default function TopBar() {
  const pathname = usePathname();
  const homeBtn = OnlyHomeBtn[pathname];
  const router = useRouter();

  return (
    <div className="fixed top-0 px-5 py-4 border-b border-b-neutral-600 bg-orange-400 rounded-b-lg max-w-screen-sm w-full overflow-hidden z-10">
      {homeBtn ? (
        <Link href="/home">
          <span className="text-3xl text-white">🥕 당근마켓</span>
        </Link>
      ) : (
        <button className="size-8" onClick={router.back}>
          <ArrowLeftIcon />
        </button>
      )}
    </div>
  );
}
