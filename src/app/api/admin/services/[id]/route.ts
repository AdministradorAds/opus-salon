import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateDb } from "@/lib/store";

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
  if (!body) {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  try {
    await updateDb((db) => {
      const service = db.services.find((s) => s.id === id);
      if (!service) throw new Error("Serviço não encontrado.");
      if ("durationMinutes" in body) {
        service.durationMinutes =
          body.durationMinutes === null || body.durationMinutes === ""
            ? null
            : Number(body.durationMinutes);
      }
      if ("priceCents" in body) {
        service.priceCents =
          body.priceCents === null ? null : Number(body.priceCents);
      }
      if (typeof body.active === "boolean") service.active = body.active;
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ error: message }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
