"use server";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getMoreProducts(page: number) {
  return await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      created_at: true,
    },
    take: 1,
    skip: page * 1,
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function getInitialProducts() {
  return await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      created_at: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
}

export type TInitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;
