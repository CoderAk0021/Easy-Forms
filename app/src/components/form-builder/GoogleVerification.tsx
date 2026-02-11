import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { toast } from 'sonner';
import { Fingerprint } from 'lucide-react';

// Replace with your actual Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

interface Props {
  onVerified: (token: string, displayEmail: string) => void;
}

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleTokenPayload {
  email?: string;
}

export function GoogleVerification({ onVerified }: Props) {
  const handleSuccess = (credentialResponse: GoogleCredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<GoogleTokenPayload>(credentialResponse.credential);
      if (!decoded.email) {
        toast.error("Unable to verify Google email");
        return;
      }
      onVerified(credentialResponse.credential, decoded.email);
    }
  };

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
        Google sign-in is unavailable. Missing `VITE_CLIENT_ID`.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-slate-950/50 border border-slate-800 rounded-xl p-6 sm:p-8 text-center group">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50" />
      
      <div className="relative z-10 flex flex-col items-center space-y-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Fingerprint className="w-6 h-6 text-indigo-400" />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <h3 className="text-slate-200 font-mono tracking-wider text-sm uppercase">
            SIGN IN TO CONTINUE
          </h3>
        </div>

        {/* Google Button Wrapper */}
        <div className="mt-2 p-1 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-indigo-500/50 transition-colors duration-300">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => toast.error("Authentication Protocol Failed")}
              theme="filled_black" 
              shape="pill"
              text="continue_with"
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}
