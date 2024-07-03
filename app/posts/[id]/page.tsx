import { notFound } from "next/navigation";
import { getLikeStatusCache, getPostCache } from "./actions";
import PostDetailClient from "./client";
import { revalidateTag } from "next/cache";

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const post = await getPostCache(id);

  if (!post) {
    return notFound();
  }
  revalidateTag("posts");

  const likeStatus = await getLikeStatusCache(id);

  return <PostDetailClient post={post} likeStatus={likeStatus} />;
}
