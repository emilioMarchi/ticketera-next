"use client";
import { useEffect } from "react";

export default function MPCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) return;

    fetch("/api/mp/save-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Token MP:", data);
        // Acá podés redirigir al usuario a tu dashboard
      })
      .catch(console.error);
  }, []);

  return <div>Conectando tu cuenta de Mercado Pago...</div>;
}
