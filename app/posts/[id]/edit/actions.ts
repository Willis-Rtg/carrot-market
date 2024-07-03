"use server";
import db from "@/lib/db";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { postSchema } from "../../add/schema";

export async function updatePost(formData: FormData) {
  console.log("formdata", formData);
  const data = {
    id: +formData.get("id")!,
    title: formData.get("title"),
    description: formData.get("description"),
  };
  const validData = await postSchema.safeParse(data);
  if (!validData.success) {
    return;
  }
  const session = await getSession();
  const updatedPost = await db.post.update({
    where: {
      id: +data.id,
      userId: session.id,
    },
    data: {
      title: validData.data.title,
      description: validData.data.description,
    },
  });
  if (!!updatedPost) {
    revalidateTag(`post-${data.id}`);
    revalidateTag(`posts`);
    redirect("/life");
  }
}
