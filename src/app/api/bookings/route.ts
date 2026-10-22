import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { bookingConflicts, canBookSlot } from "@/lib/booking";
import { updateDb } from "@/lib/store";
import type { Booking } from "@/lib/types";

const schema = z.object({
  serviceId: z.string().min(1),
  professionalId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(2).max(120),
  phone: z.string().min(8).max(30),
  email: z.string().email().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados incompletos ou inválidos." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  let booking: Booking | null = null;

  try {
    await updateDb((db) => {
      const check = canBookSlot(
        db,
        input.serviceId,
        input.professionalId,
        input.date,
        input.startTime,
      );
      if (!check.ok) {
        throw new Error(check.error);
      }

      if (
        bookingConflicts(
          db.bookings,
          check.professionalId,
          input.date,
          input.startTime,
          check.endTime,
        )
      ) {
        throw new Error("Este horário acabou de ser reservado. Escolha outro.");
      }

      let client = db.clients.find(
        (c) => c.phone.replace(/\D/g, "") === input.phone.replace(/\D/g, ""),
      );
      if (!client) {
        client = {
          id: randomUUID(),
          name: input.name.trim(),
          phone: input.phone.trim(),
          email: input.email || undefined,
          createdAt: new Date().toISOString(),
        };
        db.clients.push(client);
      } else {
        client.name = input.name.trim();
        if (input.email) client.email = input.email;
      }

      const now = new Date().toISOString();
      booking = {
        id: randomUUID(),
        serviceId: input.serviceId,
        professionalId: check.professionalId,
        clientId: client.id,
        date: input.date,
        startTime: input.startTime,
        endTime: check.endTime,
        status: db.settings.requireManualConfirmation
          ? "solicitado"
          : "confirmado",
        cancelToken: randomUUID(),
        createdAt: now,
        updatedAt: now,
      };

      db.bookings.push(booking);
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha ao agendar.";
    return NextResponse.json({ error: message }, { status: 409 });
  }

  return NextResponse.json({ booking });
}
