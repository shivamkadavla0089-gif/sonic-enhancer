export type EnhancementErrorCode =
  | "backend-unavailable"
  | "model-unavailable"
  | "processing-failure"
  | "invalid-audio";

export class EnhancementError extends Error {
  code: EnhancementErrorCode;

  constructor(code: EnhancementErrorCode, message: string) {
    super(message);
    this.name = "EnhancementError";
    this.code = code;
  }
}

export async function enhanceSpeech(file: File): Promise<Blob> {
  const backendUrl = import.meta.env["VITE_BACKEND_URL"]?.trim();

  if (!backendUrl) {
    throw new EnhancementError(
      "backend-unavailable",
      "The Python enhancement service is not connected in this prototype.",
    );
  }

  const body = new FormData();
  body.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${backendUrl.replace(/\/$/, "")}/enhance`, {
      method: "POST",
      body,
    });
  } catch {
    throw new EnhancementError(
      "backend-unavailable",
      "The enhancement service could not be reached. Check the backend connection and try again.",
    );
  }

  if (response.status === 404 || response.status === 503) {
    throw new EnhancementError(
      response.status === 503 ? "model-unavailable" : "backend-unavailable",
      response.status === 503
        ? "The enhancement model is currently unavailable."
        : "The enhancement endpoint could not be found.",
    );
  }

  if (!response.ok) {
    throw new EnhancementError(
      response.status === 400 ? "invalid-audio" : "processing-failure",
      response.status === 400
        ? "This audio could not be processed. Try a different recording."
        : "The audio could not be enhanced. Please try again.",
    );
  }

  const blob = await response.blob();
  if (!blob.type.startsWith("audio/") && blob.size === 0) {
    throw new EnhancementError("processing-failure", "The service returned an empty audio result.");
  }

  return blob;
}