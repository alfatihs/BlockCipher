import { encryptText, decryptText } from "@/controller/CipherController";
import { getAndValidateText, getCipher } from "@/lib/Validation";
import { ValidationError } from "@/lib/ValidationError";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { cipher: string } }
) {
  try {
    const cipher = getCipher(params.cipher);
    const payload = getAndValidateText(await req.json());

    if (payload.mode === "encrypt") {
      const encrypted = await encryptText(cipher, payload.data, payload.key);

      return NextResponse.json(
        {
          status: "success",
          message: "Data encrypted",
          data: {
            encrypted,
          },
        },
        { status: 200 }
      );
    }

    const decrypted = await decryptText(cipher, payload.data, payload.key);

    return NextResponse.json(
      {
        status: "success",
        message: "File received.",
        data: {
          text: decrypted,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json(
        { status: "failed", message: e.message, data: null },
        { status: 400 }
      );
    } else if (e instanceof Error) {
      return NextResponse.json(
        { status: "failed", message: e.message, data: null },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { status: "failed", message: "Internal server error", data: null },
        { status: 500 }
      );
    }
  }
}
