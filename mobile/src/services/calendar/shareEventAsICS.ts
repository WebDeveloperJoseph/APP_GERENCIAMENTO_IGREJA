import { File, Paths } from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export interface ShareableCalendarEvent {
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: string | Date;
  endDate: string | Date;
}

export function formatDateToICS(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("A data do evento e invalida.");
  }

  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function sanitizeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function generateSafeFileName(title: string) {
  const safeTitle = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeTitle || "evento"}-${Date.now()}.ics`;
}

async function openICSFileOnAndroid(fileUri: string) {
  if (Platform.OS !== "android") {
    return false;
  }

  try {
    const contentUri = await FileSystem.getContentUriAsync(fileUri);

    await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: contentUri,
      flags: 1,
      type: "text/calendar",
    });

    return true;
  } catch (error) {
    console.log(
      "Nenhum aplicativo abriu o ICS diretamente. Usando compartilhamento.",
      error,
    );
    return false;
  }
}

export async function shareEventAsICS(event: ShareableCalendarEvent) {
  try {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      throw new Error("As datas do evento sao invalidas.");
    }

    if (endDate < startDate) {
      throw new Error("O termino do evento nao pode ser anterior ao inicio.");
    }

    const uid = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@igrejaconnect.app`;
    const icsContent = `${[
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Igreja Connect//APP ICB//PT-BR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${formatDateToICS(new Date())}`,
      `DTSTART:${formatDateToICS(startDate)}`,
      `DTEND:${formatDateToICS(endDate)}`,
      `SUMMARY:${sanitizeText(event.title)}`,
      `DESCRIPTION:${sanitizeText(event.description || "")}`,
      `LOCATION:${sanitizeText(event.location || "")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")}\r\n`;

    const file = new File(Paths.cache, generateSafeFileName(event.title));
    file.create();
    file.write(icsContent);

    const openedDirectly = await openICSFileOnAndroid(file.uri);

    if (openedDirectly) {
      return;
    }

    const isSharingAvailable = await Sharing.isAvailableAsync();

    if (!isSharingAvailable) {
      throw new Error(
        "Nenhum aplicativo compativel com calendario foi encontrado.",
      );
    }

    await Sharing.shareAsync(file.uri, {
      dialogTitle: "Adicionar evento à agenda",
      mimeType: "text/calendar",
      UTI: "public.ics",
    });
  } catch (error) {
    console.error("Erro ao compartilhar evento como ICS:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Nao foi possivel gerar o arquivo do evento.");
  }
}
