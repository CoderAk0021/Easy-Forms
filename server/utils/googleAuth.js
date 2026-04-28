import { OAuth2Client } from "google-auth-library";

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
const client = new OAuth2Client(googleClientId);

export async function verifyGoogleIdentity(token) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.email) return null;
  return { email: data.email, name: data.name };
}

export async function verifyGoogleToken(token) {
  try {
    const identity = await verifyGoogleIdentity(token);
    return identity?.email || null;
  } catch (error) {
    console.error("Token Verification Failed:", error.message);
    return null;
  }
}

