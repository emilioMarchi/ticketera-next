"use client";
import { useState } from "react";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/mp/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Entrada Concierto",
        quantity: 1,
        unit_price: 5000,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.init_point) {
      window.location.href = data.init_point; // Redirige al checkout pro
    } else {
      alert("Error al crear el pago");
      console.error(data);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? "Redirigiendo..." : "Pagar con Mercado Pago"}
    </button>
  );
}
