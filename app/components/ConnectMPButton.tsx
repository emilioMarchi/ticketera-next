"use client";

import { useState } from "react";

export default function ConnectMPButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleConnect = () => {
    setLoading(true);
    setMessage("");

    // Redirige a tu API que inicia PKCE y autorización de MP
    window.location.href = "/api/mp/connect";
  };

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Redirigiendo..." : "Conectar con Mercado Pago"}
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}
