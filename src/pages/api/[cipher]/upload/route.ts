import { decryptFile, encryptFile } from "@/controller/CipherController";
import { getAndValidateUpload, getCipher } from "@/lib/Validation";
import { ValidationError } from "@/lib/ValidationError";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { cipher: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const downloadFile = searchParams.get("download") != "false";

    const cipher = getCipher(params.cipher);
    const payload = getAndValidateUpload(await req.formData());

    if (payload.mode === "encrypt") {
      const encryptedFile = await encryptFile(
        cipher,
        payload.file,
        payload.key
      );

      if (!downloadFile) {
        return NextResponse.json(
          {
            status: "success",
            message: "File received.",
            data: {
              encryptedFile,
            },
          },
          { status: 200 }
        );
      } else {
        const headers = new Headers();
        headers.append(
          "Content-Disposition",
          `attachment; filename=${payload.file.name}`
        );
        headers.append("Content-Type", "application/octet-stream");

        return new NextResponse(encryptedFile, {
          status: 200,
          headers,
        });
      }
    }

    const file = await decryptFile(cipher, payload.file, payload.key);

    if (downloadFile) {
      return new NextResponse(file.result, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename=${file.filename}`,
          "Content-Type": "application/octet-stream",
        },
      });
    } else {
      return NextResponse.json(
        {
          status: "success",
          message: "File received.",
          data: {
            file: Buffer.from(file.result).toString("base64"),
            filename: file.filename,
          },
        },
        { status: 200 }
      );
    }
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
