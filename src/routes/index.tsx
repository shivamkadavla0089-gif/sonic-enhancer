import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  Upload, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Cpu, 
  Sliders, 
  ShieldAlert, 
  Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { enhanceAudioFile, checkBackendHealth, EnhancementResponse } from "@/lib/audio-service";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [noiseType, setNoiseType] = useState<string>("battlefield");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [result, setResult] = useState<EnhancementResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    checkBackendHealth().then((status) => setBackendOnline(status));
    const interval = setInterval(() => {
      checkBackendHealth().then((status) => setBackendOnline(status));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setOriginalAudioUrl(URL.createObjectURL(selected));
      setResult(null);
      setErrorMsg(null);
    }
  };

  const handleEnhance = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(20);
    setErrorMsg(null);

    const timer = setInterval(() => {
      setProgress((old) => (old < 85 ? old + 15 : old));
    }, 250);

    try {
      const data = await enhanceAudioFile(file, noiseType);
      clearInterval(timer);
      setProgress(100);
      setResult(data);
    } catch (err: any) {
      clearInterval(timer);
      setErrorMsg(err.message || "Failed to process audio through DCCRN pipeline.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-7 w-7 text-emerald-500 animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Tactical Speech Enhancement System
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Smart India Hackathon • DCCRN Deep Complex Convolutional Recurrent Network
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={backendOnline ? "outline" : "destructive"} className="px-3 py-1 text-xs">
            {backendOnline ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI Backend Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" /> Backend Offline (Port 8000)
              </span>
            )}
          </Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900 border-slate-800 text-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Upload className="w-5 h-5 text-emerald-400" /> Audio Ingestion
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Upload raw radio communications or field audio (WAV, MP3).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-950/50"
              >
                <Upload className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                <p className="text-sm font-medium text-slate-300">
                  {file ? file.name : "Click to select audio file"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Mono/Stereo 16kHz automatic resampling</p>
              </div>

              {originalAudioUrl && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Original Noisy Audio</label>
                  <audio controls src={originalAudioUrl} className="w-full h-10 mt-1" />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Target Acoustic Suppression</label>
                <Select value={noiseType} onValueChange={setNoiseType}>
                  <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Noise Profile" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                    <SelectItem value="battlefield">General Battlefield / Armor</SelectItem>
                    <SelectItem value="helicopter">Helicopter Rotor Wash</SelectItem>
                    <SelectItem value="tank">Tank Engine & Heavy Track</SelectItem>
                    <SelectItem value="gunfire">High-Impulse Gunfire / Shells</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isProcessing && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Complex STFT / DCCRN Masking...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-slate-800" />
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-rose-300 text-xs flex gap-2 items-start">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <Button
                onClick={handleEnhance}
                disabled={!file || isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium mt-2"
              >
                {isProcessing ? "Enhancing Signal..." : "Run AI Speech Enhancement"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-slate-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white">
                <Cpu className="w-4 h-4 text-emerald-400" /> Model Pipeline Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Network:</span>
                <span className="font-mono text-slate-200">DCCRN-Complex-Encoder</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Transform:</span>
                <span className="font-mono text-slate-200">512-pt STFT / 256 Hop</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Execution Target:</span>
                <span className="font-mono text-emerald-400">{result?.metrics.device || "Auto-detect"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Sampling Rate:</span>
                <span className="font-mono text-slate-200">16,000 Hz</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900 border-slate-800 text-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between text-white">
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" /> Signal Diagnostics & Isolation
                </span>
                {result && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    +{result.metrics.snr_improvement_db} dB SNR Gain
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Real-time frequency magnitude responses comparing contaminated vs. reconstructed speech.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {result ? (
                <>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> AI Cleaned Output Signal
                      </span>
                      <a
                        href={result.enhanced_audio}
                        download="enhanced_tactical_speech.wav"
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Audio
                      </a>
                    </div>
                    <audio controls src={result.enhanced_audio} className="w-full h-10" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-400">Contaminated Input Spectrum</p>
                      <img
                        src={result.original_spectrogram}
                        alt="Original Spectrogram"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-emerald-400">Enhanced Speech Spectrum (DCCRN)</p>
                      <img
                        src={result.enhanced_spectrogram}
                        alt="Enhanced Spectrogram"
                        className="w-full rounded-lg border border-emerald-800/40 bg-slate-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Latency</span>
                      <p className="text-lg font-bold font-mono text-slate-100">{result.metrics.latency_ms} ms</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Input SNR</span>
                      <p className="text-lg font-bold font-mono text-rose-400">{result.metrics.input_snr_db} dB</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Enhanced SNR</span>
                      <p className="text-lg font-bold font-mono text-emerald-400">{result.metrics.output_snr_db} dB</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Suppression Gain</span>
                      <p className="text-lg font-bold font-mono text-emerald-400">+{result.metrics.snr_improvement_db} dB</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-center p-6 bg-slate-950/30">
                  <ShieldAlert className="w-10 h-10 text-slate-600 mb-3" />
                  <p className="text-sm font-medium text-slate-400">Awaiting audio input</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm">
                    Upload an audio sample and trigger enhancement to see real-time frequency analysis and SNR suppression gains.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}