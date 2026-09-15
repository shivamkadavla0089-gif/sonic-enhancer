export interface EnhancementMetrics {
  model: string;
  latency_ms: number;
  input_snr_db: number;
  output_snr_db: number;
  snr_improvement_db: number;
  device: string;
  sample_rate_hz: number;
  target_profile: string;
}

export interface EnhancementResponse {
  enhanced_audio: string;
  original_spectrogram: string;
  enhanced_spectrogram: string;
  metrics: EnhancementMetrics;
}

const BACKEND_URL = "http://localhost:8000";

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, { method: "GET" });
    const data = await res.json();
    return data.status === "online";
  } catch (err) {
    return false;
  }
}

export async function enhanceAudioFile(
  file: File,
  noiseType: string = "battlefield"
): Promise<EnhancementResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("noise_type", noiseType);

  const response = await fetch(`${BACKEND_URL}/api/enhance`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || errData.error || `Server Error: ${response.status}`);
  }

  return await response.json();
}