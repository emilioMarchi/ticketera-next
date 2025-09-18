import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { code, code_verifier } = req.body;

  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_MP_CLIENT_ID!,
      code,
      redirect_uri: process.env.NEXT_PUBLIC_MP_REDIRECT_URI!,
      code_verifier,
    });

    const mpRes = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await mpRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener token", details: err });
  }
}
