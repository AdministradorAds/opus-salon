import { NextResponse } from "next/server";
import { updateDb } from "@/lib/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let token = "";
  try {
    const body = await request.json();
    token = String(body.token || "");
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  try {
    await updateDb((db) => {
      const booking = db.bookings.find((b) => b.id === id);
      if (!booking || booking.cancelToken !== token) {
        throw new Error("Agendamento não encontrado.");
      }
      if (booking.status === "cancelado") {
        throw new Error("Já está cancelado.");
      }
      if (booking.status === "concluido") {
        throw new Error("Não é possível cancelar um atendimento concluído.");
      }
      booking.status = "cancelado";
      booking.updatedAt = new Date().toISOString();
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha ao cancelar.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
