// /pages/api/mp/connect.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Generar code_verifier y code_challenge
  const codeVerifier = crypto.randomBytes(64).toString("hex");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // Guardar code_verifier en cookie
  res.setHeader(
    "Set-Cookie",
    `mp_code_verifier=${codeVerifier}; HttpOnly; Path=/; Max-Age=300; SameSite=Lax`
  );

  // Construir URL de autorización de MP
  const params = new URLSearchParams({
    client_id: process.env.MP_CLIENT_ID!,
    response_type: "code",
    platform_id: "mp",
    redirect_uri: process.env.MP_REDIRECT_URI!,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const authUrl = `https://auth.mercadopago.com/authorization?${params.toString()}`;

  // Redirigir al usuario
  res.redirect(authUrl);
}
