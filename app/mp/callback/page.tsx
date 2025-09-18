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

    fetch("/api/mp/save-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, code_verifier: codeVerifier }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Token MP:", data);
      })
      .catch(console.error);
  }, []);

  return <div>Autenticando con Mercado Pago...</div>;
}
