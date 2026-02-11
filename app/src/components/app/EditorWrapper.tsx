import { Navigate,useLocation } from "react-router-dom";
import { FormEditor } from "../form-builder/FormEditor";
import type { Form } from "@/types/form";

export default function EditorWrapper({ onBack }: { onBack: () => void }) {
  const location = useLocation();
  const form = location.state?.form as Form | undefined;
  if (!form) {
    return <Navigate to="/dashboard" replace />;
  }

  return <FormEditor form={form} onBack={onBack} />;
}
