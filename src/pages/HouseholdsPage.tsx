import {
  useState, useEffect, useRef,
  ChangeEventHandler, KeyboardEventHandler,
} from "react";

import { Household } from "@/models";
import { getMultipleHouseholds } from "@/services";
import { Pagination } from "@/components/pagenation";
import { PageTitle } from "@/components/common/pageTitle";
import { useNavigate } from "react-router-dom";

// ページ中で表示可能な最大世帯数
const SEARCH_LIMIT = 20;

export function HouseholdsPage() {
  const navigate = useNavigate();

  // 検索パラメータ
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  // 検索結果の世帯一覧
  const [households, setHouseholds] = useState<Household[]>([]);

  // 検索フォームの文字列
  const [queryText, setQueryText] = useState("");

  // 検索結果数
  const count = useRef(0);

  useEffect(() => {
    // 世帯一覧取得APIの呼び出し
    const request = {
      search: query,
      offset: page * SEARCH_LIMIT,
      limit: SEARCH_LIMIT,
    };
    getMultipleHouseholds(request)
      .then(response => {
        setHouseholds(response.households);
        count.current = response.count;
      }).catch(_ => {
        // エラーハンドリング
      })
  }, [query, page]);

  // 検索時に呼び出す
  const search = () => {
    setQuery(queryText);
    setPage(0);
  };

  const handleQueryChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setQueryText(e.target.value);
  const handleSearchUnfocus: ChangeEventHandler<HTMLInputElement> = search;
  const handleSearchEnter: KeyboardEventHandler<HTMLInputElement> = (e) =>
    e.key === "Enter" && search();

  // 画面遷移
  const handleCreateHousehold = () => navigate("/households/new");
  const handleEditHousehold = (uid: string) => navigate(`/households/${uid}`);

  return (
    <>
      <PageTitle title={"世帯一覧"} />
      <div className="mb-4 flex space-x-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="電話番号、メールアドレスで検索"
          value={queryText}
          onChange={handleQueryChange}
          onBlur={handleSearchUnfocus}
          onKeyDown={handleSearchEnter}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCreateHousehold}
        >
          +
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4">世帯id</th>
              <th className="text-left py-3 px-4">世帯主名</th>
              <th className="text-left py-3 px-4">電話番号</th>
              <th className="text-left py-3 px-4">メールアドレス</th>
              <th className="text-left py-3 px-4">住所</th>
            </tr>
          </thead>
          <tbody>
            {
              households.length === 0
                ? "該当する世帯はありません。"
                : households.map((household, i) => (
                    <tr key={i}>
                      <td>
                        <button onClick={() => handleEditHousehold(household.uid)}>
                          {household.uid}
                        </button>
                      </td>
                      <td>{household.name}</td>
                      <td>{household.phoneNumber}</td>
                      <td>{household.email}</td>
                      <td>{household.address}</td>
                    </tr>
                  ))
            }
          </tbody>
        </table>
      </div>
      <div className="flex justify-center py-5">
        {
          count.current > 0 && 
            <Pagination
              key={query}
              pageCount={Math.ceil(count.current / SEARCH_LIMIT)}
              displayedPageCount={5}
              onChange={setPage}
            />
        }
      </div>
    </>
  );
}
