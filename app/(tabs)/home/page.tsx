import ProductList from "@/components/product-list";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getInitialProducts } from "./actions";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";

const getCachedProducts = nextCache(getInitialProducts, ["home-products"]);

export function generateMetadata() {
  return {
    title: "Home",
  };
}

export default async function Products() {
  const initialProducts = await getCachedProducts();

  // async function revalidate() {
  //   "use server";
  //   revalidatePath("/home");
  // }

  return (
    <div className="pb-20">
      <ProductList {...{ initialProducts }} />
      {/* <form action={revalidate}>
        <button>revalidate</button>
      </form> */}
      <Link
        className={`fixed bottom-24 right-10 md:right-[calc(50vw-280px)] size-16 bg-orange-500 rounded-full text-white flex justify-center items-center transition-colors hover:bg-orange-400`}
        href={`/products/add`}
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
