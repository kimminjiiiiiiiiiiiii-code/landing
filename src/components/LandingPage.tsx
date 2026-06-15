import React from "react";
import { Leaf, Calendar, Users, Camera, Sun, Info, Flame, ChevronRight } from "lucide-react";

interface LandingPageProps {
  onEnterApp: (initialTab?: string) => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="bg-[#f9f9ff] text-[#111c2d] font-sans antialiased selection:bg-[#22c55e]/20 overflow-x-hidden">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#f9f9ff]/80 backdrop-blur-md border-b border-[#bccbb9]/30 shadow-xs">
        <div className="flex justify-between items-center px-4 md:px-12 max-w-7xl mx-auto h-16">
          <div className="flex items-center gap-2">
            <span className="text-[#006e2f] flex items-center justify-center">
              <Leaf className="w-7 h-7 fill-[#006e2f]/20 text-[#006e2f]" />
            </span>
            <span className="text-xl md:text-2xl font-bold font-display text-[#006e2f] tracking-tight">
              초보식집사친구
            </span>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            <a href="#home" className="text-[#006e2f] font-semibold border-b-2 border-[#006e2f] py-1 text-sm">
              Home
            </a>
            <a href="#features" className="text-[#3d4a3d] hover:text-[#006e2f] transition-colors text-sm font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-[#3d4a3d] hover:text-[#006e2f] transition-colors text-sm font-medium">
              How it works
            </a>
            <button
              onClick={() => onEnterApp("scanner")}
              className="text-[#3d4a3d] hover:text-[#006e2f] transition-colors text-sm font-medium cursor-pointer"
            >
              AI 진단기
            </button>
            <button
              onClick={() => onEnterApp("calendar")}
              className="text-[#3d4a3d] hover:text-[#006e2f] transition-colors text-sm font-medium cursor-pointer"
            >
              물주기 달력
            </button>
          </div>

          <a
            href="https://neon-delta-88.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#006e2f] hover:bg-[#006e2f]/90 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-250 cursor-pointer shadow-xs inline-flex items-center"
          >
            지금 시작하기
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-16 md:pb-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 bg-[#22c55e]/10 text-[#005321] rounded-full text-xs font-bold font-display uppercase tracking-wider">
              Botanical Care x Technology
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#111c2d] font-extrabold leading-tight tracking-tight">
              초보식집사친구 <br className="hidden md:block"/>
              <span className="text-[#006e2f] block mt-2">당신의 식물을 위한<br/>든든한 동반자</span>
            </h1>
            <p className="text-[#3d4a3d] text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              초보 식집사도 전문가처럼, AI 분석과 기록으로 반려식물을 건강하게 키워보세요. 디지털 젠을 경험하는 가장 쉬운 방법입니다.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://neon-delta-88.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-14 px-8 bg-[#006e2f] text-white rounded-full font-bold text-sm tracking-wide shadow-lg shadow-[#006e2f]/20 hover:scale-105 hover:bg-[#006e2f]/95 active:scale-100 transition-all cursor-pointer"
              >
                무료로 대시보드 입장
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
              <button
                onClick={() => onEnterApp("scanner")}
                className="inline-flex items-center justify-center h-14 px-8 bg-white border border-[#bccbb9] text-[#006e2f] rounded-full font-bold text-sm hover:bg-emerald-50/50 transition-all cursor-pointer"
              >
                AI 스캐너 미리 체험
              </button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-[#006e2f]/5 blur-3xl rounded-full"></div>
            {/* The hotlinked phone mockup provided in user image */}
            <img
              alt="초보식집사친구 앱 목업"
              className="relative z-10 w-full max-w-[480px] drop-shadow-2xl rounded-2xl transform hover:scale-[1.02] transition-transform duration-300"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBFsFWfoavbjUoHhfyruijF_RJ-ncFdW3F3_0dND1D1_dfvpdXx57YQE4O6YQyrN8HqnoPVWrdQdYq6wGB4_7Yta5tr9fG1qyUve0VIm5XTmH3JLN2cEPgUBr_5VWgVvpfJdFkKoyMV4Aqll3rpq0KrAwdkLXTREgUd2VK112qT81xPGfiAfMsd_i3ZSox7J_R49E9RexMWUmN4CsKCUk9TrL_qTlVgEIVsEVvnTfnlFRhTxW5hrsx8NnDLw47Vdf0iIy1a3PWB5-h"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section id="features" className="py-20 px-4 md:px-12 max-w-7xl mx-auto bg-white/40 rounded-3xl border border-[#bccbb9]/20 backdrop-blur-xs my-8">
        <div className="text-center mb-16 space-y-3">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111c2d] tracking-tight">
            더 똑똑하게, 더 가깝게
          </h2>
          <p className="text-[#3d4a3d] text-base">
            식물 키우기의 어려움을 AI와 함께 스마트하게 극복해 나가세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1: AI Plant Analyzer */}
          <div 
            onClick={() => onEnterApp("scanner")}
            className="bento-card group bg-white p-8 rounded-2xl border border-[#bccbb9]/30 flex flex-col gap-6 cursor-pointer shadow-xs hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 rounded-xl bg-[#22c55e]/10 flex items-center justify-center overflow-hidden border border-[#22c55e]/20 group-hover:scale-105 transition-transform">
              <img
                alt="식물 사진 추가 아이콘"
                className="w-12 h-12 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0QwGHpBOyNvnaW4Nkh-8yl8t4KbN6lbqAZTKpbvOEWtLseKw_BalVK1oaN_Hsi0stlzZQJTkcVZEuIUF-rlsGwdNfID04t75KasGq2-XPAQcmU5ZbqQufyx6W9vWGfYICDejTeNmom-jSPHYnZ50NaYZehv4uMRVQyB2cXu_BAGN0Y07p7cUqo54fJ6lTKdb_TIgwYLTz61-soVTs2KeFnPFsvf7Prmf-WVUCAB7wFmYrcsYG9FXAyHdUdXGtbFwMK1wgHMJ3zkml"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#006e2f] mb-2 flex items-center gap-1.5 group-hover:text-[#22c55e] transition-colors">
                식물 사진 추가
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[#3d4a3d] text-sm leading-relaxed">
                AI가 소장하신 소중한 화분의 사진을 판독하여 식물의 학명 및 한글 이름, 정밀 생육 상태 점수를 제공하고 맞춤 요령을 짚어 줍니다.
              </p>
            </div>
          </div>

          {/* Feature Card 2: Watering Calendar */}
          <div 
            onClick={() => onEnterApp("calendar")}
            className="bento-card group bg-white p-8 rounded-2xl border border-[#bccbb9]/30 flex flex-col gap-6 cursor-pointer shadow-xs hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 rounded-xl bg-[#22c55e]/10 flex items-center justify-center overflow-hidden border border-[#22c55e]/20 group-hover:scale-105 transition-transform">
              <img
                alt="물주기 달력 아이콘"
                className="w-12 h-12 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH-2AlM11_ylt5re-MR5FvImkw3l97W6wtTbGvKQaLx57FMHUHZfsoXVMD-cHkkG_C0OgI76OnQg6NNfE2iwuZiL5J1yGcEjat9lBrGY7tCbxm5yxMDVdVjOvU__rRG384BHGkHqupocKOVtF4xgUZ85sjWn30DvQryAE1e8dOxFrUNSIXxkHxPaYRyBT9PGiQrvgk84h84VNGiWmnyaJwLZ5ID9PNISBdbf7pDgDNf9O5i19jd4ljE7GQ8LpETDNk0vuVt_2pQtYp"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#006e2f] mb-2 flex items-center gap-1.5 group-hover:text-[#22c55e] transition-colors">
                물주기 달력
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[#3d4a3d] text-sm leading-relaxed">
                식물의 요일별 권장 물주기 날짜를 똑똑하게 수립하고 달력에 연동해, 알맞은 리마인딩을 받으며 집사 일기를 쓸 수 있게 도와줍니다.
              </p>
            </div>
          </div>

          {/* Feature Card 3: Roots Community */}
          <div 
            onClick={() => onEnterApp("community")}
            className="bento-card group bg-white p-8 rounded-2xl border border-[#bccbb9]/30 flex flex-col gap-6 cursor-pointer shadow-xs hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 rounded-xl bg-[#22c55e]/10 flex items-center justify-center overflow-hidden border border-[#22c55e]/20 group-hover:scale-105 transition-transform">
              <img
                alt="식집사 커뮤니티 아이콘"
                className="w-12 h-12 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-IoimTboCwBF7eqvAkvbHqAGWn5XAfRH_ZTtsHdf8XDqNwHwMSuHMwTo-7aVY6bzOKUxCWNATs4PmjgRaUH_HH6YYi-LaKUTTjmHh7G5vYH3Vjwngehq8O80WuTxm5J_7U9vDHXLqQ3SG6e2mgUpOCQciEmjnniFqKgxHBGaW2rjO_lTJa5N9lSH2ZHvzTEpFjXd6bl0Pu1DnUMwzb-ScLBKE6yusjCT67K4fWjsNmeZgurnmmdpLpJsFXVTjap6OeOBunCt-TShY"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#006e2f] mb-2 flex items-center gap-1.5 group-hover:text-[#22c55e] transition-colors">
                식집사 커뮤니티
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[#3d4a3d] text-sm leading-relaxed">
                식물이 시들거나 노란 반점을 얻었을 때 다름 식집사들과 물어보고, 자신만의 인테리어 플랜테리어 사진을 다정하게 소통하고 공유해봐요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#f0f3ff] rounded-3xl my-8 px-4 md:px-12 max-w-7xl mx-auto border border-[#dee8ff]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111c2d] tracking-tight">
              어떻게 사용하나요?
            </h2>
            <div className="space-y-6 relative pl-4">
              <div className="absolute left-6 top-3 bottom-3 w-[2px] bg-[#006e2f]/20"></div>
              
              {/* Step 1 */}
              <div className="relative flex gap-6 pl-10">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-[#006e2f] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  1
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-[#111c2d] mb-1">분석하기</h4>
                  <p className="text-[#3d4a3d] text-sm leading-relaxed">
                    가지고 계신 화분의 정면 사진을 찍거나 첨부하면, 초보식집사친구 AI가 즉각적으로 종식 및 건강 지표를 뽑아 알려줍니다.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex gap-6 pl-10">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-[#006e2f] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  2
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-[#111c2d] mb-1">기록하기</h4>
                  <p className="text-[#3d4a3d] text-sm leading-relaxed">
                    물주기 실행 후 터치 한 번으로 물주기를 기록하면 스마트 달력이 기준일을 기전 삼아 다음 회차 예정일을 알아서 동기화합니다.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex gap-6 pl-10">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-[#006e2f] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  3
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-[#111c2d] mb-1">소통하기</h4>
                  <p className="text-[#3d4a3d] text-sm leading-relaxed">
                    커뮤니티에서 궁금한 이상징후에 대해 소통하고 노하우를 받으세요. 실시간 전문 원예 정보와 소소한 힐링을 엮어나가실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[9/16] bg-white rounded-[2.5rem] shadow-xl border-[8px] border-[#111c2d] overflow-hidden flex flex-col justify-center items-center p-6 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-[#006e2f]/5 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Camera className="text-[#006e2f] w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h5 className="font-display text-base font-bold text-[#006e2f]">Step 1: AI 스캔 중...</h5>
                  <p className="text-xs text-[#3d4a3d]">이파리 표면의 엽록소 패턴 및 처짐 상태를 원격 정밀 센싱하고 있습니다.</p>
                </div>
                <div className="w-full bg-[#bccbb9]/30 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-[#006e2f] h-full w-[75%] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners / Technology Stack */}
      <section className="py-16 px-4 md:px-12 max-w-7xl mx-auto text-center space-y-6">
        <h3 className="text-xs text-[#3d4a3d] uppercase tracking-wider font-bold">최신 AI 기술로 만들어진 서비스</h3>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 font-bold text-lg text-[#505f76]">
            <Sun className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>Upstage Solar AI</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-lg text-[#505f76]">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-400" />
            <span>Firebase Auth & Store</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-lg text-[#505f76]">
            <Info className="w-5 h-5 text-blue-500" />
            <span>Vercel Platform</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#006e2f] to-[#22c55e] rounded-3xl p-8 md:p-14 text-center text-white relative overflow-hidden shadow-lg shadow-[#006e2f]/20">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 border-[32px] border-white rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 border-[48px] border-white rounded-full"></div>
          </div>
          
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            지금 무료로 시작하세요
          </h2>
          <p className="text-base md:text-lg mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            더 이상 집 안에 홀로 시들어가는 식물을 보며 미안해하고 슬퍼하지 마세요.<br className="hidden sm:block"/>
            초보식집사친구 AI 대시보드가 당신의 촉촉한 플랜트 라이프를 든든하게 지켜드립니다.
          </p>
          <a 
            href="https://neon-delta-88.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 px-8 bg-white text-[#006e2f] rounded-full font-bold text-sm items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            앱 바로가기
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#bccbb9]/40 w-full py-12 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Leaf className="w-5 h-5 text-[#006e2f] fill-[#006e2f]/10" />
            <span className="font-display text-lg font-bold text-[#006e2f]">초보식집사친구</span>
          </div>
          <div className="flex flex-wrap gap-6 justify-center text-sm text-[#3d4a3d]">
            <a href="#home" className="hover:text-[#006e2f] transition-colors underline decoration-dotted">이용약관</a>
            <a href="#features" className="hover:text-[#006e2f] transition-colors underline decoration-dotted">개인정보처리방침</a>
            <a href="#how-it-works" className="hover:text-[#006e2f] transition-colors underline decoration-dotted">문의하기</a>
          </div>
          <p className="text-xs text-[#3d4a3d]/70 text-center md:text-right">
            © 2026 초보식집사친구. All rights reserved. Powered by Upstage Solar AI & Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
}
