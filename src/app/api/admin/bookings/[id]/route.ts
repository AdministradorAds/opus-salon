import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateDb } from "@/lib/store";
import type { BookingStatus } from "@/lib/types";

const allowed: BookingStatus[] = [
  "solicitado",
  "confirmado",
  "cancelado",
  "concluido",
  "nao_compareceu",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status as BookingStatus;
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  try {
    await updateDb((db) => {
      const booking = db.bookings.find((b) => b.id === id);
      if (!booking) throw new Error("Não encontrado.");
      booking.status = status;
      booking.updatedAt = new Date().toISOString();
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ error: message }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
