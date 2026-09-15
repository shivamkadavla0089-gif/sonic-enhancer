import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import {
  AlertCircle,
  Check,
  CircleDot,
  Download,
  FileAudio,
  LoaderCircle,
  RotateCcw,
  ServerOff,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { EnhancementError, enhanceSpeech } from "@/lib/audio-service";

const ACCEPTED_TYPES = ["audio/wav", "audio/x-wav", "audio/mpeg", "audio/flac", "audio/mp4", "audio/x-m4a"];
const ACCEPTED_EXTENSIONS = ".wav,.mp3,.flac,.m4a";
const MAX_FILE_SIZE = 50 * 1024 * 1024;

type AppStatus = "idle" | "processing" | "success" | "error";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SIH26052 | AI Speech Noise Cancellation" },
      { name: "description", content: "A backend-ready frontend prototype for DCCRN-based speech enhancement." },
      { property: "og:title", content: "SIH26052 | AI Speech Noise Cancellation" },
      { property: "og:description", content: "Upload noisy speech and prepare it for DCCRN-based enhancement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatError(error: unknown) {
  if (error instanceof EnhancementError) return error.message;
  return "Something went wrong while processing this audio. Please try again.";
}

function Index() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultName, setResultName] = useState("");
  const [status, setStatus] = useState<AppStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => () => {
    if (inputUrl) URL.revokeObjectURL(inputUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [inputUrl, resultUrl]);

  function validateFile(nextFile: File) {
    const extension = nextFile.name.split(".").pop()?.toLowerCase();
    const supported = ACCEPTED_TYPES.includes(nextFile.type) || ["wav", "mp3", "flac", "m4a"].includes(extension ?? "");
    if (!supported) {
      setErrorMessage("Unsupported file format. Choose a WAV, MP3, FLAC, or M4A recording.");
      setStatus("error");
      return false;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setErrorMessage("This file is too large. Choose an audio file under 50 MB.");
      setStatus("error");
      return false;
    }
    return true;
  }

  function selectFile(nextFile: File) {
    if (!validateFile(nextFile)) return;
    if (inputUrl) URL.revokeObjectURL(inputUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(nextFile);
    setInputUrl(URL.createObjectURL(nextFile));
    setResultUrl("");
    setResultName("");
    setErrorMessage("");
    setStatus("idle");
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    if (nextFile) selectFile(nextFile);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const nextFile = event.dataTransfer.files[0];
    if (nextFile) selectFile(nextFile);
  }

  function removeFile() {
    if (inputUrl) URL.revokeObjectURL(inputUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setInputUrl("");
    setResultUrl("");
    setResultName("");
    setErrorMessage("");
    setStatus("idle");
  }

  async function handleEnhance() {
    if (!file) {
      setErrorMessage("Select an audio file before enhancing speech.");
      setStatus("error");
      return;
    }
    setStatus("processing");
    setErrorMessage("");
    try {
      const output = await enhanceSpeech(file);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(output));
      setResultName(`${file.name.replace(/\.[^/.]+$/, "")}_clean.wav`);
      setStatus("success");
    } catch (error) {
      setErrorMessage(formatError(error));
      setStatus("error");
    }
  }

  const isProcessing = status === "processing";
  const hasResult = status === "success" && Boolean(resultUrl);

  return (
    <div className="fine-grid min-h-screen bg-background text-foreground">
      <header className="border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary font-mono text-[11px] font-medium tracking-tight text-primary-foreground shadow-sm">SIH</div>
            <div className="min-w-0 leading-tight">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">SIH26052</p>
              <p className="truncate font-display text-sm font-semibold sm:text-base">AI Speech Noise Cancellation</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning-foreground">
            <CircleDot className="status-pulse size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Backend connection pending</span>
            <span className="sm:hidden">Backend pending</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div>
            <div className="mb-6 max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Speech enhancement workspace</p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">Make every word easier to hear.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Enhance human speech by reducing unwanted background noise using Deep Complex Convolution Recurrent Network technology.</p>
            </div>

            <section className="glass-panel rounded-2xl p-5 sm:p-7" aria-labelledby="upload-heading">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary"><UploadCloud className="size-4" aria-hidden="true" /></span>
                    <h2 id="upload-heading" className="font-display text-xl font-semibold">Upload Noisy Speech</h2>
                  </div>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Upload an audio recording containing background noise and prepare it for AI enhancement.</p>
                </div>
                <span className="hidden rounded-full border border-border bg-background/70 px-2.5 py-1 font-mono text-[10px] text-muted-foreground sm:inline-flex">INPUT</span>
              </div>

              <div
                role="button"
                tabIndex={0}
                aria-label="Choose a noisy speech audio file"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click(); }}
                onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`mt-6 cursor-pointer rounded-xl border border-dashed p-7 text-center transition-colors sm:p-10 ${isDragging ? "border-primary bg-primary/10" : "border-foreground/20 bg-background/45 hover:border-primary/60 hover:bg-primary/[0.04]"}`}
              >
                <input ref={fileInputRef} type="file" className="sr-only" accept={ACCEPTED_EXTENSIONS} onChange={handleInputChange} />
                <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary"><UploadCloud className="size-6" aria-hidden="true" /></div>
                <p className="mt-4 text-sm font-semibold">Drag and drop your audio here</p>
                <p className="mt-1 text-xs text-muted-foreground">or <span className="font-medium text-primary">browse files</span></p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {['WAV', 'MP3', 'FLAC', 'M4A'].map((format) => <span key={format} className="rounded-full border border-border bg-background/70 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{format}</span>)}
                </div>
                <p className="mt-3 font-mono text-[10px] text-muted-foreground">Maximum file size: 50 MB · configurable</p>
              </div>

              {file && (
                <div className="mt-5 rounded-xl border border-border bg-background/55 p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><FileAudio className="size-5" aria-hidden="true" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{file.name}</p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">{formatBytes(file.size)} · {file.type || "audio file"}</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={removeFile} aria-label="Remove selected audio" title="Remove selected audio"><X className="size-4" /></Button>
                  </div>
                  <audio className="mt-4 w-full" controls src={inputUrl} aria-label={`Preview of ${file.name}`} />
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
                  {status === "idle" && <><ShieldCheck className="size-4 text-success" aria-hidden="true" /> No file selected</>}
                  {status === "processing" && <><LoaderCircle className="size-4 animate-spin text-primary" aria-hidden="true" /> Processing audio…</>}
                  {status === "success" && <><Check className="size-4 text-success" aria-hidden="true" /> Enhanced audio ready</>}
                  {status === "error" && <><AlertCircle className="size-4 text-destructive" aria-hidden="true" /> {errorMessage}</>}
                </p>
                <Button type="button" size="lg" disabled={!file || isProcessing} onClick={handleEnhance} className="w-full sm:w-auto">
                  {isProcessing ? <><LoaderCircle className="animate-spin" /> Processing Audio…</> : "Enhance Speech"}
                </Button>
              </div>
            </section>
          </div>

          <aside className="glass-panel rounded-2xl p-5" aria-label="Connection status">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">System status</p>
              <ServerOff className="size-4 text-warning-foreground" aria-hidden="true" />
            </div>
            <div className="mt-5 flex items-start gap-3">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-warning status-pulse" />
              <div>
                <p className="text-sm font-semibold">Frontend prototype</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">The DCCRN inference service will connect through <span className="font-mono text-[10px] text-foreground">POST /enhance</span>.</p>
              </div>
            </div>
            <div className="mt-5 border-t border-border/70 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Model status</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium"><span className="size-2 rounded-full bg-success" /> Ready for integration</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">No audio is processed until a Python backend is connected.</p>
            </div>
          </aside>
        </section>

        <section className="mt-6" aria-labelledby="results-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Output workspace</p>
              <h2 id="results-heading" className="mt-2 font-display text-2xl font-semibold">Results</h2>
            </div>
            {hasResult && <Button type="button" variant="outline" onClick={removeFile}><RotateCcw /> Process Another Audio</Button>}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="glass-panel rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-base font-semibold">Original Audio</h3>
                <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] text-accent-foreground">INPUT</span>
              </div>
              {file ? (
                <div className="mt-5">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Original recording · ready for enhancement</p>
                  <audio className="mt-4 w-full" controls src={inputUrl} aria-label={`Original audio ${file.name}`} />
                </div>
              ) : (
                <div className="mt-5 flex min-h-28 items-center justify-center rounded-xl border border-dashed border-border bg-background/35 px-5 text-center text-sm text-muted-foreground">Your uploaded audio will appear here.</div>
              )}
            </article>

            <article className="glass-panel rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-base font-semibold">Enhanced Speech</h3>
                <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] ${hasResult ? "bg-success/15 text-success-foreground" : "border border-border bg-background/55 text-muted-foreground"}`}>{hasResult ? "OUTPUT READY" : "AWAITING OUTPUT"}</span>
              </div>
              {hasResult ? (
                <div className="mt-5">
                  <p className="truncate text-sm font-medium">{resultName}</p>
                  <p className="mt-1 text-xs text-success-foreground">Processing complete · enhanced WAV returned by backend</p>
                  <audio className="mt-4 w-full" controls src={resultUrl} aria-label={`Enhanced audio ${resultName}`} />
                  <a href={resultUrl} download={resultName} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 sm:w-auto"><Download className="size-4" /> Download Clean Audio</a>
                </div>
              ) : (
                <div className="mt-5 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/35 px-5 text-center">
                  <p className="text-sm font-medium text-muted-foreground">No enhanced audio yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">The result player and download action appear after the real backend responds.</p>
                </div>
              )}
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/80 bg-background/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 font-mono text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>SIH26052 · Smart India Hackathon</span>
          <span>Python / FastAPI integration ready · no output simulated</span>
        </div>
      </footer>
    </div>
  );
}