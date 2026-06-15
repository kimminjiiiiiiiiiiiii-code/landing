import React, { useState, useRef } from "react";
import { Camera, RefreshCw, CheckCircle, AlertTriangle, Droplet, Sun, Thermometer, ShieldCheck, Heart, Plus, Sparkles, Upload } from "lucide-react";
import { Plant } from "../types";

interface AiScannerProps {
  onAddPlant: (newPlant: Omit<Plant, "id" | "createdDate" | "wateringHistory">) => void;
  onNavigateToTab: (tab: string) => void;
}

// Preset plants for demonstration with high-quality stock URLs
const PLANT_PRESETS = [
  {
    id: "preset-monstera",
    keyHint: "monstera",
    name: "몬스테라 델리시오사",
    english: "Monstera Deliciosa",
    status: "건강함",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    description: "찢어진 깃털 무늬 잎이 아름다운 열대 최고 인기 관엽식물"
  },
  {
    id: "preset-peacelily",
    keyHint: "peacelily",
    name: "스파티필룸 (Peace Lily)",
    english: "Spathiphyllum",
    status: "물 부족",
    imageUrl: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=600&q=80",
    description: "공기 정화 성능이 뛰어나며 물이 부족하면 머리를 축 떨궈 알려주는 식물"
  },
  {
    id: "preset-snake",
    keyHint: "sansevieria",
    name: "산세베리아 (Snake Plant)",
    english: "Sansevieria",
    status: "건강함",
    imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80",
    description: "밤에 음이온산소를 내뿜어 천연 공기청정기로 침실에 두기 좋은 다육 수종"
  },
  {
    id: "preset-ivy",
    keyHint: "ivy",
    name: "스킨답서스 (Devil's Ivy)",
    english: "Epipremnum aureum",
    status: "햇빛 부족",
    imageUrl: "https://images.unsplash.com/photo-1597055181300-e3633a207518?auto=format&fit=crop&w=600&q=80",
    description: "덩굴처럼 늘어지며 끈질긴 자생력으로 초보자에게 적극 권장하는 식물"
  }
];

export default function AiScanner({ onAddPlant, onNavigateToTab }: AiScannerProps) {
  const [selectedPreset, setSelectedPreset] = useState<typeof PLANT_PRESETS[0] | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [diagnosisResult, setDiagnosisResult] = useState<any | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states for adding plant to garden
  const [plantNickname, setPlantNickname] = useState("");
  const [plantLocation, setPlantLocation] = useState("거실");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScan = async (imgSource: string, hint: string) => {
    setIsScanning(true);
    setScanProgress(10);
    setDiagnosisResult(null);
    setIsAddingMode(false);
    setErrorMsg(null);

    // Simulate sophisticated scanner step changes
    const steps = [
      { p: 25, t: "식물 윤곽 분석 및 이파리 특징점 대조 중..." },
      { p: 50, t: "엽록소 반사율 및 잎 처짐도(Turgidity) 수치 연산 중..." },
      { p: 75, t: "질병 마크(노란 테두리, 수포) 식별 신경망 대조 중..." },
      { p: 90, t: "원예 빅데이터를 활용한 맞춤 생육 처방전 작성 중..." }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setScanProgress(steps[stepIndex].p);
        setScanStepText(steps[stepIndex].t);
        stepIndex++;
      } else {
        clearInterval(interval);
        executeAnalysisAPI(imgSource, hint);
      }
    }, 850);
  };

  const executeAnalysisAPI = async (imgSource: string, hint: string) => {
    try {
      const response = await fetch("/api/analyze-plant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imgSource,
          plantTypeHint: hint
        })
      });

      if (!response.ok) {
        throw new Error("서버와의 통신에 실패했습니다.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setDiagnosisResult(data);
      setPlantNickname(`${data.commonName.split(" ")[0]}이`); // Auto default nickname
      setIsScanning(false);
      setScanProgress(100);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "스캔 중 기술적 이상이 일어났습니다. 다시 시도해 주세요.");
      setIsScanning(false);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("이미지 파일만 업로드 하실 수 있습니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const resultStr = e.target?.result as string;
      setUploadedImage(resultStr);
      setSelectedPreset(null);
      // Auto trigger scan on upload
      startScan(resultStr, file.name);
    };
    reader.readAsDataURL(file);
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  const selectPreset = (preset: typeof PLANT_PRESETS[0]) => {
    setSelectedPreset(preset);
    setUploadedImage(null);
    startScan(preset.imageUrl, preset.keyHint);
  };

  const handleGardenAdd = () => {
    if (!diagnosisResult) return;
    if (!plantNickname.trim()) {
      alert("식물의 다정한 별명을 지어 주세요!");
      return;
    }

    onAddPlant({
      speciesName: diagnosisResult.speciesName,
      commonName: diagnosisResult.commonName,
      intro: diagnosisResult.intro,
      nickname: plantNickname,
      location: plantLocation,
      wateringIntervalDays: diagnosisResult.wateringIntervalDays,
      healthStatus: diagnosisResult.healthStatus,
      lastWateredDate: new Date().toISOString().split("T")[0], // Watered today as baseline
      nextWateringDate: new Date(Date.now() + diagnosisResult.wateringIntervalDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      healthScore: diagnosisResult.healthScore,
      imageUrl: uploadedImage || selectedPreset?.imageUrl || "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
      actions: diagnosisResult.actions,
      lightScore: diagnosisResult.lightScore,
      lightDesc: diagnosisResult.lightDesc,
      humidityScore: diagnosisResult.humidityScore,
      humidityDesc: diagnosisResult.humidityDesc,
      tempMin: diagnosisResult.tempMin,
      tempMax: diagnosisResult.tempMax,
      tempDesc: diagnosisResult.tempDesc
    });

    setIsAddingMode(false);
    onNavigateToTab("calendar"); // Instantly navigate to watering page
  };

  // Helper for Status UI decoration
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "건강함":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold leading-none">
            <CheckCircle className="w-3.5 h-3.5" /> 건강함 (Excellent)
          </span>
        );
      case "물 부족":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold leading-none">
            <AlertTriangle className="w-3.5 h-3.5" /> Thirsty! 물 부족
          </span>
        );
      case "과습":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-full text-xs font-bold leading-none">
            <AlertTriangle className="w-3.5 h-3.5" /> Overwatered! 과습 주의
          </span>
        );
      case "햇빛 부족":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold leading-none">
            <Sun className="w-3.5 h-3.5" /> 햇빛 부족 (Dark Spot)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#bccbb9]/20 text-[#3d4a3d] rounded-full text-xs font-bold leading-none">
            <ShieldCheck className="w-3.5 h-3.5" /> 진단 완료
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-rose-600";
  };

  return (
    <div className="space-y-8">
      {/* Top Description Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#bccbb9]/30 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full bg-[#006e2f]/10 text-[#006e2f] text-xs font-extrabold flex items-center gap-1 font-display">
              <Sparkles className="w-3 h-3 fill-emerald-600" />
              Gemini 3.5 AI
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-display text-[#111c2d]">인공지능(AI) 식물 건강 진단소</h2>
          </div>
          <p className="text-[#3d4a3d] text-sm md:text-base">
            분출되는 이파리의 디테일과 엽맥 점수를 AI 카메라로 스캔하여 최선의 가꿈 비결을 분석해 줍니다.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedPreset(null);
            setUploadedImage(null);
            setDiagnosisResult(null);
            setErrorMsg(null);
          }}
          className="text-xs bg-[#f0f3ff] hover:bg-emerald-50 text-[#006e2f] px-3.5 py-2 rounded-lg border border-[#006e2f]/15 font-bold flex items-center gap-1.5 self-end md:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          스캐너 전체 리셋
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Upload Panel & Presets */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Upload Box */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative bg-white rounded-2xl border-2 border-dashed ${
              isScanning ? "border-[#006e2f]/20 bg-emerald-50/10" : "border-[#bccbb9] hover:border-[#006e2f]/70"
            } p-8 text-center flex flex-col justify-center items-center aspect-[4/3] overflow-hidden transition-all duration-300 shadow-xs`}
          >
            {/* Camera Preview / Scanning Animation */}
            {isScanning ? (
              <div className="w-full h-full absolute inset-0 bg-[#111c2d]/5 flex flex-col justify-center items-center p-6 z-10">
                {/* Laser scan horizontal line */}
                <div className="absolute left-0 right-0 h-1 bg-[#22c55e] opacity-85 shadow-lg shadow-emerald-400 animate-bounce top-[20%] w-full z-20"></div>
                {/* Camera guides */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
                <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>

                <div className="space-y-4 text-center mt-4">
                  <div className="relative">
                    <Camera className="w-16 h-16 text-[#006e2f] animate-pulse mx-auto" />
                    <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-400 absolute top-0 right-4 animate-spin" />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-display font-black text-[#006e2f] text-base">{scanProgress}% 스캔 분석 중...</p>
                    <p className="text-xs text-[#3d4a3d] max-w-xs font-mono h-8 animate-pulse text-center">
                      {scanStepText || "식물 데이터 소스 교차 연대 분석 중..."}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-48 bg-stone-100 h-2 rounded-full overflow-hidden mx-auto mt-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Uploaded image visual display */}
            {uploadedImage || selectedPreset ? (
              <div className="w-full h-full absolute inset-0">
                <img
                  alt="스캔용 식물 스냅샷"
                  className="w-full h-full object-cover"
                  src={uploadedImage || selectedPreset?.imageUrl || ""}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#111c2d]/20 hover:bg-[#111c2d]/40 transition-colors flex justify-center items-center opacity-0 hover:opacity-100 gap-3">
                  <button
                    onClick={triggerSelectFile}
                    className="p-3 bg-white text-emerald-800 rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> 다시 재업로드
                  </button>
                </div>
              </div>
            ) : (
              // Empty Display (No image uploads)
              <div 
                onClick={triggerSelectFile}
                className="space-y-5 cursor-pointer max-w-sm group p-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#006e2f]/5 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-[#006e2f]/10 transition-all">
                  <Camera className="w-8 h-8 text-[#006e2f]/70" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-semibold text-[#111c2d] text-base">
                    직접 기르시는 식물 사진 업로드
                  </h4>
                  <p className="text-xs text-[#3d4a3d] leading-relaxed">
                    여기를 터치하여 촬영본이나 이파리 파일을 업로드하거나, 드래그 앤 드롭으로 던지세요.
                  </p>
                </div>
                <span className="inline-block bg-[#006e2f]/10 hover:bg-[#006e2f]/20 transition-all text-[#006e2f] font-bold text-xs px-4 py-1.5 rounded-full pointer-events-none">
                  컴퓨터/스마트폰 파일 선택
                </span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Plant Presets Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-[#bccbb9]/30 shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-sm text-[#111c2d] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                원클릭 스캔 테스트 프리셋
              </h3>
              <p className="text-xs text-[#3d4a3d]">
                보유하신 사진이 없다면 아래의 식집사 모형 화분을 클릭해 즉시 정밀 센서 성능을 느껴보세요.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {PLANT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset)}
                  disabled={isScanning}
                  className={`group flex items-center gap-2.5 p-2 rounded-xl text-left border cursor-pointer transition-all ${
                    selectedPreset?.id === preset.id
                      ? "border-emerald-600 bg-emerald-50/50"
                      : "border-[#bccbb9]/40 hover:border-emerald-600/50 hover:bg-[#f9f9ff]"
                  }`}
                >
                  <img
                    alt={preset.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    src={preset.imageUrl}
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden min-w-0">
                    <p className="text-xs font-bold text-[#111c2d] truncate group-hover:text-emerald-800 transition-colors">
                      {preset.name.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">{preset.status}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Scan Diagnosis Result Form */}
        <div className="lg:col-span-7">
          {errorMsg ? (
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-rose-800">분석 기술 오류</h4>
                <p className="text-xs text-rose-700 leading-relaxed">{errorMsg}</p>
              </div>
              <button
                onClick={() => {
                  if (selectedPreset) {
                    selectPreset(selectedPreset);
                  } else if (uploadedImage) {
                    startScan(uploadedImage, "retry_image");
                  } else {
                    setErrorMsg(null);
                  }
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-transform cursor-pointer"
              >
                스캐너 다시 돌리기
              </button>
            </div>
          ) : diagnosisResult ? (
            /* Successful Diagnosis Result Panel */
            <div className="bg-white rounded-2xl border border-[#bccbb9]/30 shadow-xs divide-y divide-[#bccbb9]/20 overflow-hidden animate-fade-in">
              {/* Header Info */}
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold text-gray-500 tracking-wider">
                      {diagnosisResult.speciesName}
                    </span>
                    <h3 className="text-2xl font-black font-display text-[#111c2d]">
                      {diagnosisResult.commonName}
                    </h3>
                    <p className="text-xs md:text-sm text-emerald-800 font-medium py-0.5">
                      " {diagnosisResult.intro} "
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Score Gauge Circle */}
                    <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-gray-50 border border-gray-150">
                      <div className="text-center">
                        <span className={`block text-xl font-black font-display ${getScoreColor(diagnosisResult.healthScore)}`}>
                          {diagnosisResult.healthScore}
                        </span>
                        <span className="text-[9px] text-stone-500 leading-none">활력점수</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  {getStatusBadge(diagnosisResult.healthStatus)}
                </div>

                {/* Extended Analysis Report */}
                <div className="p-4 bg-[#f9f9ff] rounded-xl border border-gray-200/50 space-y-2">
                  <p className="text-xs font-bold text-gray-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#006e2f]" /> AI 주치의 종합 상태 리포트
                  </p>
                  <p className="text-[#3d4a3d] text-xs md:text-sm leading-relaxed whitespace-pre-line">
                    {diagnosisResult.healthReport}
                  </p>
                </div>
              </div>

              {/* Plant parameters indicators */}
              <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-emerald-50/10">
                {/* 1. Water */}
                <div className="p-3 bg-white rounded-xl border border-gray-200/50 space-y-1 flex flex-col justify-between">
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-1 font-display">
                    <Droplet className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                    수분 케어
                  </span>
                  <div>
                    <p className="text-[11px] text-[#3d4a3d] leading-snug font-medium line-clamp-3">
                      {diagnosisResult.wateringSchedule}
                    </p>
                    <p className="text-xs font-extrabold text-blue-600 mt-1">
                      {diagnosisResult.wateringIntervalDays}일 주기 추천
                    </p>
                  </div>
                </div>

                {/* 2. Light */}
                <div className="p-3 bg-white rounded-xl border border-gray-200/50 space-y-1 flex flex-col justify-between">
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-1 font-display">
                    <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-50" />
                    조도 요구량
                  </span>
                  <div>
                    <p className="text-[11px] text-[#3d4a3d] leading-snug font-medium line-clamp-3">
                      {diagnosisResult.lightDesc}
                    </p>
                    <p className="text-xs font-extrabold text-amber-600 mt-1">
                      조도지수 {diagnosisResult.lightScore}/100
                    </p>
                  </div>
                </div>

                {/* 3. Humidity */}
                <div className="p-3 bg-white rounded-xl border border-gray-200/50 space-y-1 flex flex-col justify-between">
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-1 font-display">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-50" />
                    공중 습도
                  </span>
                  <div>
                    <p className="text-[11px] text-[#3d4a3d] leading-snug font-medium line-clamp-3">
                      {diagnosisResult.humidityDesc}
                    </p>
                    <p className="text-xs font-extrabold text-rose-600 mt-1">
                      습도도 {diagnosisResult.humidityScore}%
                    </p>
                  </div>
                </div>

                {/* 4. Temperature */}
                <div className="p-3 bg-white rounded-xl border border-gray-200/50 space-y-1 flex flex-col justify-between">
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-1 font-display">
                    <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                    온도 조화
                  </span>
                  <div>
                    <p className="text-[11px] text-[#3d4a3d] leading-snug font-medium line-clamp-3">
                      {diagnosisResult.tempDesc}
                    </p>
                    <p className="text-xs font-extrabold text-emerald-700 mt-1">
                      {diagnosisResult.tempMin}~{diagnosisResult.tempMax}℃ 수용
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Checklists */}
              <div className="p-6 md:p-8 space-y-4">
                <h4 className="font-display font-bold text-sm text-[#111c2d] flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#006e2f] fill-emerald-50" />
                  집사마스타의 단계별 처방 행동지침
                </h4>
                
                <div className="space-y-3.5">
                  {diagnosisResult.actions.map((action: string, idx: number) => (
                    <label
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-[#f9f9ff] hover:bg-emerald-50/20 rounded-xl border border-[#bccbb9]/20 cursor-pointer text-xs md:text-sm text-[#3d4a3d] leading-relaxed transition-all"
                    >
                      <input
                        type="checkbox"
                        className="rounded text-[#006e2f] focus:ring-[#006e2f] border-gray-300 w-4 h-4 mt-0.5 cursor-pointer"
                      />
                      <span>{action}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Garden Addition Prompt */}
              <div className="p-6 md:p-8 bg-[#f0f3ff] border-t border-[#dee8ff]">
                {!isAddingMode ? (
                  <button
                    onClick={() => setIsAddingMode(true)}
                    className="w-full h-13 bg-[#006e2f] hover:bg-[#006e2f]/95 text-white font-bold rounded-xl flex items-center justify-center gap-2 tracking-wide cursor-pointer shadow-md shadow-emerald-950/10 hover:scale-[1.01] transition-transform"
                  >
                    <Plus className="w-5 h-5" />
                    이 분석 결과를 토대로 내 식물 도감 리스트에 저장하기
                  </button>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-3 bg-white rounded-xl border border-blue-150 space-y-3">
                      <h5 className="font-display font-bold text-xs text-blue-800">
                        식물 도감 화분 등록 폼
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-500">화분 애칭 (Nickname)</label>
                          <input
                            type="text"
                            value={plantNickname}
                            onChange={(e) => setPlantNickname(e.target.value)}
                            placeholder="예: 몬몬이, 건강이, 아기베라"
                            className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-[#006e2f]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-500">배치된 화분 장소 (Location)</label>
                          <select
                            value={plantLocation}
                            onChange={(e) => setPlantLocation(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-[#006e2f] bg-white"
                          >
                            <option value="거실">거실 창가 (Sunny Living Room)</option>
                            <option value="베란다">실외 베란다 (Breezy Balcony)</option>
                            <option value="안방">침실 안방 침대맡 (Cozy Bedside)</option>
                            <option value="주방">주방 식탁 옆 (Kitchen Shelf)</option>
                            <option value="사무실">사무용 집무 데스크 (Office Desk)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setIsAddingMode(false)}
                        className="px-4 py-2 text-xs font-semibold text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleGardenAdd}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#006e2f] hover:bg-[#005321] rounded-lg tracking-wide shadow-sm cursor-pointer"
                      >
                        진짜로 도감에 화분 올려 영구 가꾸기 돌입!
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Idle Placeholder View (Before upload/presets) */
            <div className="bg-white rounded-2xl border-2 border-dashed border-[#bccbb9]/40 aspect-[4/3] flex flex-col justify-center items-center text-center p-8 space-y-4 shadow-xs">
              <Camera className="w-14 h-14 text-orange-200" />
              <div className="space-y-1 max-w-sm">
                <h4 className="font-display font-black text-slate-800 text-base">식물 분석 대기 중</h4>
                <p className="text-xs text-[#3d4a3d] leading-relaxed">
                  왼쪽 창에서 화분 사진 파일을 고르시거나, 프리셋 식물을 터치하시면 실시간 리포트가 이곳에 가득 채워집니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
