import Image from "next/image";
import { getChatRooms } from "./actinos";
import { getSession } from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";

export default async function Chat() {
  const chatRooms = await getChatRooms();
  const session = await getSession();

  console.log("chatRooms", chatRooms);
  return (
    <div className="py-5 px-3">
      {chatRooms.map((chatRoom) => (
        <Link
          href={`/chats/${chatRoom.id}`}
          className="flex gap-4 *:text-white"
          key={chatRoom.id}
        >
          <div className="relative size-20">
            <Image
              className="rounded-full"
              fill
              src={
                chatRoom.users.filter((user) => user.id !== session.id)[0]
                  .avatar || ""
              }
              alt={
                chatRoom.users.filter((user) => user.id !== session.id)[0]
                  .username
              }
            />
          </div>
          <div className="flex flex-col justify-between py-2">
            <div className="flex gap-2 items-center">
              <span className="text-lg font-semibold">
                {
                  chatRoom.users.filter((user) => user.id !== session.id)[0]
                    .username
                }
              </span>
              <span className="text-xs text-neutral-400">
                {formatToTimeAgo(chatRoom.messages[0].created_at)}
              </span>
            </div>
            <span className="text-lg">{chatRoom.messages[0].payload}</span>
          </div>
          <div className="relative size-20 ml-auto">
            <Image
              fill
              src={chatRoom.product.photos[0].url || ""}
              alt={chatRoom.product.title}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
