import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string(),
});

export type TZPost = z.infer<typeof postSchema>;
