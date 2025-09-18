import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const tokenData = await req.json();
    const institutionId = "123";

    await setDoc(
      doc(db, "institutions", institutionId),
      {
        mpAccessToken: tokenData.access_token,
        mpRefreshToken: tokenData.refresh_token,
        mpUserId: tokenData.user_id,
        mpTokenExpires: tokenData.expires_in,
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error guardando token" }, { status: 500 });
  }
}
