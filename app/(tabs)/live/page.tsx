import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Live() {
  return (
    <div className="relative">
      <h1>Live!!</h1>
      <Link
        className="fixed bottom-24 right-10 md:right-[calc(50vw-280px)] size-16 bg-orange-500 rounded-full text-white flex justify-center items-center transition-colors hover:bg-orange-400 "
        href={`/streams/add`}
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
