// app/api/mp/connect/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_MP_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_MP_REDIRECT_URI;

  const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${clientId}&response_type=code&platform_id=mp&redirect_uri=${redirectUri}`;

  return NextResponse.json({ url: authUrl });
}
