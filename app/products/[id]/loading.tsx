import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Loading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      <div className="flex justify-center items-center border-4 border-neutral-700 aspect-square border-dashed text-neutral-700">
        <PhotoIcon className="h-32" />
      </div>
      <div className="flex gap-4 items-center">
        <div className="size-14 rounded-full bg-neutral-700" />
        <div className="flex flex-col gap-1 *:rounded-md">
          <div className="bg-neutral-700 h-4 w-40" />
          <div className="bg-neutral-700 h-4 w-20" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-neutral-700 h-4 w-10/12 rounded-md" />
        <div className="bg-neutral-700 h-4 w-6/12 rounded-md" />
      </div>
    </div>
  );
}
