"use client";

import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";
import { HandThumbUpIcon as HandThumbUpSolidIcon } from "@heroicons/react/24/solid";
import {
  ChatBubbleBottomCenterIcon as ChatBubbleBottomCenterOutlineIcon,
  HandThumbUpIcon as HandThumbUpOutlineIcon,
} from "@heroicons/react/24/outline";
import { TPosts } from "./schema";

export default function LifeClient({ posts }: { posts: TPosts }) {
  return posts.map((post) => (
    <Link
      key={post?.id}
      href={`/posts/${post?.id}`}
      className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col last:pb-0 last:border-0 gap-2"
    >
      <h2 className="text-white text-lg font-semibold">{post?.title}</h2>
      <p>{post?.description}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <span>{formatToTimeAgo(post?.created_at || new Date())}</span>
          <span>∙</span>
          <span>조회 {post?.views}</span>
        </div>
        <div className="flex gap-5 items-center *:flex *:items-center *:gap-2">
          <span>
            <HandThumbUpOutlineIcon className="size-4" />
            {post?._count.likes}
          </span>
          <span>
            {post?._count.comments}
            <ChatBubbleBottomCenterOutlineIcon className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  ));
}
