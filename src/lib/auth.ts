import { cookies } from "next/headers";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    // Basic decode of the middle part for non-critical client-side usage if needed, 
    // but better to verify it properly if using it for secure operations.
    // For this dashboard, we follow the Kasturi logic of manual decoding of simple payload.
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString());
    return decoded;
  } catch (err) {
    return null;
  }
}
