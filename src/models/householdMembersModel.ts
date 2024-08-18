/**
 * 世帯員モデル
 */

import { Relationship } from "@/enums/relationshipEnum";

export interface HouseholdMember {
  uid?: string,
  householdUid: string,
  familyName: string,
  givenName: string,
  birthday: string,
  relationship: Relationship,
  created?: string,
  updated?: string,
}

export interface DeleteHouseholdMemberResponse {
  householdUid: string,
  householdMemberUid: string,
}
