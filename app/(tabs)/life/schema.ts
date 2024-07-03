import { Prisma } from "@prisma/client";
import { getPosts } from "./actiions";

export type TPosts = Prisma.PromiseReturnType<typeof getPosts>;
