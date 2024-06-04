"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";

export type TProductDetail = Prisma.PromiseReturnType<typeof getProduct>;

export async function getProduct(id: number) {
  console.log("product");
  return await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
          id: true,
        },
      },
      photo: {
        select: {
          url: true,
        },
      },
    },
  });
}

export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

export async function getProductTitle(id: number) {
  console.log("title");
  return await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
}
export const getCachedProductTitle = nextCache(
  getProductTitle,
  ["product-title"],
  {
    tags: ["product-title"],
  }
);

export async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export async function deleteProduct(id: any, data: FormData) {
  const session = await getSession();
  if (session.id) {
    await db.product.delete({
      where: {
        id,
        userId: session.id,
      },
    });
  }
  redirect("/home");
}
