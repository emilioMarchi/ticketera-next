"use client";
import { useEffect } from "react";

export default function MPCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const codeVerifier = document.cookie
      .split("; ")
      .find(row => row.startsWith("mp_code_verifier="))
      ?.split("=")[1];

    if (!code || !codeVerifier) return;

    // Intercambio de código por token usando PKCE
    fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_MP_CLIENT_ID!,
        code,
        redirect_uri: process.env.NEXT_PUBLIC_MP_REDIRECT_URI!,
        code_verifier: codeVerifier,
      }).toString(),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Token MP:", data);

        // Guardar solo lo necesario en Firebase
        fetch("/api/mp/save-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            user_id: data.user_id,
          }),
        });
      })
      .catch(console.error);
  }, []);

  return <div>Autenticando con Mercado Pago...</div>;
}
