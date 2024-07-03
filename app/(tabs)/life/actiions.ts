"use server";

import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

export const getPostsCache = nextCache(getPosts, ["posts"], {
  tags: ["posts"],
});

export async function getPosts() {
  return await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
}
