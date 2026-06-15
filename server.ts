import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up body parser with a larger limit to accommodate image base64 uploads
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini API client lazily
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using dry-run mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Plant Diagnosis AI Endpoint
app.post("/api/analyze-plant", async (req, res) => {
  const { imageBase64, plantTypeHint } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "이미지 데이터(imageBase64)가 필요합니다." });
  }

  // Handle dry-run or mock key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    console.log("No valid API key found. Simulating high-quality AI analysis response.");
    // Simulate premium mock response based on hint
    const mockResponse = getMockDiagnosis(plantTypeHint || "몬스테라");
    return res.json(mockResponse);
  }

  try {
    const ai = getAiClient();
    
    // Clean base64 string if it contains prefix
    let cleanBase64 = imageBase64;
    let mimeType = "image/jpeg";
    if (imageBase64.includes(";base64,")) {
      const parts = imageBase64.split(";base64,");
      const match = parts[0].match(/data:(.*?)$/);
      if (match) {
        mimeType = match[1];
      }
      cleanBase64 = parts[1];
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const promptText = `
      당신은 전문 식물 학자 및 전문 원예사(식집사마스터)입니다. 제공된 식물 사진을 정밀 분석해 주세요.
      분석 결과는 한국어(Korean)로 제공되어야 하며, 다음 사항들을 정밀하게 식별해야 합니다:
      1. 식물의 정확한 학명 및 한글 이름 (예: 몬스테라 델리시오사)
      2. 식물에 대한 친근하고 흥미로운 한 줄 소개 (완성형 문장)
      3. 현재 상태에 대한 정밀 진단:
         - 상태 상태(healthStatus) 한글 번역: "건강함" | "물 부족" | "과습" | "병해충" | "햇빛 부족" 중 하나 선택 (반드시 지정된 목록 중 하나로만 대답할 것!)
         - 종합 진단 결과 설명 및 증상보고서 (healthReport)
         - 건강 점수 (healthScore, 0에서 100 사이 정수, 100이 가장 건강함)
      4. 맞춤 돌봄 가이드:
         - 권장 물주기 주기 (wateringSchedule, 예: '겉흙이 마르면 듬뿍', '봄/여름 10일에 1회') 및 물주기 날짜 간격 일수 (wateringIntervalDays, 정수형태 예: 7)
         - 조도(햇빛) 점수 (lightScore, 0-100) 및 설명 추천 (lightDesc, 예: '간접광이 잘 드는 반음지에서 잘 자라요')
         - 습도 점수 (humidityScore, 0-100) 및 설명 추천 (humidityDesc, 예: '50-60%의 촉촉한 공기를 좋아해요')
         - 적정 온도 범위 (최소온도 tempMin, 최대온도 tempMax, 온도 팁 설명 tempDesc)
      5. 식집사가 지금 해야 할 즉각적인 행동 지침 리스트 (actions, 3~4개의 명확하고 구체적인 한글 항목)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: promptText }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            speciesName: { type: Type.STRING, description: "식물의 학명 또는 공식 한글명" },
            commonName: { type: Type.STRING, description: "쉽고 널리 쓰이는 한글 유통명" },
            intro: { type: Type.STRING, description: "식물에 대한 다정하고 유쾌한 1줄 소개" },
            healthStatus: { type: Type.STRING, description: '건강상태 한글 분류: "건강함" | "물 부족" | "과습" | "병해충" | "햇빛 부족"' },
            healthScore: { type: Type.INTEGER, description: "건강 점수 (0~100)" },
            healthReport: { type: Type.STRING, description: "상태의 세부 진단 결과 및 이유 분석" },
            wateringSchedule: { type: Type.STRING, description: "쉽게 풀어서 쓴 권장 물주기 조언" },
            wateringIntervalDays: { type: Type.INTEGER, description: "정수형 물주기 간격 기준 (예: 7, 10, 14, 30)" },
            lightScore: { type: Type.INTEGER, description: "필요 광량 점수 (0-100)" },
            lightDesc: { type: Type.STRING, description: "광량 가이드 및 배치 제안" },
            humidityScore: { type: Type.INTEGER, description: "권장 습도 점수 (0-100)" },
            humidityDesc: { type: Type.STRING, description: "습도 가이드 및 가습 요령" },
            tempMin: { type: Type.INTEGER, description: "최저 생육 온도 (℃, 숫자만)" },
            tempMax: { type: Type.INTEGER, description: "최고 생육 온도 (℃, 숫자만)" },
            tempDesc: { type: Type.STRING, description: "온도 장소 팁 설명" },
            actions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "식물 관리를 위해 지금 바로 실천할 활동 지침 목록 (3~4개)"
            }
          },
          required: [
            "speciesName", "commonName", "intro", "healthStatus", "healthScore", 
            "healthReport", "wateringSchedule", "wateringIntervalDays", "lightScore", 
            "lightDesc", "humidityScore", "humidityDesc", "tempMin", "tempMax", "tempDesc", "actions"
          ]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }

    try {
      const parsedData = JSON.parse(resultText);
      return res.json(parsedData);
    } catch (parseErr) {
      console.error("JSON parsing error of Gemini output:", resultText);
      return res.status(500).json({ error: "AI 응답 형식이 올바르지 않습니다.", rawText: resultText });
    }

  } catch (error: any) {
    console.error("Gemini Scan Error:", error);
    return res.status(500).json({
      error: "식물 분석 중 문제가 발생했습니다.",
      details: error?.message || error
    });
  }
});

// Helper function to return high quality mock plant diagnostics
function getMockDiagnosis(hint: string): any {
  const norm = hint.toLowerCase();
  
  if (norm.includes("peace") || norm.includes("스파티") || norm.includes("droop") || norm.includes("피스")) {
    return {
      speciesName: "Spathiphyllum",
      commonName: "스파티필룸 (Peace Lily)",
      intro: "우아한 흰색 불염포가 돋보이며 실내 미세먼지 제거 능력이 탁월한 정화 식물입니다.",
      healthStatus: "물 부족",
      healthScore: 42,
      healthReport: "잎들이 전체적으로 힘없이 아래로 축 늘어져 있는 상태입니다. 흙이 완전히 건조해져 수분 공급이 시급합니다. 스파티필룸은 물이 부족할 때 온몸으로 시위를 하지만, 물을 즉시 보충해주면 몇 시간 내로 다시 고개를 힘차게 드는 강인한 생명력을 가지고 있습니다.",
      wateringSchedule: "평소 7-8일에 1회 정도 겉흙이 보슬거리면 주되, 영양 성장의 봄철에는 조금 더 자주 분무해 주세요.",
      wateringIntervalDays: 7,
      lightScore: 40,
      lightDesc: "강한 직사광선보다는 레이스 커튼을 거친 부드러운 반그늘이나 밝은 실내 배치가 완벽합니다.",
      humidityScore: 75,
      humidityDesc: "60% 이상의 높은 공중 습도를 좋아합니다. 건조한 철에는 분무기로 잎 주변에 물을 뿜어주세요.",
      tempMin: 13,
      tempMax: 28,
      tempDesc: "추위에 다소 약하므로 겨울철에는 베란다에서 반드시 거실 안쪽으로 옮겨 재배하셔야 합니다.",
      actions: [
        "분 속의 흙 깊숙한 곳까지 스며들도록 욕실로 가져가 '저면관수' 방식으로 30분간 물을 듬뿍 적셔주세요.",
        "수분을 빠르게 뿜어내는 상한 갈색 끝잎들을 가위로 깔끔하게 가지치기해 주세요.",
        "직사광선이 내리쬐는 곳을 피해 공기 순환이 잘 되는 환한 거실 그늘 자리에 요양시켜 주세요."
      ]
    };
  } else if (norm.includes("snake") || norm.includes("산세") || norm.includes("스네이크")) {
    return {
      speciesName: "Sansevieria trifasciata",
      commonName: "산세베리아 (Snake Plant)",
      intro: "음이온을 풍부하게 내뿜어 침실에 두면 밤사이 호흡을 편안하게 돕는 아주 묵묵한 은인 식물입니다.",
      healthStatus: "건강함",
      healthScore: 92,
      healthReport: "입사귀가 곧게 일어서 있고 가죽 같은 검록색 무늬와 굳건한 두께가 아주 건강하게 유지되고 있습니다. 수분을 잎에 머금는 다육질 조직이 탱글하여 추가 물공급이 당장 필요 없으며, 현재 자리에서 최상의 컨디션을 보입니다.",
      wateringSchedule: "한 달에 1회(약 25-30일) 흙 전체가 먼지처럼 건조할 때 한 번씩만 화분 밑으로 물새어 나오게 듬뿍 주면 끝납니다.",
      wateringIntervalDays: 28,
      lightScore: 30,
      lightDesc: "어두운 방구석에서도 끈질기게 버티지만, 간헐적으로 환한 간접 햇빛을 공급해주면 새순이 쑥쑥 올라옵니다.",
      humidityScore: 30,
      humidityDesc: "한국의 평균적 건조한 아파트 환경에서도 별도의 습도 조절 없이 매우 무던하게 잘 살아남습니다.",
      tempMin: 10,
      tempMax: 32,
      tempDesc: "겨울철 영하 날씨의 베란다 방치는 동사의 원인이 됩니다. 실내 온도 15도 내외를 유지합니다.",
      actions: [
        "이파리 표면에 쌓인 먼지가 광합성을 방해하지 않도록 젖은 가제 수건으로 가볍게 먼지를 슥슥 닦아주세요.",
        "건강 상태가 너무 훌륭하므로 당분간 물주기는 멈추고 현 생활 패턴을 평화롭게 이어가세요.",
        "혹시 겨울철 창틀 틈새 황소바람을 직접 맞는다면 영양 차원에서 따뜻한 안쪽 구역으로 소리 없이 당겨주세요."
      ]
    };
  } else if (norm.includes("ivy") || norm.includes("아이비") || norm.includes("포토스") || norm.includes("스킨")) {
    return {
      speciesName: "Epipremnum aureum",
      commonName: "스킨답서스 (Devil's Ivy)",
      intro: "악마의 덩굴이라는 거친 이름답게 웬만한 척박한 조건에서도 수려한 잎을 떨구며 잘 자라나는 초심자 1순위 추천 식물입니다.",
      healthStatus: "햇빛 부족",
      healthScore: 65,
      healthReport: "황금비가 섞인 예쁜 얼룩덜룩 잎의 무늬가 점점 옅어져 완전한 짙은 녹색으로 단조롭게 변해가며 줄기 마디가 길고 창백하게 늘어지고 있습니다. 이는 지나치게 그늘진 구역에 오래 방치되어 광합성 효율을 짜내기 위해 억지로 줄기를 빛 찾아 뻗고 있는 현상입니다.",
      wateringSchedule: "봄부터 가을까지는 겉흙(흙 표면에서 2-3cm 깊이)이 완전히 말랐을 때 7-10일에 1회씩 듬뿍 주세요.",
      wateringIntervalDays: 9,
      lightScore: 55,
      lightDesc: "음지에서도 죽진 않지만 특유의 노랑/연두색 잎무늬 매력을 보려면 반양지나 밝은 주방 창가로 이동이 필수입니다.",
      humidityScore: 60,
      humidityDesc: "비교적 촉촉한 주방이나 욕실 습도를 가장 사랑하며 건성 기후에는 주 2회 공중분무를 환영합니다.",
      tempMin: 12,
      tempMax: 30,
      tempDesc: "겨울철 찬바람만 잘 피하면 아파트 거실 온도에서 무난하게 겨울나기가 가능합니다.",
      actions: [
        "환한 동향 또는 남향 창턱 근처로 이동하여 매일 2~3시간씩 걸러진 은은한 아침 햇살을 충전시켜 주세요.",
        "빛 구경을 골고루 할 수 있게 이틀에 한 번씩 화분을 90도씩 서서히 회전시켜 주는 지혜가 필요합니다.",
        "지나치게 창백하게 길어 나온 연약한 쇠약 잎줄기는 과감하게 원 가위로 살짝 잘라내어 물꽂이해주시면 새 뿌리가 내립니다."
      ]
    };
  } else {
    // Default Monstera
    return {
      speciesName: "Monstera deliciosa",
      commonName: "몬스테라 델리시오사 (Split-leaf Philodendron)",
      intro: "이국적인 찢어진 잎사귀가 공간의 존재감을 완벽히 장악하여 카페 인테리어 부동의 단골 손님인 식물입니다.",
      healthStatus: "건강함",
      healthScore: 88,
      healthReport: "스위스 치즈처럼 구멍 난 갈라진 잎들의 구조 상태와 광택이 우수합니다. 마디마다 공기 뿌리(공중근)가 튼튼하게 자라나고 있어 생육 에너지 및 영양 균형이 훌륭하게 유지되고 있는 건강한 청년기 상태입니다.",
      wateringSchedule: "흙을 손가락 한 마디 깊이로 찔러보아 흙이 포슬하게 말랐을 때 (약 10-12일 주기) 물이 배수구로 흐르게 듬뿍 줍니다.",
      wateringIntervalDays: 10,
      lightScore: 65,
      lightDesc: "간접광이 하루 4~6시간 머무는 거실 창측 사이드가 폭풍 성장의 로열석입니다.",
      humidityScore: 55,
      humidityDesc: "아파트 실내 습도(50% 내외)에 유연하게 적응하나 겨울철 난방 가동 시 잎 스프레이를 자주 해주시면 광택이 살아납니다.",
      tempMin: 15,
      tempMax: 29,
      tempDesc: "열대 멕시코 출신이라 20-25도의 아늑한 온도에서 최고 속도로 잎을 찢으며 성장합니다.",
      actions: [
        "지면 위로 길게 뻗어 나온 갈색 공중뿌리는 억지로 솎아 자르지 말고 자연스럽게 화분 안쪽 흙으로 꽂아 영양소 흡수를 도와주세요.",
        "덩굴성 무거운 벌크를 견디도록 친환경 원목 지지대나 코코 코이어 폴을 가운데에 든든하게 꽂고 줄기를 살짝 고정해 주세요.",
        "새순이 나오는 시기이므로 가볍게 액체 비료를 두세 방울 희석한 물을 공급해 폭발적 찢잎 생산을 응원해보세요."
      ]
    };
  }
}

// Vite and static asset serving configuration
const setupSharedServer = async () => {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file serve from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running successfully on http://localhost:${PORT}`);
  });
};

setupSharedServer().catch((err) => {
  console.error("Failed to start server:", err);
});
