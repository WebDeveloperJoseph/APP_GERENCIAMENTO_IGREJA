import { MEMBER_ROLE_OPTIONS, MemberRole } from "@/types/member";

export function getMemberInitials(name: string) {
  const names = name.trim().split(/\s+/).filter(Boolean);

  if (names.length === 0) {
    return "?";
  }

  const firstInitial = names[0][0];
  const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function getMemberRoleLabel(role: MemberRole) {
  return (
    MEMBER_ROLE_OPTIONS.find((option) => option.value === role)?.label || role
  );
}
