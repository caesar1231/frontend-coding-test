import api from "@/services/apiConfig";
import {
  HouseholdMember,
  DeleteHouseholdMemberResponse,
} from "@/models";

/**
 * 指定した世帯に紐づく世帯員の一覧を取得するAPI
 * @param householdUid 世帯ID
 * @returns 
 */
export const getHouseholdMembers = async (householdUid: string) => {
  try {
    const response = await api.get<HouseholdMember[]>(`/households/${householdUid}/members`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 世帯に紐づく世帯員の追加および更新を行うAPI
 * 
 * データ中の世帯員uidについて、
 * - uidを指定しない場合、新規で世帯員を追加する
 * - uidを指定する場合、該当する世帯員を更新する
 * - 指定したuidが存在しない場合はエラー
 * @param householdUid 世帯ID
 */
export const updateHouseholdMembers = async (householdUid: string, data: HouseholdMember[]) => {
  try {
    const response = await api.post<HouseholdMember[]>(
      `/households/${householdUid}/members`,
      data,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 世帯員削除API
 * @param householdUid 世帯ID
 * @param householdMemberUid 世帯員ID
 * @returns 
 */
export const deleteHouseholdMember = async (householdUid: string, householdMemberUid: string) => {
  try {
    const response = await api.delete<DeleteHouseholdMemberResponse>(`/households/${householdUid}/members/${householdMemberUid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}