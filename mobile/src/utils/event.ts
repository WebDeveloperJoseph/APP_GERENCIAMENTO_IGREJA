import { EventFormValues } from "@/types/event";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatDateInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatTimeInput(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseLocalDateTime(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const parsed = new Date(year, month - 1, day, hours, minutes);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hours ||
    parsed.getMinutes() !== minutes
  ) {
    return null;
  }

  return parsed;
}

export function eventValuesToPayload(values: EventFormValues) {
  const startDate = parseLocalDateTime(values.startDate, values.startTime);
  const endDate = parseLocalDateTime(values.endDate, values.endTime);

  if (!startDate || !endDate) {
    return null;
  }

  return {
    title: values.title.trim(),
    description: values.description.trim() || null,
    location: values.location.trim() || null,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    isPublic: values.isPublic,
  };
}

export function eventToFormValues(event: {
  title: string;
  description: string | null;
  location: string | null;
  coverImageUrl: string | null;
  startDate: string;
  endDate: string;
  isPublic: boolean;
}): EventFormValues {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return {
    title: event.title,
    description: event.description || "",
    location: event.location || "",
    coverImageUrl: event.coverImageUrl || "",
    startDate: formatDateInput(startDate),
    startTime: formatTimeInput(startDate),
    endDate: formatDateInput(endDate),
    endTime: formatTimeInput(endDate),
    isPublic: event.isPublic,
  };
}

export function getDefaultEventValues(): EventFormValues {
  const startDate = new Date();
  startDate.setMinutes(0, 0, 0);
  startDate.setHours(startDate.getHours() + 1);

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);

  return {
    title: "",
    description: "",
    location: "",
    coverImageUrl: "",
    startDate: formatDateInput(startDate),
    startTime: formatTimeInput(startDate),
    endDate: formatDateInput(endDate),
    endTime: formatTimeInput(endDate),
    isPublic: true,
  };
}

export function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatEventTime(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatEventPeriod(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const sameDay = startDate.toDateString() === endDate.toDateString();

  if (sameDay) {
    return `${formatEventDate(start)} · ${formatEventTime(start)} às ${formatEventTime(end)}`;
  }

  return `${formatEventDate(start)}, ${formatEventTime(start)} até ${formatEventDate(end)}, ${formatEventTime(end)}`;
}

export function getMonthLabel(date: Date) {
  const label = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);

  return label.charAt(0).toUpperCase() + label.slice(1);
}
