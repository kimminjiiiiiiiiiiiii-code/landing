import React, { useState, useEffect } from "react";
import { Leaf, Camera, Calendar, Users, HelpCircle, Flame, Droplet, User, CheckCircle, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { Plant, CommunityPost, Comment } from "./types";
import LandingPage from "./components/LandingPage";
import AiScanner from "./components/AiScanner";
import MyPlants from "./components/MyPlants";
import Community from "./components/Community";

// Initial prepopulated mock plants for empty local storage
const DEFAULT_PLANTS: Plant[] = [
  {
    id: "default-1",
    speciesName: "Spathiphyllum",
    commonName: "스파티필룸 (Peace Lily)",
    intro: "우아한 흰색 불염포가 돋보이며 실내 미세먼지 제거 능력이 탁월한 정화 식물입니다.",
    nickname: "피스",
    location: "안방",
    wateringIntervalDays: 7,
    lastWateredDate: "2026-06-08",
    nextWateringDate: "2026-06-15", // Needs water today! (D-0)
    healthStatus: "물 부족",
    healthScore: 45,
    imageUrl: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=600&q=80",
    actions: [
      "분 속의 흙 깊숙한 곳까지 스며들도록 욕실로 가져가 '저면관수' 방식으로 30분간 물을 듬뿍 적셔주세요.",
      "수분을 빠르게 뿜어내는 상한 갈색 끝잎들을 가위로 깔끔하게 가지치기해 주세요.",
      "직사광선이 내리쬐는 곳을 피해 공기 순환이 잘 되는 환한 거실 그늘 자리에 요양시켜 주세요."
    ],
    wateringHistory: ["2026-06-01", "2026-06-08"],
    lightScore: 40,
    lightDesc: "강한 직사광선보다는 레이스 커튼을 거친 부드러운 반그늘이나 밝은 실내 배치가 완벽합니다.",
    humidityScore: 75,
    humidityDesc: "60% 이상의 높은 공중 습도를 좋아합니다. 건조한 철에는 분무기로 잎 주변에 물을 뿜어주세요.",
    tempMin: 13,
    tempMax: 28,
    tempDesc: "추위에 다소 약하므로 겨울철에는 베란다에서 반드시 거실 안쪽으로 옮겨 재배하셔야 합니다.",
    createdDate: "2026-06-01"
  },
  {
    id: "default-2",
    speciesName: "Monstera deliciosa",
    commonName: "몬스테라 델리시오사 (Split-leaf Philodendron)",
    intro: "이국적인 찢어진 잎사귀가 공간의 존재감을 완벽히 장악하여 카페 인테리어 부동의 단골 손님인 식물입니다.",
    nickname: "몬이",
    location: "거실",
    wateringIntervalDays: 10,
    lastWateredDate: "2026-06-09",
    nextWateringDate: "2026-06-19", // Water in 4 days (D-4)
    healthStatus: "건강함",
    healthScore: 90,
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    actions: [
      "새순이 나오는 시기이므로 가볍게 액체 비료를 두세 방울 희석한 물을 공급해 폭발적 찢잎 생산을 응원해보세요.",
      "덩굴성 무거운 벌크를 견디도록 친환경 원목 지지대나 코코 코이어 폴을 가운데에 든든하게 꽂고 줄기를 살짝 고정해 주세요."
    ],
    wateringHistory: ["2026-05-30", "2026-06-09"],
    lightScore: 65,
    lightDesc: "간접광이 하루 4~6시간 머무는 거실 창측 사이드가 폭풍 성장의 로열석입니다.",
    humidityScore: 55,
    humidityDesc: "아파트 실내 습도(50% 내외)에 유연하게 적응하나 겨울철 난방 가동 시 잎 스프레이를 자주 해주시면 광택이 살아납니다.",
    tempMin: 15,
    tempMax: 29,
    tempDesc: "열대 멕시코 출신이라 20-25도의 아늑한 온도에서 최고 속도로 잎을 찢으며 성장합니다.",
    createdDate: "2026-05-30"
  }
];

// Initial pre-populated community posts
const DEFAULT_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorName: "해피가드너 🌱",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=contain&w=150&q=80",
    content: "여러분! 우리집 몬스테라가 마침내 세 번째 찢잎을 힘차게 뿜었습니다! 아침에 분무해주다가 발견하고 너무 행복해서 손뼉을 쳤네요. 지지대를 새로 꽂아 주었더니 위쪽 목대가 건강해 지면서 성장이 빠른 것 같습니다. 다들 초보식집사친구로 건강 점수 몇 점 받으셨나요? 전 90점이에요! 🌿",
    timestamp: "2026-06-14 20:45",
    likes: 18,
    likedByUser: false,
    plantName: "몬이 (몬스테라)",
    plantStatus: "완전 건강함",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    comments: [
      {
        id: "post-1-comment-1",
        authorName: "초록꿈이 🏡",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=contain&w=150&q=80",
        content: "와, 찢잎 무늬가 예술이네요! 저희 집 몬이는 햇빛이 부족해서 아직 안 찢어지는데... 저도 물주기 대기 맞춰서 조도 옮겨 줘 봐야겠습니다 ㅎㅎ",
        timestamp: "2026-06-14 21:12"
      }
    ],
    tags: ["성장기록", "초보팁", "인테리어"]
  },
  {
    id: "post-2",
    authorName: "양가드너 👨‍🌾",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=contain&w=150&q=80",
    content: "초보분들이 가장 실수하기 쉬운 게 '물주기 날짜'를 고정해두고 매주 토요일마다 한 번씩 기계적으로 관수하는 것입니다. 화분 속 흙의 마름도는 통풍과 일조량에 따라 매주 달라지기 때문에, 손가락으로 겉흙을 2cm 깊이로 찔러보거나 이쑤시개로 확인 후 말라있을 때 기수하는 것이 '과습' 동사를 피하는 비결이라 생각합니다.",
    timestamp: "2026-06-13 14:22",
    likes: 32,
    likedByUser: true,
    comments: [
      {
        id: "post-2-comment-1",
        authorName: "새내기집사",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=contain&w=150&q=80",
        content: "아하! 이쑤시개 꿀팁 정말 감사합니다. 매일 관수했는데 흙이 질척여서 걱정이었거든요. 당장 멈춰야겠어요 ㅜㅜ",
        timestamp: "2026-06-13 15:05"
      }
    ],
    tags: ["초보팁", "인테리어"]
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home"); // home (landing) | welcome (dashboard landing) | scanner | calendar | community
  const [plants, setPlants] = useState<Plant[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  // Load plants and posts from localStorage on rise
  useEffect(() => {
    const savedPlants = localStorage.getItem("plant_garden_list");
    if (savedPlants) {
      setPlants(JSON.parse(savedPlants));
    } else {
      setPlants(DEFAULT_PLANTS);
      localStorage.setItem("plant_garden_list", JSON.stringify(DEFAULT_PLANTS));
    }

    const savedPosts = localStorage.getItem("plant_community_posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(DEFAULT_POSTS);
      localStorage.setItem("plant_community_posts", JSON.stringify(DEFAULT_POSTS));
    }
  }, []);

  const savePlantsToStorage = (updatedList: Plant[]) => {
    setPlants(updatedList);
    localStorage.setItem("plant_garden_list", JSON.stringify(updatedList));
  };

  const savePostsToStorage = (updatedPosts: CommunityPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem("plant_community_posts", JSON.stringify(updatedPosts));
  };

  // Add parsed plant into user garden
  const handleAddPlantToGarden = (newPlant: Omit<Plant, "id" | "createdDate" | "wateringHistory">) => {
    const freshPlant: Plant = {
      ...newPlant,
      id: `plant-${Date.now()}`,
      createdDate: new Date().toISOString().split("T")[0],
      wateringHistory: [new Date().toISOString().split("T")[0]] // base water day
    };

    const updated = [...plants, freshPlant];
    savePlantsToStorage(updated);
  };

  // Trigger quick water completed action
  const handleWaterPlant = (plantId: string, customDate?: string) => {
    const todayStr = customDate || new Date().toISOString().split("T")[0];
    
    const updated = plants.map((plant) => {
      if (plant.id === plantId) {
        // Prevent duplicate water log on exact same day
        const hasWateredToday = plant.wateringHistory.includes(todayStr);
        const history = hasWateredToday ? plant.wateringHistory : [...plant.wateringHistory, todayStr];
        
        // Calculate new nextWateringDate
        const nextTime = new Date(todayStr);
        nextTime.setDate(nextTime.getDate() + plant.wateringIntervalDays);
        const nextWaterDateStr = nextTime.toISOString().split("T")[0];

        return {
          ...plant,
          healthStatus: "건강함" as const, // Regains moisture
          lastWateredDate: todayStr,
          nextWateringDate: nextWaterDateStr,
          wateringHistory: history,
          healthScore: Math.min(100, plant.healthScore + 8) // Incremental healthy bonus
        };
      }
      return plant;
    });

    savePlantsToStorage(updated);
  };

  // Delete/Disband plant from garden list
  const handleDeletePlant = (plantId: string) => {
    const filtered = plants.filter((p) => p.id !== plantId);
    savePlantsToStorage(filtered);
  };

  // Social interactions inside Community
  const handleAddPost = (content: string, plantName?: string) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: "나 🍃",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=contain&w=150&q=80",
      content: content,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      likes: 0,
      likedByUser: false,
      plantName: plantName,
      plantStatus: plantName ? "돌봄 집중" : undefined,
      comments: [],
      tags: plantName ? ["Q&A 질문방", "돌봄지속"] : ["성장기록"]
    };

    const nextPosts = [newPost, ...posts];
    savePostsToStorage(nextPosts);

    // AI Dr automated trigger check
    const contentText = content.toLowerCase();
    const isQuestion = contentText.includes("?") || contentText.includes("왜") || contentText.includes("아파") || contentText.includes("문제") || contentText.includes("시들");
    
    if (isQuestion) {
      // Simulate highly responsive expert expert robotic answer after 1.8 seconds!
      setTimeout(() => {
        const aiAnswer: Comment = {
          id: `comment-ai-${Date.now()}`,
          authorName: "👨‍⚕️ AI 식물주치의 (Symptom Bot)",
          authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=contain&w=150&q=80",
          content: `새싹 집사님 반갑습니다! 적으신 증상 요약 결과, 식물 화분의 '통풍 불량' 및 잔여 과습 위험이 엿보입니다.
          
          [응급 자가진단 팁]:
          1. 잎 한두 개가 노랗게 뜨며 흐물거리면 즉시 관수를 멈추고 흙마름을 도와주세요.
          2. 선풍기나 서큘레이터 간접 미풍을 화분 주위에 쐬여 주어 공기 순환을 높여 주는 것이 큰 약이 됩니다.
          3. 화분 속 흙마름 수치와 광도를 세심하게 대조해보시길 권장합니다. 화이팅입니다!`,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
        };

        const reloadedPosts = nextPosts.map((p) => {
          if (p.id === newPost.id) {
            return {
              ...p,
              comments: [...p.comments, aiAnswer]
            };
          }
          return p;
        });
        savePostsToStorage(reloadedPosts);
      }, 1500);
    }
  };

  const handleLikePost = (postId: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
          likedByUser: !post.likedByUser
        };
      }
      return post;
    });
    savePostsToStorage(updated);
  };

  const handleAddComment = (postId: string, commentText: string) => {
    const freshComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: "나 🍃",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=contain&w=150&q=80",
      content: commentText,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, freshComment]
        };
      }
      return post;
    });
    savePostsToStorage(updated);
  };

  const handleNavigateToTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Standard root rendering router
  if (currentTab === "home") {
    return <LandingPage onEnterApp={handleNavigateToTab} />;
  }

  return (
    <div className="bg-[#f9f9ff] min-h-screen text-[#111c2d] flex flex-col font-sans overflow-x-hidden pt-16 selection:bg-[#22c55e]/20">
      {/* Dynamic TopAppBar inside Dashboard */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-[#bccbb9]/30 shadow-xs">
        <div className="flex justify-between items-center px-4 md:px-12 max-w-7xl mx-auto h-16">
          {/* Logo return to land */}
          <div 
            onClick={() => handleNavigateToTab("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="text-[#006e2f] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 fill-[#006e2f]/10" />
            </span>
            <span className="text-lg md:text-xl font-bold font-display text-[#006e2f] tracking-tight">
              초보식집사친구
            </span>
          </div>

          {/* Desktop tab links */}
          <div className="hidden md:flex gap-6 items-center">
            <button
              onClick={() => handleNavigateToTab("welcome")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                currentTab === "welcome"
                  ? "bg-[#006e2f]/10 text-[#006e2f] border-[#006e2f]/20 font-extrabold"
                  : "text-[#3d4a3d] border-transparent hover:bg-stone-100"
              }`}
            >
              종합가이드
            </button>
            <button
              onClick={() => handleNavigateToTab("scanner")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                currentTab === "scanner"
                  ? "bg-[#006e2f]/10 text-[#006e2f] border-[#006e2f]/20 font-extrabold"
                  : "text-[#3d4a3d] border-transparent hover:bg-stone-100"
              }`}
            >
              AI 식물 진단
            </button>
            <button
              onClick={() => handleNavigateToTab("calendar")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                currentTab === "calendar"
                  ? "bg-[#006e2f]/10 text-[#006e2f] border-[#006e2f]/20 font-extrabold"
                  : "text-[#3d4a3d] border-transparent hover:bg-stone-100"
              }`}
            >
              내 물주기 달력 ({plants.length})
            </button>
            <button
              onClick={() => handleNavigateToTab("community")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                currentTab === "community"
                  ? "bg-[#006e2f]/10 text-[#006e2f] border-[#006e2f]/20 font-extrabold"
                  : "text-[#3d4a3d] border-transparent hover:bg-stone-100"
              }`}
            >
              새싹 커뮤니티
            </button>
          </div>

          {/* Right Profile tag */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs" title="초보 식집사 프로필">
              나
            </div>
            <span className="text-xs font-bold text-[#3d4a3d] hidden sm:block">초보 식집사</span>
          </div>
        </div>
      </nav>

      {/* Nav Link Indicators ribbon in Mobile views */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 grid grid-cols-4 py-2 text-center h-16 shadow-lg">
        <button
          onClick={() => handleNavigateToTab("welcome")}
          className={`flex flex-col items-center justify-center cursor-pointer ${
            currentTab === "welcome" ? "text-[#006e2f] font-extrabold" : "text-gray-400"
          }`}
        >
          <Leaf className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">인기 가이드</span>
        </button>
        <button
          onClick={() => handleNavigateToTab("scanner")}
          className={`flex flex-col items-center justify-center cursor-pointer ${
            currentTab === "scanner" ? "text-[#006e2f] font-extrabold" : "text-gray-400"
          }`}
        >
          <Camera className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">AI 진단기</span>
        </button>
        <button
          onClick={() => handleNavigateToTab("calendar")}
          className={`flex flex-col items-center justify-center cursor-pointer ${
            currentTab === "calendar" ? "text-[#006e2f] font-extrabold" : "text-gray-400"
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">물주기달력</span>
        </button>
        <button
          onClick={() => handleNavigateToTab("community")}
          className={`flex flex-col items-center justify-center cursor-pointer ${
            currentTab === "community" ? "text-[#006e2f] font-extrabold" : "text-gray-400"
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">새싹광장</span>
        </button>
      </div>

      {/* Main Body container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-10 pb-24 md:pb-12">
        {currentTab === "welcome" && (
          /* Comprehensive Overview first-time setup dashboard guide */
          <div className="space-y-8 animate-fade-in">
            {/* Top welcome hero card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-4">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-[#22c55e]/10 text-[#006e2f] rounded-full text-xs font-bold leading-none font-display">
                  Welcome back! Plant Family 
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#111c2d] leading-snug">
                  초보식집사친구 대시보드에 오신 것을 환영합니다!
                </h1>
                <p className="text-[#3d4a3d] text-xs md:text-sm leading-relaxed max-w-3xl">
                  이 대시보드는 식물의 복잡해 보이는 생존 신호를 간명하게 규정하고 케어할 수 있도록 돕는 실무 케어 플랫폼입니다. 위의 탭을 거쳐 화분을 신속 진단해보시거나 급수 로그를 동기화해 나가실 수 있습니다.
                </p>
              </div>

              <div className="flex flex-flex gap-3">
                <button
                  onClick={() => handleNavigateToTab("scanner")}
                  className="bg-[#006e2f] hover:bg-[#005321] text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 transition-transform hover:scale-101 cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> 실시간 식물 진단 돌입하기
                </button>
                <button
                  onClick={() => handleNavigateToTab("calendar")}
                  className="bg-[#f0f3ff] hover:bg-emerald-50 text-[#006e2f] border border-blue-200 text-xs font-extrabold px-5 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" /> 내 세팅 칼린더 살펴보기
                </button>
              </div>
            </div>

            {/* Quick tips dynamic widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: Weather alert */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-3">
                <span className="p-1 px-2.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-extrabold font-display leading-none">
                  오늘의 기수 지보
                </span>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Droplet className="w-5 h-5 fill-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111c2d] leading-none">실내 공중 건조 경계</h4>
                    <p className="text-[10px] text-stone-500 mt-1">상아습도 42% 기록</p>
                  </div>
                </div>

                <p className="text-[11px] text-[#3d4a3d] leading-normal">
                  장마기가 시작되어 외부 다습하나, 에어컨 건조 바람으로 잎마름 현상이 예상되오니 이침과 저녁 잎 스프레이를 요망합니다.
                </p>
              </div>

              {/* Box 2: Garden status summary */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-3">
                <span className="p-1 px-2.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold font-display leading-none">
                  화분 동기 상태
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111c2d] leading-none">전원 무사히 재배 중</h4>
                    <p className="text-[10px] text-stone-500 mt-1">총 화분 {plants.length}개 가꾸는 중</p>
                  </div>
                </div>

                <p className="text-[11px] text-[#3d4a3d] leading-normal">
                  현재 지연 등록된 급수 대기 화분은 {plants.filter(p => p.healthStatus === "물 부족").length}개 입니다. 물주기를 완료하면 상태가 자동으로 건강함으로 즉시 변경됩니다.
                </p>
              </div>

              {/* Box 3: Social activity widget */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-3">
                <span className="p-1 px-2.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold font-display leading-none">
                  커뮤니티 새싹 소리
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111c2d] leading-none">최근 수다 활성화</h4>
                    <p className="text-[10px] text-stone-500 mt-1">전체 포스팅 {posts.length}개</p>
                  </div>
                </div>

                <p className="text-[11px] text-[#3d4a3d] leading-normal">
                  질문 글에 Q&A 질문방 태그나 물음표를 남겨 주시면 실시간 동작 인공지능 주치의 봇이 유용한 자가진단 댓글을 달아 줍니다!
                </p>
              </div>
            </div>

            {/* Quick Plant list navigation links preview */}
            <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-display font-black text-[#111c2d] text-base">가드닝에 등록된 반려식물 근황</h3>
                <button
                  onClick={() => handleNavigateToTab("calendar")}
                  className="text-xs font-bold text-[#006e2f] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  캘린더 전체 제어 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plants.slice(0, 4).map((plant) => (
                  <div
                    key={plant.id}
                    onClick={() => handleNavigateToTab("calendar")}
                    className="flex gap-4 p-4 rounded-xl border border-stone-150 hover:border-emerald-500/40 cursor-pointer bg-[#f9f9ff]/40 transition-all items-center"
                  >
                    <img
                      alt={plant.nickname}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      src={plant.imageUrl}
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display font-extrabold text-[#111c2d] text-sm truncate">{plant.nickname}</h4>
                        <span className="text-[10px] text-stone-400 font-mono flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" /> {plant.location}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 truncate leading-relaxed mt-0.5">{plant.commonName}</p>
                      
                      <div className="flex justify-between items-center gap-1 mt-1">
                        <span className={`text-[10px] font-bold ${
                          plant.healthStatus === "건강함" ? "text-emerald-700" : "text-rose-700 font-black animate-pulse"
                        }`}>
                          ● 상태: {plant.healthStatus}
                        </span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black font-display">
                          {plant.nextWateringDate} 물주기
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === "scanner" && (
          <AiScanner onAddPlant={handleAddPlantToGarden} onNavigateToTab={handleNavigateToTab} />
        )}

        {currentTab === "calendar" && (
          <MyPlants
            plants={plants}
            onWaterPlant={handleWaterPlant}
            onDeletePlant={handleDeletePlant}
            onNavigateToTab={handleNavigateToTab}
          />
        )}

        {currentTab === "community" && (
          <Community
            posts={posts}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
          />
        )}
      </main>

      {/* Floating back-to-landing button in non-home screens */}
      <button
        onClick={() => handleNavigateToTab("home")}
        className="fixed bottom-20 md:bottom-6 right-6 p-3 bg-white text-emerald-800 border-2 border-emerald-600/30 rounded-full shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-transform flex items-center justify-center z-45"
        title="메인 소개 랜딩 페이지로 돌아가기"
      >
        <Leaf className="w-5 h-5 text-[#006e2f] fill-emerald-500/10" />
      </button>
    </div>
  );
}
