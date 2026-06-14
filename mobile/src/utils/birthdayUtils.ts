import { Member } from "@/types/member";

export interface BirthdayMember extends Member {
  birthdayDay: number;
}

function getBirthDateParts(birthDate: string | null) {
  if (!birthDate) {
    return null;
  }

  const datePart = birthDate.substring(0, 10);
  const [, month, day] = datePart.split("-").map(Number);

  if (!month || !day) {
    return null;
  }

  return { month, day };
}

export function getCurrentMonthName(date = new Date()) {
  const monthName = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(date);

  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
}

export function getBirthdaysForMonth(
  members: Member[],
  date = new Date(),
): BirthdayMember[] {
  const currentMonth = date.getMonth() + 1;

  return members
    .flatMap((member) => {
      const birthDate = getBirthDateParts(member.birthDate);

      if (!birthDate || birthDate.month !== currentMonth) {
        return [];
      }

      return [{ ...member, birthdayDay: birthDate.day }];
    })
    .sort(
      (first, second) =>
        first.birthdayDay - second.birthdayDay ||
        first.name.localeCompare(second.name, "pt-BR"),
    );
}

export function formatBirthdayDay(day: number) {
  return String(day).padStart(2, "0");
}
