import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/booking";
import { readDb } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");
  const professionalId = searchParams.get("professionalId") || "any";
  const date = searchParams.get("date");

  if (!serviceId || !date) {
    return NextResponse.json(
      { error: "serviceId e date são obrigatórios." },
      { status: 400 },
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Data inválida." }, { status: 400 });
  }

  const db = await readDb();
  const slots = getAvailableSlots(db, serviceId, professionalId, date);
  return NextResponse.json({ slots });
}
