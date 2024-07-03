import { notFound } from "next/navigation";
import { ProductDetailCilent } from "./client";
import { getCachedProductTitle, getIsOwner, getProduct } from "./actions";
import db from "@/lib/db";

export async function generateMetadata({ params }: { params: { id: number } }) {
  // export async function generateMetadata(props: any) {
  // console.log(props);
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

  // async function revalidate() {
  //   "use server";

  //   revalidateTag("product-title");
  // }

  const product = await getProduct(id);
  const isOwner = await getIsOwner(product?.userId!);

  return (
    <div className="flex flex-col pb-20">
      {/* <form action={revalidate}>
        <button>revalidate</button>
      </form> */}
      <ProductDetailCilent product={product} isOwner={isOwner} />
    </div>
  );
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
    take: 7,
    orderBy: {
      created_at: "desc",
    },
  });
  return products.map((product) => ({ id: product.id + "" }));
}
