interface PageTitleProps {
  title: string
}

/**
 * 各ページタイトル用共通コンポーネント
 */
export function PageTitle({ title }: PageTitleProps) {
  return (
    <h1 className="text-2xl font-bold text-gray-800 my-6">{title}</h1>
  );
}
