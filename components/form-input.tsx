interface IFormInputProps {
  type: string;
  placeholder: string;
  required: boolean;
  errors: string[];
}

export default function FormInput({
  type,
  placeholder,
  required,
  errors,
}: IFormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 ring-neutral-200 border-none focus:ring-2 focus:ring-orange-500 transition-shadow placeholder:text-neutral-400"
        type={type}
        placeholder={placeholder}
        required={required}
      />
      {errors.map((error) => (
        <span className="text-red-500 font-medium pl-1">{error}</span>
      ))}
    </div>
  );
}
