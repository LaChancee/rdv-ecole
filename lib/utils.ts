import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(teacherName: string, sessionName: string): string {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return `${normalize(teacherName)}-${normalize(sessionName)}`;
}

export function generateTimeSlots(config: {
  dates: Date[];
  startTime: string;
  endTime: string;
  duration: number;
}): { date: Date; startTime: string; endTime: string }[] {
  const slots: { date: Date; startTime: string; endTime: string }[] = [];

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const startMinutes = parseTime(config.startTime);
  const endMinutes = parseTime(config.endTime);

  for (const date of config.dates) {
    let currentStart = startMinutes;
    while (currentStart + config.duration <= endMinutes) {
      slots.push({
        date,
        startTime: formatTime(currentStart),
        endTime: formatTime(currentStart + config.duration),
      });
      currentStart += config.duration;
    }
  }

  return slots;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatTime(time: string): string {
  return time.replace(":", "h");
}

export function groupBy<T, K extends string | number>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = key(item);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<K, T[]>
  );
}
