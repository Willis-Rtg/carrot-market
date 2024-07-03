import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

interface IInputProps {
  errors?: string[];
}

const _Input = (
  { errors = [], ...rest }: IInputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        ref={ref}
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
};

export default forwardRef(_Input);
