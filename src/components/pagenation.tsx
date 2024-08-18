import { useState } from "react";

export interface PaginationProps  {
  /**
   * ページ変更時のコールバック関数
   * @param page 現在のページ番号-1（表示が1の場合は0）
   * @returns 
   */
  onChange: (page: number) => void,

  /**
   * 全ページ数
   */
  pageCount: number,

  /**
   * 画面上に表示するページ数
   */
  displayedPageCount: number,
}

/**
 * ページネーション用コンポーネント
 */
export function Pagination({ onChange, pageCount, displayedPageCount } : PaginationProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onChange(page);
  };

  // 表示する中で最もページ番号
  const startIndex = Math.min(
    Math.max(0, pageCount - displayedPageCount),
    Math.max(0, currentPage - Math.floor(displayedPageCount / 2))
  );
  // 全ページ番号を格納した配列
  const pages = Array.from(
    { length: Math.min(displayedPageCount, pageCount) },
    (_, i) => startIndex + i);

  return (
    <ul className="flex list-none">
      {currentPage > 0 && (
        <li>
          <button
            className="px-4 py-2 mx-1 text-white bg-blue-500 hover:bg-blue-600 rounded"
            onClick={() => handlePageChange(currentPage - 1)}
          >{"<"}</button>
        </li>
      )}
      {pages.map(page => (
        <li key={page}>
          <button
            className={`px-4 py-2 mx-1 rounded ${page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            onClick={() => handlePageChange(page)}
          >
            {page + 1}
          </button>
        </li>
      ))}
      {currentPage < pageCount - 1 && (
        <li>
          <button
            className="px-4 py-2 mx-1 text-white bg-blue-500 hover:bg-blue-600 rounded"
            onClick={() => handlePageChange(currentPage + 1)}
          >{">"}</button>
        </li>
      )}
    </ul>
  );
}