"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { postSchema } from "./schema";

export async function createPost(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const validData = await postSchema.safeParse(data);

  if (!validData.success) {
    return validData.error.flatten();
  }

  const session = await getSession();

  if (session.id) {
    const post = await db.post.create({
      data: {
        title: validData.data.title,
        description: validData.data.description,
        userId: session.id,
      },
    });
    revalidateTag("posts");
    redirect("/life");
  }
}
