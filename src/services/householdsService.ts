import api from "@/services/apiConfig";
import {
  Household,
  FetchHouseholdsRequest,
  FetchHouseholdsResponse,
  CreateHouseholdRequest,
  UpdateHouseholdRequest,
} from "@/models";

/**
 * 世帯検索API
 * @param data 
 * @returns 
 */
export const getMultipleHouseholds = async (data: FetchHouseholdsRequest) => {
  try {
    const response = await api.post<FetchHouseholdsResponse>("/households", data);
    return response.data;
  } catch (error) {
      throw error;
  }
};

/**
 * 世帯作成API
 * @param data 
 * @returns nameパラメータはundefinedになっている点に注意
 */
export const createHoushold = async (data: CreateHouseholdRequest) => {
  try {
    const response = await api.post<Household>("/households", data);
    return response.data;
  } catch (error) {
      throw error;
  }
};

/**
 * 世帯取得API
 * @param uid 世帯ID
 * @returns nameパラメータはundefinedになっている点に注意
 */
export const getHousehold = async (uid: string) => {
  try {
    const response = await api.get<Household>(
      `/households/${uid}`,
    );
    return response.data;
  } catch (error) {
      throw error;
  }
};

/**
 * 世帯更新API
 * @param uid 世帯ID
 * @param data 
 * @returns nameパラメータはundefinedになっている点に注意
 */
export const updateHousehold = async (uid: string, data: UpdateHouseholdRequest) => {
  try {
    const response = await api.put<Household>(`/households/${uid}`, data);
    return response.data;
  } catch (error) {
      throw error;
  }
};
