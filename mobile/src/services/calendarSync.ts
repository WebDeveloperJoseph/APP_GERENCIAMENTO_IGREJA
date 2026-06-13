import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Calendar from "expo-calendar/legacy";
import { Platform } from "react-native";

import { ChurchEvent } from "@/types/event";

const STORAGE_KEY = "@app_icb:calendar_events";
const CALENDAR_TITLE = "APP ICB";
const CALENDAR_NAME = "app_icb_events";

interface SyncedEvent {
  nativeId: string;
  updatedAt: string;
}

type SyncedEvents = Record<string, SyncedEvent>;

export interface CalendarSyncResult {
  status: "synced" | "permission-denied" | "unavailable";
  syncedCount: number;
}

async function getOrCreateAppCalendar() {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  );
  const existingCalendar = calendars.find(
    (calendar) =>
      calendar.title === CALENDAR_TITLE &&
      calendar.allowsModifications &&
      calendar.isVisible !== false,
  );

  if (existingCalendar) {
    return existingCalendar.id;
  }

  const source =
    Platform.OS === "ios"
      ? (await Calendar.getDefaultCalendarAsync()).source
      : {
          isLocalAccount: true,
          name: CALENDAR_TITLE,
          type: Calendar.SourceType.LOCAL,
        };

  return Calendar.createCalendarAsync({
    title: CALENDAR_TITLE,
    color: "#0D47A1",
    entityType: Calendar.EntityTypes.EVENT,
    source,
    sourceId: source.id,
    name: CALENDAR_NAME,
    ownerAccount: CALENDAR_TITLE,
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
    isVisible: true,
    isSynced: true,
  });
}

export async function syncEventsWithDeviceCalendar(
  events: ChurchEvent[],
): Promise<CalendarSyncResult> {
  if (Platform.OS === "web") {
    return { status: "unavailable", syncedCount: 0 };
  }

  const permission = await Calendar.requestCalendarPermissionsAsync();

  if (!permission.granted) {
    return { status: "permission-denied", syncedCount: 0 };
  }

  const calendarId = await getOrCreateAppCalendar();
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const syncedEvents: SyncedEvents = stored ? JSON.parse(stored) : {};
  const now = Date.now();
  let syncedCount = 0;

  for (const event of events) {
    if (!event.isPublic || new Date(event.endDate).getTime() < now) {
      continue;
    }

    const synced = syncedEvents[event.id];
    const details = {
      title: event.title,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      location: event.location || undefined,
      notes: event.description || "Evento cadastrado pelo APP ICB.",
      calendarId,
    };

    if (synced?.updatedAt === event.updatedAt) {
      continue;
    }

    try {
      if (synced?.nativeId) {
        await Calendar.updateEventAsync(synced.nativeId, details);
        syncedEvents[event.id] = {
          nativeId: synced.nativeId,
          updatedAt: event.updatedAt,
        };
        syncedCount += 1;
        continue;
      }
    } catch {
      delete syncedEvents[event.id];
    }

    const nativeId = await Calendar.createEventAsync(calendarId, details);
    syncedEvents[event.id] = {
      nativeId,
      updatedAt: event.updatedAt,
    };
    syncedCount += 1;
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(syncedEvents));

  return { status: "synced", syncedCount };
}
