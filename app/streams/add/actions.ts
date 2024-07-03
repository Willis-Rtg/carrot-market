"use server";

import { z } from "zod";

const streamSchema = z.object({
  title: z.string(),
});

export async function startStream(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
  };
  const result = streamSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }
}
