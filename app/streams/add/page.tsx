"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { startStream } from "./actions";
import { useFormState } from "react-dom";

export default function AddStream() {
  const [state, action] = useFormState(startStream, null);
  return (
    <form className="p-5 flex flex-col gap-5" action={action}>
      <Input
        name="title"
        required
        placeholder="Ttile or your stream"
        errors={state?.fieldErrors.title}
      />
      <Button text="Start streaming" />
    </form>
  );
}
