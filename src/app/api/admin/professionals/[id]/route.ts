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
      const pro = db.professionals.find((p) => p.id === id);
      if (!pro || pro.isAnyAvailable) throw new Error("Não encontrado.");
      if (body.name) pro.name = String(body.name).trim();
      if (typeof body.bio === "string") pro.bio = body.bio.trim();
      if (typeof body.specialties === "string") {
        pro.specialties = body.specialties
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
      if (typeof body.active === "boolean") pro.active = body.active;
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ error: message }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
