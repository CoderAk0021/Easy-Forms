import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader,
  Shield,
  Star,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { checkSubmissionStatus, uploadFile } from "@/lib/api";
import {
  formHeaderMarkdownSource,
  renderMarkdownPreview,
} from "@/lib/form-header-markdown";
import { validateFormAnswers, validateSubmissionPayload } from "@/lib/form-validation";
import type { Answer, Form, Question } from "@/types/form";
import { GoogleVerification } from "./GoogleVerification";

interface FormPreviewProps {
  form: Form;
  onSubmit?: (
    answers: Record<string, unknown>,
    googleToken?: string,
  ) => void | Promise<void>;
}

interface FormPage {
  id: string;
  title?: string;
  description?: string;
  questions: Question[];
}

const buildPages = (questions: Question[]): FormPage[] => {
  const pages: FormPage[] = [];
  let currentPage: FormPage = {
    id: "page-1",
    questions: [],
  };
  let index = 1;

  for (const question of questions) {
    if (question.type === "section_break") {
      if (currentPage.questions.length > 0 || pages.length === 0) {
        pages.push(currentPage);
      }
      index += 1;
      currentPage = {
        id: `page-${index}`,
        title: question.title,
        description: question.description,
        questions: [],
      };
      continue;
    }
    currentPage.questions.push(question);
  }

  if (currentPage.questions.length > 0 || pages.length === 0) {
    pages.push(currentPage);
  }

  return pages.filter((page) => page.questions.length > 0 || page.title || page.description);
};

export function FormPreview({ form, onSubmit }: FormPreviewProps) {
  const [answers, setAnswers] = useState<Record<string, Answer["value"]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [displayEmail, setDisplayEmail] = useState<string | null>(null);
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [verificationResetKey, setVerificationResetKey] = useState(0);
  const nextNavigationGuardUntilRef = useRef(0);

  const pages = useMemo(() => buildPages(form.questions), [form.questions]);
  const activePage = pages[activePageIndex] || { id: "page-1", questions: [] };
  const answerableQuestions = form.questions.filter((q) => q.type !== "section_break");
  const answeredCount = answerableQuestions.filter((q) => {
    const value = answers[q.id];
    return !(
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    );
  }).length;

  const progress =
    answerableQuestions.length > 0
      ? (answeredCount / answerableQuestions.length) * 100
      : 0;
  const bannerImageUrl =
    form.settings.theme.bannerUrl || form.settings.theme.backgroundImageUrl;
  const bannerPositionX =
    typeof form.settings.theme.bannerPositionX === "number"
      ? form.settings.theme.bannerPositionX
      : 50;
  const bannerPositionY =
    typeof form.settings.theme.bannerPositionY === "number"
      ? form.settings.theme.bannerPositionY
      : 50;

  const handleVerification = async (token: string, email: string) => {
    try {
      const hasSubmitted = await checkSubmissionStatus(form.id, email);
      if (hasSubmitted && !form.settings.allowMultipleResponses) {
        setAlreadyResponded(true);
      } else {
        setGoogleToken(token);
        setDisplayEmail(email);
        toast.success("Authentication successful", {
          icon: <Shield className="h-4 w-4" />,
        });
      }
    } catch {
      toast.error("Unable to verify submission status");
    }
  };

  const handleAnswerChange = (questionId: string, value: Answer["value"]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSwitchAccount = () => {
    setGoogleToken(null);
    setDisplayEmail(null);
    setAlreadyResponded(false);
    setVerificationResetKey((prev) => prev + 1);
  };

  const validateQuestions = (questions: Question[]) => {
    const scopedValidation = validateFormAnswers(
      form,
      answers,
      questions.map((question) => question.id),
    );
    if (scopedValidation.isValid) return true;

    const firstIssue = scopedValidation.issues[0];
    if (firstIssue) {
      toast.error(`${firstIssue.questionTitle}: ${firstIssue.message}`, {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }

    return false;
  };

  const handleNextPage = () => {
    if (!validateQuestions(activePage.questions)) return;
    nextNavigationGuardUntilRef.current = Date.now() + 500;
    setActivePageIndex((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (Date.now() < nextNavigationGuardUntilRef.current) return;
    if (activePageIndex < pages.length - 1) {
      handleNextPage();
      return;
    }

    const validation = validateSubmissionPayload(form, answers, googleToken);
    if (!validation.isValid) {
      const firstIssue = validation.issues[0];
      if (firstIssue) {
        toast.error(`${firstIssue.questionTitle}: ${firstIssue.message}`, {
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
      return;
    }

    try {
      setIsSubmitting(true);
      if (onSubmit) {
        await onSubmit(answers, googleToken ?? undefined);
      }
      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit form";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/20 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-800 bg-emerald-900/30">
          <CheckCircle2 className="h-7 w-7 text-emerald-300" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-100">
          {form.settings.confirmationMessage || "Submission Received"}
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          Your response has been securely recorded.
        </p>
      </div>
    );
  }

  if (alreadyResponded && !form.settings.allowMultipleResponses) {
    return (
      <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-800 bg-red-950/30">
          <AlertCircle className="h-7 w-7 text-red-300" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-100">Response Limit Reached</h3>
        <p className="mt-2 text-sm text-zinc-400">
          A response already exists for{" "}
          <span className="text-zinc-200">{displayEmail || "this account"}</span>.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={handleSwitchAccount}
          className="mt-4 border-zinc-700 bg-zinc-900/60 text-zinc-100 hover:bg-zinc-800"
        >
          Switch Google Account
        </Button>
      </div>
    );
  }

  return (
    <div className="relative border-none bg-transparent overflow-hidden rounded-3xl md:border md:border-zinc-800 md:bg-[#0a0a0a] p-1 sm:p-7">
      
      <form onSubmit={handleSubmit} className="relative space-y-6">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          {bannerImageUrl && (
            <div className="relative h-40 w-full sm:h-56">
              <img
                src={bannerImageUrl}
                alt="Form banner"
                className="h-full w-full object-cover"
                style={{ objectPosition: `${bannerPositionX}% ${bannerPositionY}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060b14] via-[#060b14]/30 to-transparent" />
            </div>
          )}
          <div className="p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {form.settings.theme.logoUrl && (
                <img
                  src={form.settings.theme.logoUrl}
                  alt="Brand logo"
                  className="h-10 w-10 rounded-md object-cover ring-1 ring-zinc-700"
                />
              )}
              <div>
                {(form.settings.theme.brandName || form.settings.theme.brandTagline) && (
                  <>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">
                      {form.settings.theme.brandName || "Brand"}
                    </p>
                    {form.settings.theme.brandTagline && (
                      <p className="text-xs text-zinc-400">{form.settings.theme.brandTagline}</p>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
              Page {activePageIndex + 1} of {Math.max(pages.length, 1)}
            </div>
          </div>
          {pages.length > 1 && (
            <div className="mb-5 overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-2">
              {pages.map((page, index) => (
                  <div key={page.id} className="flex items-center gap-2">
                    <div
                      className={`group relative flex min-w-[140px] items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all ${
                        index === activePageIndex
                          ? "border-zinc-300/40 bg-gradient-to-br from-zinc-100/10 to-zinc-600/10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                          : index < activePageIndex
                            ? "border-emerald-700/40 bg-emerald-950/20"
                            : "border-zinc-800 bg-zinc-900/40"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                          index === activePageIndex
                            ? "bg-zinc-100 text-zinc-900"
                            : index < activePageIndex
                              ? "bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/40"
                              : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`truncate text-[10px] uppercase tracking-[0.14em] ${
                            index === activePageIndex
                              ? "text-zinc-300"
                              : index < activePageIndex
                                ? "text-emerald-300/80"
                                : "text-zinc-500"
                          }`}
                        >
                          Step {index + 1}
                        </p>
                        <p
                          className={`truncate text-xs ${
                            index === activePageIndex
                              ? "text-zinc-100"
                              : index < activePageIndex
                                ? "text-emerald-200"
                                : "text-zinc-400"
                          }`}
                        >
                          {page.title || "Untitled section"}
                        </p>
                      </div>
                    </div>
                    {index < pages.length - 1 && (
                      <div className="h-px w-5 shrink-0 bg-zinc-700/70" />
                    )}
                  </div>
              ))}
              </div>
            </div>
          )}
          <div
            className="space-y-3 leading-relaxed text-zinc-200"
            dangerouslySetInnerHTML={{
              __html: renderMarkdownPreview(
                formHeaderMarkdownSource(
                  form.title,
                  form.description,
                  "Add a description to help respondents understand the purpose of this form...",
                ),
              ),
            }}
          />
          </div>
        </div>

        {form.settings.showProgressBar && answerableQuestions.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
              <span>Completion</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
              <div className="h-full rounded-full bg-zinc-200" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {form.settings.limitOneResponse && !googleToken && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
            <div className="mb-3">
              <p className="text-sm font-semibold text-zinc-100">Secure Verification</p>
              <p className="text-xs text-zinc-400">
                To protect branded forms, sign in with Google before continuing.
              </p>
            </div>
            <GoogleVerification
              key={`google-verification-${verificationResetKey}`}
              onVerified={handleVerification}
            />
          </div>
        )}

        {googleToken && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-700 bg-emerald-900/40">
                <Shield className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">Identity Verified</p>
                <p className="text-xs text-zinc-400">{displayEmail}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleSwitchAccount}
              className="h-8 border-zinc-700 bg-zinc-900/60 text-zinc-100 hover:bg-zinc-800"
            >
              Switch Account
            </Button>
          </div>
        )}

        {(activePage.title || activePage.description) && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            {activePage.title && <h3 className="text-base font-semibold text-zinc-100">{activePage.title}</h3>}
            {activePage.description && (
              <p className="mt-1 text-sm text-zinc-400">{activePage.description}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {activePage.questions.map((question, index) => (
            <QuestionPreview
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleAnswerChange(question.id, value)}
              index={index + 1}
              setUploading={setIsUploading}
              uploading={isUploading}
              googleToken={googleToken}
              requiresVerification={form.settings.limitOneResponse}
            />
          ))}
        </div>

        {answerableQuestions.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActivePageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={activePageIndex === 0 || isSubmitting}
              className="h-10 border-white/15 bg-zinc-900/70 text-zinc-100 hover:bg-zinc-800"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {activePageIndex < pages.length - 1 ? (
              <Button
                type="button"
                onClick={handleNextPage}
                disabled={isUploading || isSubmitting}
                className="h-10 bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
              >
                Next Section
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  (form.settings.limitOneResponse && !googleToken) ||
                  isUploading ||
                  isSubmitting
                }
                className="h-10 bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : isUploading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Processing Upload...
                  </span>
                ) : form.settings.limitOneResponse && !googleToken ? (
                  <span className="inline-flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Verify Identity to Continue
                  </span>
                ) : (
                  "Submit Response"
                )}
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

interface QuestionPreviewProps {
  question: Question;
  value: Answer["value"];
  onChange: (value: Answer["value"]) => void;
  index: number;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  uploading: boolean;
  googleToken: string | null;
  requiresVerification: boolean;
}

function QuestionPreview({
  question,
  value,
  onChange,
  index,
  setUploading,
  uploading,
  googleToken,
  requiresVerification,
}: QuestionPreviewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localFileName, setLocalFileName] = useState<string | null>(null);

  const handleFileSelect = async (file: File | undefined) => {
    if (!file) return;
    try {
      setUploading(true);
      const response = await uploadFile(file);
      onChange(response.url);
      setLocalFileName(file.name);
      toast.success("File uploaded successfully");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalFileName(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayFileName =
    localFileName ||
    (typeof value === "string" ? value.split("/").pop() : null);
  const isDisabled = uploading || (requiresVerification && !googleToken);
  const textValue =
    typeof value === "string" || typeof value === "number" ? String(value) : "";
  const selectValue = typeof value === "string" ? value : "";
  const checkboxValues = Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : [];
  const ratingValue = typeof value === "number" ? value : Number(value) || 0;

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="inline-flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-xs text-zinc-300">
          {index}
        </div>
        <div className="min-w-0">
          <Label className="text-sm font-medium text-zinc-100">
            {question.title}
            {question.required && <span className="ml-1 text-red-400">*</span>}
          </Label>
          {question.description && (
            <p className="mt-1 text-xs text-zinc-400">{question.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {question.type === "short_text" && (
          <Input
            value={textValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "Enter your response"}
            required={question.required}
            className="h-10 rounded-md border-white/10 bg-zinc-950/80 px-2 text-zinc-100 placeholder:text-zinc-600"
          />
        )}

        {question.type === "long_text" && (
          <Textarea
            value={textValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "Enter detailed response"}
            required={question.required}
            rows={4}
            className="resize-none rounded-md border-white/10 bg-zinc-950/80 px-2 text-zinc-100 placeholder:text-zinc-600"
          />
        )}

        {question.type === "email" && (
          <Input
            type="email"
            value={textValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "name@organization.com"}
            required={question.required}
            className="h-10 rounded-md border-white/10 bg-zinc-950/80 text-zinc-100 placeholder:text-zinc-600"
          />
        )}

        {question.type === "number" && (
          <Input
            type="number"
            value={textValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "0"}
            required={question.required}
            className="h-10 rounded-md border-white/10 bg-zinc-950/80 text-zinc-100 placeholder:text-zinc-600"
          />
        )}

        {question.type === "date" && (
          <Input
            type="date"
            value={selectValue}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
            className="h-10 rounded-md border-white/10 bg-zinc-950/80 text-zinc-100 [color-scheme:dark]"
          />
        )}

        {question.type === "multiple_choice" && (
          <RadioGroup value={selectValue} onValueChange={onChange} className="space-y-2">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-zinc-950/80 p-3"
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.id}
                  className="border-zinc-600 data-[state=checked]:border-zinc-100 data-[state=checked]:bg-zinc-100"
                />
                <span className="text-sm text-zinc-200">{option.label}</span>
              </label>
            ))}
          </RadioGroup>
        )}

        {question.type === "checkbox" && (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-zinc-950/80 p-3"
              >
                <Checkbox
                  id={option.id}
                  checked={checkboxValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = checkboxValues;
                    if (checked) {
                      onChange([...currentValues, option.value]);
                    } else {
                      onChange(currentValues.filter((v) => v !== option.value));
                    }
                  }}
                  className="border-zinc-600 data-[state=checked]:border-zinc-100 data-[state=checked]:bg-zinc-100"
                />
                <span className="text-sm text-zinc-200">{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === "dropdown" && (
          <Select value={selectValue} onValueChange={onChange}>
            <SelectTrigger className="h-10 rounded-md border-white/10 bg-zinc-950/80 text-zinc-100">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="rounded-md border-white/10 bg-zinc-950 text-zinc-100">
              {question.options?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {question.type === "rating" && (
          <div className="flex items-center gap-1 py-1">
            {[...Array(question.maxRating || 5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(i + 1)}
                className="rounded p-1"
              >
                <Star
                  className={`h-5 w-5 ${
                    ratingValue > i
                      ? "fill-zinc-100 text-zinc-100"
                      : "text-zinc-700"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {question.type === "file_upload" && (
          <div className="space-y-3">
            {value ? (
              <div className="flex items-center justify-between rounded-md border border-white/15 bg-zinc-950/80 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-zinc-900">
                    <FileText className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-zinc-300">
                      {displayFileName || "Attached File"}
                    </p>
                    <p className="text-xs text-zinc-600">Ready for submission</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="rounded p-1 text-zinc-500 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => !isDisabled && fileInputRef.current?.click()}
                className={`rounded-md border-2 border-dashed p-6 text-center ${
                  isDisabled
                    ? "cursor-not-allowed border-zinc-800 bg-zinc-950/60 opacity-60"
                    : "cursor-pointer border-white/15 bg-zinc-950/80"
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader className="h-5 w-5 animate-spin text-zinc-500" />
                    <p className="text-sm text-zinc-500">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload
                      className={`h-5 w-5 ${isDisabled ? "text-zinc-600" : "text-zinc-300"}`}
                    />
                    <p
                      className={`text-sm ${
                        isDisabled ? "text-zinc-600" : "text-zinc-300"
                      }`}
                    >
                      {isDisabled
                        ? "Authentication required to upload"
                        : "Click to upload file"}
                    </p>
                    <p className="text-xs text-zinc-600">PDF, DOC, PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={question.acceptFileTypes || "*/*"}
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  disabled={isDisabled}
                  required={question.required && !value}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
