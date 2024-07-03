"use server";
import db from "@/lib/db";
import { getSession } from "@/lib/session";

export async function getChatRoom(id: string) {
  const chatRoom = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  if (chatRoom) {
    const session = await getSession();
    const canSee = Boolean(
      chatRoom.users.find((user) => user.id === session.id)
    );
    if (!canSee) {
      return null;
    }
  }
  return chatRoom;
}

export async function getMessages(chatRoomId: string) {
  return await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });
}

export async function createMessage({
  payload,
  chatRoomId,
}: {
  payload: string;
  chatRoomId: string;
}) {
  const session = await getSession();
  const message = await db.message.create({
    data: {
      payload,
      userId: session.id!,
      chatRoomId,
    },
  });
}

export async function getUserProfile() {
  const session = await getSession();
  if (session.id) {
    return await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        username: true,
        avatar: true,
      },
    });
  }
}
