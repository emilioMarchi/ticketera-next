// /pages/api/mp/callback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/firebase"; // tu módulo Firebase
import { doc, setDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  const codeVerifier = req.cookies.mp_code_verifier;

  if (!code || !codeVerifier) {
    return res.status(400).send("Falta code o codeVerifier");
  }

  try {
    // Intercambiar code + codeVerifier por access_token
    const tokenResponse = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: process.env.MP_CLIENT_ID,
        code,
        redirect_uri: process.env.MP_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Error al obtener token MP:", tokenData);
      return res.status(500).send("Error al obtener token de Mercado Pago");
    }

    // ⚠️ Reemplazar con el ID real de la institución del usuario logueado
    const institutionId = "123"; // ejemplo, luego dinámico

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

    res.send("✅ Cuenta de Mercado Pago vinculada correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno al vincular cuenta de MP");
  }
}
