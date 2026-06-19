import { getStoredUser } from "@/services/api";
import type { Member, Role } from "@/types";

export function getCurrentUser() {
  return getStoredUser<Member & { churchId?: string | null }>();
}

export function isSuperAdmin() {
  return Boolean(getCurrentUser()?.isSuperAdmin);
}

export function hasRole(roles: Role[]) {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  return Boolean(user.isSuperAdmin || roles.includes(user.role));
}

export function canManageMembers() {
  return hasRole(["ADMIN"]);
}

export function canManageEvents() {
  return hasRole(["PASTOR", "ADMIN"]);
}

export function canManageFinance() {
  return hasRole(["TESOUREIRO", "ADMIN"]);
}

export function canManageCommunication() {
  return hasRole(["PASTOR", "ADMIN"]);
}
