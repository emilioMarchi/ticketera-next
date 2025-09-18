// app/api/mp/save-token/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code, code_verifier } = await req.json();

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_MP_CLIENT_ID!, // tu client_id
      code,
      redirect_uri: process.env.NEXT_PUBLIC_MP_REDIRECT_URI!,
      code_verifier,
    });

    const res = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await res.json();

    // Guardar token en Firebase o DB si querés
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Algo falló" }, { status: 500 });
  }
}
