"use client";
import { useState } from "react";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mp/connect"); // ✅ GET, no POST
      const data = await res.json();
  
      if (data.url) {
        window.location.href = data.url; // redirige al login de MP
      } else {
        console.error("No se recibió la URL:", data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? "Redirigiendo..." : "Conectar Mercado Pago"}
    </button>
  );
}
