import { Prisma } from "@prisma/client";
import { getMessages } from "./actions";
import { z } from "zod";

export type TChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export const messageSchema = z.object({
  payload: z.string().min(1, "message is required."),
});
