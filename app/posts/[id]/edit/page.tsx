import { getPostCache } from "../actions";
import PostEditClient from "./client";

export default async function PostEdit({ params }: { params: { id: number } }) {
  const post = await getPostCache(Number(params.id));
  return <PostEditClient post={post} />;
}
