import { Relationship } from '@/enums/relationshipEnum';
import { isValidDate, isValidFamilyName, isValidGivenName, isValidRelationship } from '@/utils';
import { ChangeEventHandler, useState } from 'react';

export interface HouseholdMemberCardProps {
  familyName: string
  givenName: string
  birthday: string
  relationship: string

  setFamilyName: (familyName: string) => void
  setGivenName: (givenName: string) => void
  setBirthday: (birthday: string) => void
  setRelationship: (relationship: string) => void

  /**
   * 世帯情報入力カード削除時のコールバック関数
   */
  onDeleteCard: () => void
}

export function HouseholdMemberCard({
  familyName, givenName, birthday, relationship,
  setFamilyName, setGivenName, setBirthday, setRelationship, onDeleteCard,
}: HouseholdMemberCardProps) {

  // 入力項目のエラー管理
  const [hasFamilyNameError, setFamilyNameError] = useState(false);
  const [hasGivenNameError, setGivenNameError] = useState(false);
  const [hasBirthdayError, setBirthdayError] = useState(false);
  const [hasRelationshipError, setRelationshipError] = useState(false);

  // 各種入力値の設定
  const handleFamilyNameChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setFamilyName(e.target.value);
  const handleGivenNameChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setGivenName(e.target.value);
  const handleBirthdayChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setBirthday(e.target.value);
  const handleRelationshipChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setRelationship(e.target.value);

  // 入力欄からフォーカスを外した際のエラー処理
  const handleFamilyNameUnfocus: ChangeEventHandler<HTMLInputElement> = (e) =>
    setFamilyNameError(!isValidFamilyName(e.target.value));
  const handleGivenNameUnfocus: ChangeEventHandler<HTMLInputElement> = (e) =>
    setGivenNameError(!isValidGivenName(e.target.value));
  const handleBirthdayUnfocus: ChangeEventHandler<HTMLInputElement> = (e) =>
    setBirthdayError(!isValidDate(e.target.value));
  const handleRelationshipUnfocus: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setRelationshipError(!isValidRelationship(e.target.value));

  // エラー表示用コンポーネント
  const errorPane = (title: string) => {
    return (
      <div className="col-span-4 text-red-500 text-sm mt-1 mb-3">{title}</div>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg px-4 pb-4 border border-gray-300">
      <div className="flex justify-between items-center">
        <div className="flex-grow"/>
        <button className="text-gray-500 hover:text-gray-700" onClick={onDeleteCard}>
          <span className="text-xl">×</span>
        </button>
      </div>
      <div className="mt-1">
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="block text-gray-600 col-span-1">名前</label>
          <div className="flex flex-col col-span-1">
            <input
              type="text"
              placeholder="姓"
              className="border rounded py-1 px-2"
              value={familyName}
              onChange={handleFamilyNameChange}
              onBlur={handleFamilyNameUnfocus}
            />
          </div>
          <div className="flex flex-col col-span-1">
            <input
              type="text"
              placeholder="名"
              className="border rounded py-1 px-2"
              value={givenName}
              onChange={handleGivenNameChange}
              onBlur={handleGivenNameUnfocus}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="block col-span-1" />
          <div className="flex flex-col col-span-1">
            {hasFamilyNameError && errorPane("姓を入力してください")}
          </div>
          <div className="flex flex-col col-span-1">
            {hasGivenNameError && errorPane("名を入力してください")}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 items-center mt-3">
          <label className="block text-gray-600 col-span-1">誕生日</label>
          <input
            type="text"
            className="border rounded py-1 px-2 w-full col-span-2"
            placeholder="例）1990-01-21"
            value={birthday}
            onChange={handleBirthdayChange}
            onBlur={handleBirthdayUnfocus}
          />
        </div>
        {hasBirthdayError && 
          <div className="grid grid-cols-3 gap-4 items-center mt-1">
            <span className="block col-span-1"/>
            <div className="flex flex-col col-span-2">
              {errorPane("誕生日を正しく入力してください")}
            </div>
          </div>
        } 

        <div className="grid grid-cols-3 gap-4 items-center mt-3">
          <label className="block text-gray-600 col-span-1">世帯主との続柄</label>
          <select
            className="border rounded py-1 px-2 w-full col-span-2"
            value={relationship}
            onChange={handleRelationshipChange}
            onBlur={handleRelationshipUnfocus}
          >
            <option value={""} disabled>続柄</option>
            {
              Object.entries(Relationship).map(([key, value]) =>
                (<option key={key} value={value}>{value}</option>))
            }
          </select>
        </div>

        {hasRelationshipError &&
          <div className="grid grid-cols-3 gap-4 items-center mt-3">
            <span className="block col-span-1"/>
            <div className="flex flex-col col-span-2">
              {errorPane("この項目は必須です")}
            </div>
          </div>
        }
      </div>
    </div>
  );
}
