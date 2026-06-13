import AsyncStorage from "@react-native-async-storage/async-storage";

import { MemberRole } from "@/types/member";

export interface CurrentUserAccess {
  role: MemberRole;
  isSuperAdmin: boolean;
}

export async function getCurrentUserAccess(): Promise<CurrentUserAccess | null> {
  const storedMember = await AsyncStorage.getItem("@app_icb:member");

  if (!storedMember) {
    return null;
  }

  const member = JSON.parse(storedMember);

  return {
    role: member.role,
    isSuperAdmin: member.isSuperAdmin === true,
  };
}

export function canManageMembers(access: CurrentUserAccess | null) {
  return access?.isSuperAdmin === true;
}

export function canManageFinance(access: CurrentUserAccess | null) {
  return access?.isSuperAdmin === true || access?.role === "TESOUREIRO";
}

export function canManageAssets(access: CurrentUserAccess | null) {
  return (
    access?.isSuperAdmin === true ||
    access?.role === "DIRETOR_PATRIMONIO"
  );
}

export function canManageEvents(access: CurrentUserAccess | null) {
  return access?.isSuperAdmin === true || access?.role === "PASTOR";
}
