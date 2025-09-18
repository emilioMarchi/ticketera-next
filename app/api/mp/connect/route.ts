import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, quantity, unit_price } = await req.json();

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title,
            quantity,
            unit_price,
          },
        ],
        back_urls: {
          success: process.env.MP_REDIRECT_URI,
          failure: process.env.MP_REDIRECT_URI,
          pending: process.env.MP_REDIRECT_URI,
        },
        auto_return: "approved",
      }),
    });

    const data = await response.json();
    return NextResponse.json(data); 
  } catch (error) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
