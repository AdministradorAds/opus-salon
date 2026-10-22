import {
  addDays,
  addMinutes,
  format,
  isBefore,
  parse,
  parseISO,
  startOfDay,
} from "date-fns";
import type { Booking, Database, Professional, Service } from "./types";

function parseTimeOnDate(date: string, time: string): Date {
  return parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date());
}

function overlaps(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function activeBookings(db: Database, professionalId: string, date: string) {
  return db.bookings.filter(
    (b) =>
      b.professionalId === professionalId &&
      b.date === date &&
      (b.status === "solicitado" || b.status === "confirmado"),
  );
}

export function getServiceProfessionals(
  db: Database,
  service: Service,
): Professional[] {
  return db.professionals.filter(
    (p) => p.active && service.professionalIds.includes(p.id),
  );
}

export function getAvailableSlots(
  db: Database,
  serviceId: string,
  professionalId: string | "any",
  date: string,
): string[] {
  const service = db.services.find((s) => s.id === serviceId && s.active);
  if (!service || !service.durationMinutes) return [];

  const { settings } = db;
  const day = parseISO(date);
  const today = startOfDay(new Date());
  if (isBefore(day, today)) return [];

  const maxDate = addDays(today, settings.maxAdvanceDays);
  if (day > maxDate) return [];

  const weekday = String(day.getDay());
  let professionals: Professional[];

  if (professionalId === "any") {
    professionals = getServiceProfessionals(db, service);
  } else {
    const p = db.professionals.find((x) => x.id === professionalId && x.active);
    professionals = p ? [p] : [];
  }

  if (!professionals.length) return [];

  const minTime = addMinutes(new Date(), settings.minAdvanceHours * 60);
  const slots = new Set<string>();

  for (const pro of professionals) {
    const hours =
      pro.workHours[weekday] ?? settings.openHours[weekday] ?? null;
    if (!hours) continue;

    let cursor = parseTimeOnDate(date, hours.start);
    const end = parseTimeOnDate(date, hours.end);
    const duration = service.durationMinutes + settings.bufferMinutes;
    const booked = activeBookings(db, pro.id, date);

    while (addMinutes(cursor, service.durationMinutes) <= end) {
      const slotStart = cursor;
      const slotEnd = addMinutes(cursor, duration);
      const label = format(slotStart, "HH:mm");

      if (slotStart >= minTime) {
        const conflict = booked.some((b) =>
          overlaps(
            slotStart,
            slotEnd,
            parseTimeOnDate(date, b.startTime),
            parseTimeOnDate(date, b.endTime),
          ),
        );
        if (!conflict) slots.add(label);
      }

      cursor = addMinutes(cursor, settings.slotIntervalMinutes);
    }
  }

  return Array.from(slots).sort();
}

export function canBookSlot(
  db: Database,
  serviceId: string,
  professionalId: string,
  date: string,
  startTime: string,
): { ok: true; endTime: string; professionalId: string } | { ok: false; error: string } {
  const service = db.services.find((s) => s.id === serviceId && s.active);
  if (!service) return { ok: false, error: "Serviço não encontrado." };
  if (!service.durationMinutes) {
    return {
      ok: false,
      error: "Duração do serviço ainda não configurada. Fale conosco pelo WhatsApp.",
    };
  }

  let proId = professionalId;
  if (professionalId === "any" || professionalId === "pro-any") {
    const slots = getAvailableSlots(db, serviceId, "any", date);
    if (!slots.includes(startTime)) {
      return { ok: false, error: "Horário indisponível." };
    }
    // Pick first available professional for that slot
    const candidates = getServiceProfessionals(db, service);
    const weekday = String(parseISO(date).getDay());
    const start = parseTimeOnDate(date, startTime);
    const end = addMinutes(
      start,
      service.durationMinutes + db.settings.bufferMinutes,
    );

    const match = candidates.find((pro) => {
      const hours = pro.workHours[weekday] ?? db.settings.openHours[weekday];
      if (!hours) return false;
      const openStart = parseTimeOnDate(date, hours.start);
      const openEnd = parseTimeOnDate(date, hours.end);
      if (start < openStart || end > openEnd) return false;
      return !activeBookings(db, pro.id, date).some((b) =>
        overlaps(
          start,
          end,
          parseTimeOnDate(date, b.startTime),
          parseTimeOnDate(date, b.endTime),
        ),
      );
    });

    if (!match) return { ok: false, error: "Nenhum profissional disponível neste horário." };
    proId = match.id;
  } else {
    const slots = getAvailableSlots(db, serviceId, proId, date);
    if (!slots.includes(startTime)) {
      return { ok: false, error: "Horário indisponível para este profissional." };
    }
  }

  const endTime = format(
    addMinutes(
      parseTimeOnDate(date, startTime),
      service.durationMinutes + db.settings.bufferMinutes,
    ),
    "HH:mm",
  );

  return { ok: true, endTime, professionalId: proId };
}

export function bookingConflicts(
  existing: Booking[],
  professionalId: string,
  date: string,
  startTime: string,
  endTime: string,
): boolean {
  const start = parseTimeOnDate(date, startTime);
  const end = parseTimeOnDate(date, endTime);
  return existing.some(
    (b) =>
      b.professionalId === professionalId &&
      b.date === date &&
      (b.status === "solicitado" || b.status === "confirmado") &&
      overlaps(
        start,
        end,
        parseTimeOnDate(date, b.startTime),
        parseTimeOnDate(date, b.endTime),
      ),
  );
}
