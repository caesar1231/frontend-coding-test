import { ChangeEventHandler, useState } from "react";

import { PageTitle } from "@/components/common/pageTitle";
import { HouseholdMemberCard } from "@/components/householdMemberCard";
import { isValidAddress, isValidEmail, isValidPhoneNumber, isValidZipCode } from "@/utils";
import { HouseholdMember } from "@/models";

interface HouseholdEditComponentProps {
  // 見出し
  pageTitle: string

  // 世帯情報
  phoneNumber: string
  email: string
  zipCode: string
  address: string
  setPhoneNumber: (phoneNumber: string) => void
  setEmail: (email: string) => void
  setZipCode: (zipCode: string) => void
  setAddress: (address: string) => void

  // 世帯員情報
  members: HouseholdMember[]

  // 世帯員CRUD用コールバック関数
  saveMembers: () => Promise<void>
  addMember: () => void
  removeMember: (uid: string) => void
  updateMember: (member: HouseholdMember) => void
}

/**
 * 世帯情報編集コンポーネント
 */
export function HouseholdEditComponent({
  pageTitle,
  phoneNumber, email, zipCode, address,
  setPhoneNumber, setEmail, setZipCode, setAddress,
  members, saveMembers, addMember, removeMember, updateMember }: HouseholdEditComponentProps)
{

  // 入力項目のエラー管理
  const [hasPhoneNumberError, setPhoneNumberError] = useState(false);
  const [hasEmailError, setEmailError] = useState(false);
  const [hasZipCodeError, setZipCodeError] = useState(false);
  const [hasAddressError, setAddressError] = useState(false);

  // 世帯編集時の入力項目設定
  const handlePhoneNumberChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setPhoneNumber(e.target.value);
  const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setEmail(e.target.value);
  const handleZipCodeChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setZipCode(e.target.value);
  const handleAddressChange: ChangeEventHandler<HTMLTextAreaElement> = (e) =>
    setAddress(e.target.value);

  // 入力箇所からフォーカスを外した際のエラー処理
  const handlePhoneNumberUnfocus: ChangeEventHandler<HTMLInputElement> = (e) =>
    setPhoneNumberError(!isValidPhoneNumber(e.target.value));
  const handleEmailUnfocus: ChangeEventHandler<HTMLInputElement> = (e) =>
    setEmailError(!isValidEmail(e.target.value));
  const handleZipCodeUnfocus: ChangeEventHandler<HTMLInputElement> = (e) =>
    setZipCodeError(!isValidZipCode(e.target.value));
  const handleAddressUnfocus: ChangeEventHandler<HTMLTextAreaElement> = (e) =>
    setAddressError(!isValidAddress(e.target.value));

  // 世帯員編集時の入力項目設定
  const handleFamilyNameChange = (member: HouseholdMember, familyName: string) =>
    updateMember({ ...member, familyName });
  const handleGivenNameChange = (member: HouseholdMember, givenName: string) =>
    updateMember({ ...member, givenName });
  const handleBirthdayChange = (member: HouseholdMember, birthday: string) =>
    updateMember({ ...member, birthday });
  const handleRelationshipChange = (member: HouseholdMember, relationship: string) =>
    updateMember({ ...member, relationship });

  // 世帯員情報の削除時にポップアップを表示する
  const removeMemberData = (id: string) => {
    const removedMember = members.find(e => e.uid === id)!;
    const message =
      removedMember.familyName && removedMember.givenName
        ? `${removedMember.familyName} ${removedMember.givenName} さんを削除しますか？`
        : "この世帯情報を削除しますか？";
    const willDelete = window.confirm(message);
    if (!willDelete) return;
    removeMember(id);
  };

  // 入力欄コンポーネント
  const inputPane = (
    title: string, placeholder: string, value: string,
    onChange: ChangeEventHandler<HTMLInputElement>, onBlur: ChangeEventHandler<HTMLInputElement>
  ) => {
    return (
      <div className="grid grid-cols-4 gap-4 items-center mb-4">
          <label className="col-span-1 text-gray-700 text-sm font-bold">{title}</label>
          <input
            className="
              col-span-3 shadow appearance-none border rounded py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline
            "
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        </div>
    );
  };
  // エラー表示コンポーネント
  const errorPane = (title: string) => {
    return (
      <div className="col-span-4 text-red-500 text-sm mt-2 mb-10">{title}</div>
    );
  };

  return (
    <>
      <PageTitle title={pageTitle} />
      <h2 className="text-xl font-bold my-4">世帯情報</h2>

      <div className="px-5">
        {inputPane(
          "電話番号", "10 桁もしくは 11 桁の半角数字を入力", phoneNumber,
          handlePhoneNumberChange, handlePhoneNumberUnfocus
        )}
        {hasPhoneNumberError && errorPane("10 桁もしくは 11 桁の半角数字を入力してください")}

        {inputPane(
          "メールアドレス", "メールアドレスを入力", email,
          handleEmailChange, handleEmailUnfocus
        )}
        {hasEmailError && errorPane("メールアドレスの形式で入力してください")}

        {inputPane(
          "郵便番号（ハイフン無し）", "7 桁の半角数字を入力", zipCode,
          handleZipCodeChange, handleZipCodeUnfocus
        )}
        {hasZipCodeError && errorPane("7 桁の半角数字を入力してください")}

        <div className="grid grid-cols-4 gap-4 items-center mb-4">
          <label className="col-span-1 text-gray-700 text-sm font-bold">住所</label>
          <textarea
            className="
              col-span-3 shadow appearance-none border rounded py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline"
            value={address}
            onChange={handleAddressChange}
            onBlur={handleAddressUnfocus}
          />
        </div>
        {hasAddressError && errorPane("住所を入力してください")}
      </div>

      <h2 className="text-xl font-bold my-4">世帯員一覧</h2>
      <div className="py-2 px-5">
        {members.map((member) => (
          <div className="mb-3" key={member.uid}>
            <HouseholdMemberCard
              familyName={member.familyName}
              givenName={member.givenName}
              birthday={member.birthday}
              relationship={member.relationship}
              setFamilyName={(familyName) => handleFamilyNameChange(member, familyName)}
              setGivenName={(givenName) => handleGivenNameChange(member, givenName)}
              setBirthday={(birthday) => handleBirthdayChange(member, birthday)}
              setRelationship={(relationship) => handleRelationshipChange(member, relationship)}
              onDeleteCard={() => removeMemberData(member.uid!)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
          onClick={addMember}
        >
          + 新しい世帯員を追加
        </button>
        
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-20"
          type="submit"
          onClick={saveMembers}
        >
          世帯情報を保存
        </button>
      </div>

    </>
  );
}