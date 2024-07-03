"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";

export async function getChatRooms() {
  const session = await getSession();
  return await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: session.id!,
        },
      },
    },
    select: {
      id: true,
      users: true,
      product: {
        select: {
          photos: true,
          title: true,
        },
      },
      messages: {
        take: 1,
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });
}
