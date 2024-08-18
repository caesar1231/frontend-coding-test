import { ChangeEventHandler, useState } from "react";

import { PageTitle } from "@/components/common/pageTitle";

export function CreateHouseholdPage() {

  // 入力項目
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");

  // 入力項目のエラー管理
  const [hasPhoneNumberError, setPhoneNumberError] = useState(false);
  const [hasEmailError, setEmailError] = useState(false);
  const [hasZipCodeError, setZipCodeError] = useState(false);
  const [hasAddressError, setAddressError] = useState(false);

  // 各種入力値の設定
  const handlePhoneNumberChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setPhoneNumber(e.target.value);
  const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setEmail(e.target.value);
  const handleZipCodeChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setZipCode(e.target.value);
  const handleAddressChange: ChangeEventHandler<HTMLTextAreaElement> = (e) =>
    setAddress(e.target.value);

  // 入力箇所からフォーカスを外した際のエラー処理
  const handlePhoneNumberUnfocus: ChangeEventHandler<HTMLInputElement> = (e) => {
    const pattern = new RegExp("^[0-9]{10,11}$");
    setPhoneNumberError(!pattern.test(e.target.value));
  }
  const handleEmailUnfocus: ChangeEventHandler<HTMLInputElement> = (e) => {
    const pattern = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
    setEmailError(!pattern.test(e.target.value));
  }
  const handleZipCodeUnfocus: ChangeEventHandler<HTMLInputElement> = (e) => {
    const pattern = new RegExp("^[0-9]{7}$");
    setZipCodeError(!pattern.test(e.target.value));
  }
  const handleAddressUnfocus: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setAddressError(e.target.value.length <= 0);
  }

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
      <PageTitle title={"世帯新規追加"} />
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
    </>
  );
}
