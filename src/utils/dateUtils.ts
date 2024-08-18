/**
 * 文字列が日付に変換可能かどうかを確認する
 * @param dateString 日付を示す文字列
 * @returns Date型に変換可能な場合はTrueを返す
 */
export function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
