"use client";

import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { TInitialProducts, getMoreProducts } from "@/app/(tabs)/home/actions";

interface IProductListProps {
  initialProducts?: TInitialProducts;
}

export default function ProductList({ initialProducts }: IProductListProps) {
  const [products, setProducts] = useState(initialProducts);

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        console.log(entries, observer);
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev: any) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    document.documentElement.style.scrollbarWidth = "none";
  }, []);

  const [productRefs, setProductRefs] = useState<React.Ref<HTMLDivElement>[]>(
    []
  );

  return (
    <div className="p-5 flex flex-col gap-5">
      {products?.map((product) => (
        <ListProduct
          key={product.id}
          {...product}
          photo={product.photo[0].url}
        />
      ))}
      {!isLastPage && (
        <span
          ref={trigger}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중" : "Load more"}
        </span>
      )}
    </div>
  );
}
