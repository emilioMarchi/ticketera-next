import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const codeVerifier = req.cookies.get("mp_code_verifier")?.value;

  if (!code || !codeVerifier) {
    return NextResponse.json(
      { error: "Falta code o codeVerifier" },
      { status: 400 }
    );
  }

  try {
    // Preparar body como x-www-form-urlencoded
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.MP_CLIENT_ID!,
      client_secret: process.env.MP_CLIENT_SECRET!, // agregado
      code,
      redirect_uri: process.env.MP_REDIRECT_URI!,
      code_verifier: codeVerifier,
    });

    const tokenResponse = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Error al obtener token MP:", tokenData);
      return NextResponse.json(
        { error: "Error al obtener token de Mercado Pago" },
        { status: 500 }
      );
    }

    // ⚠️ Reemplazar con el ID real de la institución del usuario logueado
    const institutionId = "123";

    await setDoc(
      doc(db, "institutions", institutionId),
      {
        mpAccessToken: tokenData.access_token,
        mpRefreshToken: tokenData.refresh_token,
        mpUserId: tokenData.user_id,
        mpTokenExpires: tokenData.expires_in,
      },
      { merge: true }
    );

    return NextResponse.json({ success: true, message: "Cuenta de MP vinculada correctamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno al vincular cuenta de MP" },
      { status: 500 }
    );
  }
}
