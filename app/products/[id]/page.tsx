import { notFound } from "next/navigation";
import { ProductInfo } from "./components";
import { getCachedProductTitle } from "./actions";
import { revalidateTag } from "next/cache";
import db from "@/lib/db";

export async function generateMetadata({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProductTitle(id);
  return {
    title: `Product ${product?.title}`,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: number };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  async function revalidate() {
    "use server";

    revalidateTag("product-title");
  }

  return (
    <div className="flex flex-col pb-20">
      <form action={revalidate}>
        <button>revalidate</button>
      </form>
      <ProductInfo id={id} />
    </div>
  );
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
    where: {
      id: 14 || 13,
    },
  });
  return products.map((product) => ({ id: product.id + "" }));
}
