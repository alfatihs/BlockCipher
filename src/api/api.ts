import { CipherType } from "@/lib/CipherType";
import axios, { AxiosResponse } from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_BASE_URL ?? "/",
});

export async function encryptStringApi(
  type: CipherType,
  key: string,
  plaintext: string
) {
  const { data } = await http.post(`/api/${type}`, {
    mode: "encrypt",
    key,
    text: plaintext,
  });

  return data.data.encrypted as string;
}

export async function decryptStringApi(
  type: CipherType,
  key: string,
  encrypted: string
) {
  const { data } = await http.post(`/api/${type}`, {
    mode: "decrypt",
    key,
    text: encrypted,
  });

  return data.data.text as string;
}

export async function encryptFileApi(
  type: CipherType,
  key: string,
  file: File
) {
  const formData = new FormData();
  formData.append("mode", "encrypt");
  formData.append("key", key);
  formData.append("file", file);

  const result = await http.post(`/api/${type}/upload`, formData, {
    responseType: "blob",
  });
  downloadAxiosResponse(result);
}

export async function decryptFileApi(
  type: CipherType,
  key: string,
  file: File
) {
  const formData = new FormData();
  formData.append("mode", "decrypt");
  formData.append("key", key);
  formData.append("file", file);

  const result = await http.post(`/api/${type}/upload`, formData, {
    responseType: "blob",
  });
  downloadAxiosResponse(result);
}

function getFileName(header: string) {
  return header.split("filename=")[1].split(";")[0].replace(/"/g, "");
}

function downloadAxiosResponse(response: AxiosResponse) {
  const headerLine = response.headers["content-disposition"];
  const href = URL.createObjectURL(response.data);

  const aAnchor = document.createElement("a");
  aAnchor.setAttribute("download", getFileName(headerLine));
  aAnchor.href = href;
  document.body.appendChild(aAnchor);
  aAnchor.click();

  document.body.removeChild(aAnchor);
  URL.revokeObjectURL(href);
}
