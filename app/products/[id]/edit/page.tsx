import { getProduct } from "../actions";
import { notFound } from "next/navigation";
import ProductEditClient from "./client";

export default async function AddProduct({
  params,
}: {
  params: { id: number };
}) {
  if (isNaN(Number(params.id))) {
    return notFound();
  }

  const product = await getProduct(+params.id);

  return <ProductEditClient product={product} />;
}
