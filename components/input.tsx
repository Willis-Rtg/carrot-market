import { InputHTMLAttributes } from "react";

interface IInputProps {
  errors?: string[];
}

export default function Input({
  errors = [],
  ...rest
}: IInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 ring-neutral-200 border-none focus:ring-2 focus:ring-orange-500 transition-shadow placeholder:text-neutral-400"
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium pl-1">
          {error}
        </span>
      ))}
    </div>
  );
}
