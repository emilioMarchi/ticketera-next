// app/api/mp/connect/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_MP_CLIENT_ID!,
      response_type: "code",
      redirect_uri: process.env.NEXT_PUBLIC_MP_REDIRECT_URI!,

    });

    const url = `https://auth.mercadopago.com.ar/authorization?${params.toString()}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Algo falló" }, { status: 500 });
  }
}
