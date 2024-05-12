interface IFromBtnProps {
  text: string;
  loading?: boolean;
}

export default function FormBtn({ text, loading = false }: IFromBtnProps) {
  return (
    <button
      className="primary-btn py-2 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
      disabled={loading}
    >
      {loading ? "로딩 중..." : text}
    </button>
  );
}
