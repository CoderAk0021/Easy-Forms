import { OAuth2Client } from "google-auth-library";

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
const client = new OAuth2Client(googleClientId);

export async function verifyGoogleToken(token) {
  try {
    if (!googleClientId) {
      console.error("Token Verification Failed: Google client ID is not configured");
      return null;
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    
    return payload.email; 
  } catch (error) {
    console.error("Token Verification Failed:", error.message);
    return null;
  }
}

