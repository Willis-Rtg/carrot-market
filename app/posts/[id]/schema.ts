import { Prisma } from "@prisma/client";
import { getPost } from "./actions";
import { z } from "zod";

export type TPost = Prisma.PromiseReturnType<typeof getPost>;

export const commentSchema = z.object({
  payload: z.string().min(1, "Comment is required."),
});
