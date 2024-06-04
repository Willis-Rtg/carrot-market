import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { HTMLProps, useEffect, useRef, useState } from "react";

interface ISlideWrapper {
  children: React.ReactNode;
  // className: HTMLProps<HTMLElement>["className"];
}

export function useSlide(previews: string[]) {
  const slide = useRef<HTMLDivElement>(null);

  const slideCount = useRef(0);

  function leftSlide(e: React.MouseEvent) {
    e.preventDefault();
    if (slideCount.current == 0) {
      return;
    }
    slide!.current!.style.transform = `translateX(-${
      slide.current?.getBoundingClientRect().width! * (slideCount.current - 1)
    }px)`;
    slideCount.current -= 1;
  }

  function rightSlide(e: React.MouseEvent) {
    e.preventDefault();
    if (slideCount.current === previews.length - 1) {
      return;
    }
    slide!.current!.style.transform = `translateX(-${
      slide.current?.getBoundingClientRect().width! * (slideCount.current + 1)
    }px)`;
    slideCount.current += 1;
  }

  useEffect(() => {
    slideCount.current = 0;
  }, [previews]);

  const Wrapper: React.FC<ISlideWrapper> = ({ children }) => (
    <div className="relative aspect-square h-full flex self-start w-full overflow-hidden ">
      <div
        ref={slide}
        className="flex-1 h-full flex w-full transition-transform"
      >
        {children}
      </div>
      <div className="absolute top-[50%] p-3 z-10 w-full flex justify-between">
        <ArrowLeftIcon onClick={leftSlide} className="size-8" />
        <ArrowRightIcon onClick={rightSlide} className="size-8" />
      </div>
    </div>
  );

  return { Wrapper };
}
