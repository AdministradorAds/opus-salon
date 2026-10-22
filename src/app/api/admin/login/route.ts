import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
  }
  const admin = await loginAdmin(String(body.email), String(body.password));
  if (!admin) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, name: admin.name });
}
