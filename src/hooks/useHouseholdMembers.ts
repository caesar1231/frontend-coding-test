import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Relationship } from "@/enums/relationshipEnum";
import { HouseholdMember } from "@/models";
import { createHousehold, deleteHouseholdMember, getHousehold, getHouseholdMembers, updateHousehold, updateHouseholdMembers } from "@/services";
import { isValidAddress, isValidDate, isValidEmail, isValidFamilyName, isValidGivenName, isValidPhoneNumber, isValidRelationship, isValidZipCode } from "@/utils";

/**
 * 世帯・世帯員情報のCRUDを行う。
 * 世帯ID無しで呼び出した場合、全ての情報が空の状態で初期化される。
 * @param householdUid 世帯ID
 */
const useHouseholdMembers = (householdUid?: string) => {
  // 世帯情報
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  // 世帯員情報
  const [members, setMembers] = useState<HouseholdMember[]>([]);

  // 追加・削除したメンバーのIDを保存する
  const newMemberIds = useRef<string[]>([]);
  const removedMemberIds = useRef<string[]>([]);

  useEffect(() => {
    // 初期化
    newMemberIds.current = [];
    removedMemberIds.current = [];

    // 世帯データ取得
    if (!householdUid) return;
    getHouseholdMembers(householdUid)
      .then(setMembers)
      .catch(_ => {
        // エラーハンドリング
      });
    getHousehold(householdUid)
      .then(household => {
        setPhoneNumber(household.phoneNumber);
        setEmail(household.email);
        setZipCode(household.zipCode);
        setAddress(household.address);
      })
      .catch(_ => {
        // エラーハンドリング
      });
  }, [householdUid]);

  /**
   * 世帯と世帯員情報を保存する
   */
  const saveMembers = useCallback(async () => {
    // 世帯情報のバリデーション
    if (!isValidPhoneNumber(phoneNumber)) return;
    if (!isValidAddress(address)) return;
    if (!isValidEmail(email)) return;
    if (!isValidZipCode(zipCode)) return;

    // 世帯主がいるか判定する
    let hasSelf = false;
    // リクエストに含めるメンバーを格納
    const requestMembers = [];
    for (let member of members) {
      // 有効値判定
      if (!isValidFamilyName(member.familyName)) return;
      if (!isValidGivenName(member.givenName)) return;
      if (!isValidDate(member.birthday)) return;
      if (!isValidRelationship(member.relationship)) return;

      // 世帯主判定
      if (member.relationship === Relationship.Self) hasSelf = true;

      // 新規世帯員判定（新規の場合は一時IDが割り当てられているのでそれを外す）
      if (newMemberIds.current.includes(member.uid!)) {
        requestMembers.push({ ...member, uid: undefined });
      } else {
        requestMembers.push(member);
      }
    }
    if (!hasSelf) return;

    // 保存用世帯データ
    const household = { phoneNumber, zipCode, email, address };
    try {
      if (householdUid) {
        await Promise.all([
          updateHousehold(householdUid, household),
          updateHouseholdMembers(householdUid, requestMembers),
          ...removedMemberIds.current.map(e => deleteHouseholdMember(householdUid, e))
        ]);
      } else {
        const updatedHousehold = await createHousehold(household);
        await updateHouseholdMembers(updatedHousehold.uid, requestMembers);
      }
    } catch (_) {
      // エラーハンドリング
    }
  }, [phoneNumber, zipCode, email, address, members]);

  /**
   * データが空の世帯員を作成する
   */
  const addMember = useCallback(() => {
    const emptyMember = {
      uid: uuidv4(), // 一時IDを付与する
      familyName: "",
      givenName: "",
      birthday: "",
      relationship: "",
    };
    newMemberIds.current.push(emptyMember.uid);
    setMembers([...members, emptyMember]);
  }, [members]);

  /**
   * 世帯員を削除する
   */
  const removeMember = useCallback((id: string) => {
    const index = newMemberIds.current.indexOf(id);
    index !== -1 ? newMemberIds.current.splice(index, 1) : removedMemberIds.current.push(id);
    setMembers(members => members.filter(m => m.uid !== id));
  }, [members]);

  /**
   * 世帯員情報を更新する
   */
  const updateMember = useCallback((memberData: HouseholdMember) =>
      setMembers(members => 
        members.map(member => member.uid === memberData.uid ? memberData : member)
      ), [members]);

  return {
    phoneNumber, email, zipCode, address,
    setPhoneNumber, setEmail, setZipCode, setAddress,
    members, saveMembers, addMember, removeMember, updateMember
  };
};

export default useHouseholdMembers;
