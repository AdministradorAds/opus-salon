import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAdminSession } from "@/lib/auth";
import { updateDb } from "@/lib/store";

function slugify(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.name) {
    return NextResponse.json({ error: "Nome obrigatório." }, { status: 400 });
  }

  await updateDb((db) => {
    const id = randomUUID();
    db.professionals.push({
      id,
      slug: slugify(String(body.name)) || id,
      name: String(body.name).trim(),
      specialties: String(body.specialties || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      bio: String(body.bio || "").trim(),
      workHours: { ...db.settings.openHours },
      active: body.active !== false,
    });

    // Link to all active services by default
    for (const s of db.services) {
      if (!s.professionalIds.includes(id)) s.professionalIds.push(id);
    }
  });

  return NextResponse.json({ ok: true });
}
