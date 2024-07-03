import Link from "next/link";
import { getPostsCache } from "./actiions";
import {
  HandThumbUpIcon as HandThumbUpSolidIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { revalidateTag } from "next/cache";
import LifeClient from "./client";
import { TPost } from "@/app/posts/[id]/schema";
import { TPosts } from "./schema";

export const metadata = {
  title: "동네생활",
};

export default async function Life() {
  revalidateTag("post");

  const posts: TPosts = await getPostsCache();
  return (
    <div className="p-5 flex flex-col">
      <LifeClient posts={posts} />
      <Link
        className="fixed bottom-24 right-10 size-16 bg-orange-500 rounded-full text-white flex justify-center items-center transition-colors hover:bg-orange-400 "
        href={`/posts/add`}
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
