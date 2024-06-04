import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface IListProduct {
  id: number;
  title: string;
  photo: string;
  price: number;
  created_at: Date;
}

export default function ListProduct({
  id,
  title,
  photo,
  price,
  created_at,
}: IListProduct) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5" scroll={false}>
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image fill className="object-cover" src={photo} alt={title} priority />
      </div>
      <div className="flex flex-col gap-1 justify-center *:text-white ">
        <span className="text-lg">{title}</span>
        <span suppressHydrationWarning className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at)}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
      </div>
    </Link>
  );
}
