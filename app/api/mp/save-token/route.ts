// app/api/mp/save-token/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.MP_CLIENT_ID!,        // tu client_id
      client_secret: process.env.MP_CLIENT_SECRET!, // ahora sí, tu secreto de producción
      code,
      redirect_uri: process.env.MP_REDIRECT_URI!,
    });

    const res = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Algo falló" }, { status: 500 });
  }
}
