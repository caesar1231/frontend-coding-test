import { useCallback, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Relationship } from "@/enums/relationshipEnum";
import { HouseholdMember } from "@/models";
import { createHoushold as createHousehold, updateHouseholdMembers } from "@/services";
import { isValidAddress, isValidDate, isValidEmail, isValidFamilyName, isValidGivenName, isValidPhoneNumber, isValidRelationship, isValidZipCode } from "@/utils";

const useHouseholdMembers = () => {
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const newMemberIds = useRef<string[]>([]);

  /**
   * 世帯と世帯員情報を保存する
   */
  const saveMembers = useCallback(async (zipCode: string, address: string, phoneNumber: string, email: string) => {
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
      const relationshipVal = Relationship[member.relationship as unknown as keyof typeof Relationship];
      if (relationshipVal === Relationship.Self) hasSelf = true;

      // 新規世帯員判定（新規の場合は一時IDが割り当てられているのでそれを外す）
      if (newMemberIds.current.includes(member.uid!)) {
        requestMembers.push({ ...member, uid: undefined });
      } else {
        requestMembers.push(member);
      }
    }
    if (!hasSelf) return;

    try {
      const household = await createHousehold({ zipCode, address, phoneNumber, email });
      return await updateHouseholdMembers(household.uid, requestMembers);
    } catch (_) {
      // エラーハンドリング
    }
  }, [members]);

  /**
   * データが空の世帯員を作成する
   */
  const addMember = useCallback(() => {
    const emptyMember = {
      uid: uuidv4(), // 一時IDを付与する
      familyName: "",
      givenName: "",
      birthday: "",
    };
    newMemberIds.current.push(emptyMember.uid);
    setMembers([...members, emptyMember]);
  }, []);

  /**
   * 世帯員を削除する
   */
  const removeMember = useCallback((id: string) => {
    const i = newMemberIds.current.indexOf(id);
    if (i !== -1) newMemberIds.current.splice(i, 1);
    setMembers(members => members.filter(m => m.uid !== id));
  }, [members]);

  /**
   * 世帯員情報を更新する
   */
  const updateMember = useCallback((
    id: string, familyName: string, givenName: string,
    birthday: string, relationship?: Relationship) =>
      setMembers(members => 
        members.map(member => member.uid === id
          ? {
              ...member,
              familyName: familyName,
              givenName: givenName,
              birthday: birthday,
              relationship: relationship,
            }
          : member)
      ), [members]);

  return { members, saveMembers, addMember, removeMember, updateMember };
};

export default useHouseholdMembers;
