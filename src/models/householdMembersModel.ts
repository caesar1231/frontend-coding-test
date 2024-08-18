/**
 * 世帯員モデル
 */

export interface HouseholdMember {
  uid?: string,
  householdUid: string,
  familyName: string,
  givenName: string,
  birthday: string,
  relationship: string,
  created?: string,
  updated?: string,
}

export interface DeleteHouseholdMemberResponse {
  householdUid: string,
  householdMemberUid: string,
}
