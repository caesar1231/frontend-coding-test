import { Relationship } from "@/enums/relationshipEnum";

/**
 * 文字列が日付に変換可能かどうかを確認する
 * @param dateString 日付を示す文字列
 * @returns Date型に変換可能な場合はTrueを返す
 */
export function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isValidPhoneNumber(phoneNumber: string) {
  const pattern = new RegExp("^[0-9]{10,11}$");
  return pattern.test(phoneNumber);
}

export function isValidEmail(email: string) {
  const pattern = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
  return pattern.test(email);
}

export function isValidZipCode(zipCode: string) {
  const pattern = new RegExp("^[0-9]{7}$");
  return pattern.test(zipCode);
}

export function isValidAddress(address: string) {
  return address.length > 0;
}

export function isValidFamilyName(familyName: string) {
  return familyName.length > 0;
}

export function isValidGivenName(givenName: string) {
  return givenName.length > 0;
}

export function isValidRelationship(relationship: string) {
  return Object.values(Relationship).includes(relationship as any);
}
