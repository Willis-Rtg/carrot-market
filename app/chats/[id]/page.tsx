import { notFound } from "next/navigation";
import { getChatRoom, getMessages, getUserProfile } from "./actions";
import { TChatMessages } from "./schema";
import ChatRoomClient from "./client";
import { getSession } from "@/lib/session";
import { Prisma } from "@prisma/client";

type TUserProfile = Prisma.PromiseReturnType<typeof getUserProfile>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getChatRoom(params.id);
  if (!room) {
    return notFound();
  }
  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  const userProfile = await getUserProfile();
  return (
    <ChatRoomClient
      initialMessages={initialMessages}
      userId={session.id!}
      chatRoomId={params.id}
      userProfile={userProfile}
    />
  );
}
