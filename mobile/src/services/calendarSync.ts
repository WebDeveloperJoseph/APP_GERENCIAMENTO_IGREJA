import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Calendar from "expo-calendar";
import { Platform } from "react-native";

import { ChurchEvent } from "@/types/event";

const STORAGE_KEY = "@app_icb:calendar_events";

interface SyncedEvent {
  nativeId: string;
  updatedAt: string;
}

type SyncedEvents = Record<string, SyncedEvent>;

export async function syncEventsWithDeviceCalendar(events: ChurchEvent[]) {
  if (Platform.OS === "web") {
    return;
  }

  const permission = await Calendar.requestCalendarPermissions();

  if (!permission.granted) {
    return;
  }

  const calendars = await Calendar.getCalendars(Calendar.EntityTypes.EVENT);
  const writableCalendar = calendars.find(
    (calendar) => calendar.allowsModifications,
  );

  if (!writableCalendar) {
    return;
  }

  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const syncedEvents: SyncedEvents = stored ? JSON.parse(stored) : {};
  const now = Date.now();

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
    };

    if (synced?.updatedAt === event.updatedAt) {
      continue;
    }

    try {
      if (synced?.nativeId) {
        const nativeEvent = await Calendar.ExpoCalendarEvent.get(
          synced.nativeId,
        );
        await nativeEvent.update(details);
        syncedEvents[event.id] = {
          nativeId: synced.nativeId,
          updatedAt: event.updatedAt,
        };
        continue;
      }
    } catch {
      delete syncedEvents[event.id];
    }

    const nativeEvent = await writableCalendar.createEvent(details);
    syncedEvents[event.id] = {
      nativeId: nativeEvent.id,
      updatedAt: event.updatedAt,
    };
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(syncedEvents));
}
