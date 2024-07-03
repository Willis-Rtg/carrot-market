import { notFound } from "next/navigation";

export default function StreamDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
}
