import type { Form, FormResponse } from "@/types/form";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

type ApiPayload = Record<string, unknown>;

function getErrorMessage(payload: unknown, fallback: string): string {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }
  return fallback;
}

function hasSuccessFalse(payload: unknown): payload is { success: false; message?: string } {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      "success" in payload &&
      payload.success === false,
  );
}

function transformForm(data: ApiPayload): Form {
  return {
    ...data,
    id: String(data._id || data.id || ""),
  } as Form;
}

function transformResponse(data: ApiPayload): FormResponse {
  return {
    ...data,
    id: String(data._id || data.id || ""),
  } as FormResponse;
}

interface AuthLoginResponse {
  success: boolean;
  message?: string;
}

interface AuthUser {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthVerifyResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

export interface MailStatusResponse {
  configured: boolean;
  provider: "smtp" | "mailtrap" | null;
  senderEmail: string | null;
  missing: {
    senderEmail: boolean;
    smtpConfig: boolean;
    mailtrapToken: boolean;
  };
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (hasSuccessFalse(data)) {
    throw new ApiError(response.status, data.message || "Action failed");
  }

  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(data, "Something went wrong"));
  }

  return data as T;
}

export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    return fetchApi<AuthLoginResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  verify: async () => {
    return fetchApi<AuthVerifyResponse>('/auth/verify');
  },
  
  logout: async () => {
    return fetchApi<AuthLoginResponse>('/auth/logout', {
      method: 'POST',
    });
  }
};

// Forms API
export const formsApi = {
  getAll: async (): Promise<Form[]> => {
    const data = await fetchApi<ApiPayload[]>("/forms");
    return data.map(transformForm);
  },

  getById: async (id: string): Promise<Form> => {
    const data = await fetchApi<ApiPayload>(`/forms/public/${id}`);
    return transformForm(data);
  },

  getByIdAdmin: async (id: string): Promise<Form> => {
    const data = await fetchApi<ApiPayload>(`/forms/${id}`);
    return transformForm(data);
  },

  create: async (form: Omit<Form, "_id">): Promise<Form> => {
    const data = await fetchApi<ApiPayload>("/forms", {
      method: "POST",
      body: JSON.stringify(form),
    });
    return transformForm(data);
  },

  update: async (id: string, form: Partial<Form>): Promise<Form> => {
    const data = await fetchApi<ApiPayload>(`/forms/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });
    return transformForm(data);
  },

  delete: async (id: string): Promise<void> => {
    await fetchApi(`/forms/${id}`, {
      method: "DELETE",
    });
  },

  getResponses: async (id: string): Promise<FormResponse[]> => {
    const data = await fetchApi<ApiPayload[]>(`/forms/${id}/responses`);
    return data.map(transformResponse);
  },

  getMailStatus: async (): Promise<MailStatusResponse> => {
    return fetchApi<MailStatusResponse>("/forms/mail/status");
  },

  submitResponse: async (
    id: string,
    data: { answers: FormResponse["answers"]; googleToken?: string },
  ): Promise<FormResponse> => {
    const response = await fetchApi<ApiPayload>(`/forms/${id}/responses`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return transformResponse(response);
  },
};

export const getFormResponses = async (formId: string) => {
  return fetchApi<FormResponse[]>(`/forms/${formId}/responses`);
};

export const getFormById = async (formId: string) => {
  return formsApi.getById(formId);
};

// File Upload

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
    // Note: Do NOT set Content-Type header here; fetch sets it automatically for FormData
  });

  if (!response.ok) {
    throw new Error("File upload failed");
  }

  return response.json(); // Returns { url: "...", filename: "..." }
};

export async function checkSubmissionStatus(formId: string, email: string) {
  const response = await fetch(
    `${API_BASE_URL}/forms/${formId}/check-status?email=${encodeURIComponent(email)}`,
    { credentials: "include" },
  );
  if (!response.ok) {
    throw new Error("Failed to check submission status");
  }
  const data = await response.json();
  return data.submitted; // Expected boolean from backend
}

export { ApiError };
