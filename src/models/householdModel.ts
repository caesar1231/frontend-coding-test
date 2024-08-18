/**
 * 世帯モデル
 */

export interface Household {
  uid: string,
  name?: string, // 検索時以外はundefined
  zipCode: string,
  address: string,
  phoneNumber: string,
  email: string,
  created: string,
  updated: string,
}

export interface FetchHouseholdsRequest {
  search: string,
  offset: number,
  limit: number,
}

export interface FetchHouseholdsResponse {
  count: number,
  households: Household[],
}

export interface CreateHouseholdRequest {
  zipCode: string,
  address: string,
  phoneNumber: string,
  email: string,
}
