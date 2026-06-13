export interface EventCreator {
  id: string;
  name: string;
  email: string | null;
  role: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  coverImageUrl: string | null;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  createdById: string | null;
  createdBy: EventCreator | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventFormValues {
  title: string;
  description: string;
  location: string;
  coverImageUrl: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isPublic: boolean;
}
