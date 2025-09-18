import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const codeVerifier = crypto.randomBytes(64).toString("hex");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = NextResponse.redirect(
    `https://auth.mercadopago.com/authorization?${new URLSearchParams({
      client_id: process.env.MP_CLIENT_ID!,
      response_type: "code",
      platform_id: "mp",
      redirect_uri: process.env.MP_REDIRECT_URI!,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    }).toString()}`
  );

  res.cookies.set("mp_code_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });

  return res;
}
