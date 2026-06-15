import React, { useState } from "react";
import { TreeDeciduous, Calendar, Droplet, PlusCircle, Check, MapPin, ChevronLeft, ChevronRight, Activity, Thermometer, Sun, Wind, HelpCircle, CheckCircle } from "lucide-react";
import { Plant } from "../types";

interface MyPlantsProps {
  plants: Plant[];
  onWaterPlant: (plantId: string, customDate?: string) => void;
  onDeletePlant: (plantId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function MyPlants({ plants, onWaterPlant, onDeletePlant, onNavigateToTab }: MyPlantsProps) {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  
  // Calendar Month selection states
  const [currentDate, setCurrentDate] = useState(new Date("2026-06-15")); // Anchor around current prompt meta time (June 2026)

  const changeMonth = (offset: number) => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(next);
  };

  // Helper date parsing
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday, 6 is Saturday
  };

  const getCalendarCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-15 format
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const cells: { dateStr: string; dayNum: number | null }[] = [];

    // Empty buffer cells for preceding month
    for (let i = 0; i < firstDay; i++) {
      cells.push({ dateStr: "", dayNum: null });
    }

    // Actual day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const dayString = d < 10 ? `0${d}` : `${d}`;
      const monthString = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
      const dateStr = `${year}-${monthString}-${dayString}`;
      cells.push({ dateStr, dayNum: d });
    }

    return cells;
  };

  const cells = getCalendarCells();
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const getWateringScheduleForDate = (dateStr: string) => {
    if (!dateStr) return [];
    return plants.filter((plant) => plant.nextWateringDate === dateStr);
  };

  const getWaterHistoryForDate = (dateStr: string) => {
    if (!dateStr) return [];
    const matchedPlants: { plant: Plant; count: number }[] = [];
    plants.forEach((p) => {
      const occurrences = p.wateringHistory.filter((d) => d === dateStr).length;
      if (occurrences > 0) {
        matchedPlants.push({ plant: p, count: occurrences });
      }
    });
    return matchedPlants;
  };

  const calculateDDay = (nextWaterDate: string) => {
    const today = new Date("2026-06-15"); // Fixed current baseline 2026-06-15
    const target = new Date(nextWaterDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "D-0 (오늘 물주기!)";
    if (diffDays < 0) return `D+${Math.abs(diffDays)}지연!`;
    return `D-${diffDays}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Title Grid */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 md:p-8 rounded-2xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black font-display tracking-tight">나의 스마트 식물 도감 & 케어 캘린더</h2>
          <p className="text-emerald-100/80 text-xs md:text-sm">
            등록된 식물의 D-Day 및 물주기 기록들을 달력 한눈으로 편리하게 케어하고 다스릴 수 있습니다.
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab("scanner")}
          className="bg-white text-[#006e2f] hover:bg-neutral-50 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform hover:scale-[1.01] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          새 식물 분석 및 추가하기
        </button>
      </div>

      {plants.length === 0 ? (
        /* Empty garden notice card */
        <div className="bg-white p-12 text-center border border-[#bccbb9]/40 rounded-2xl space-y-4 max-w-2xl mx-auto shadow-xs">
          <TreeDeciduous className="w-16 h-16 text-[#bccbb9]/80 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-display font-black text-[#111c2d] text-base">아직 등록된 화분이 없습니다</h3>
            <p className="text-xs text-[#3d4a3d] max-w-sm mx-auto leading-relaxed">
              분석소 탭에서 자신의 식물 사진을 올리시거나 프리셋 테스트를 거쳐 도감에 저장하시면 완벽한 원목 캘린더를 시작하실 수 있습니다.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab("scanner")}
            className="bg-[#006e2f] hover:bg-[#006e2f]/90 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-transform hover:scale-102"
          >
            첫 식물 추가하러 가기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main List of Plants (ColSpan: 5) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display font-bold text-sm text-[#111c2d] flex items-center gap-1.5 px-1">
              <TreeDeciduous className="w-4 h-4 text-[#006e2f]" />
              내 소중한 화분 목록 ({plants.length}개)
            </h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {plants.map((plant) => {
                const dDayText = calculateDDay(plant.nextWateringDate);
                const isOverdue = dDayText.includes("지연") || dDayText.includes("D-0");
                
                return (
                  <div
                    key={plant.id}
                    className={`bg-white rounded-xl border border-gray-150 p-4 flex gap-4 hover:shadow-md hover:border-emerald-500/40 cursor-pointer transition-all ${
                      selectedPlant?.id === plant.id ? "ring-2 ring-[#006e2f] border-transparent" : ""
                    }`}
                    onClick={() => setSelectedPlant(plant)}
                  >
                    <img
                      alt={plant.nickname}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-stone-100"
                      src={plant.imageUrl}
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-display font-bold text-sm text-[#111c2d] truncate">
                            {plant.nickname}
                          </h4>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            plant.healthStatus === "건강함" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {plant.healthStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {plant.commonName}
                        </p>
                      </div>

                      <div className="flex justify-between items-end gap-2 pt-2">
                        <span className="text-[10px] text-[#3d4a3d] flex items-center gap-0.5 font-medium">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {plant.location}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black font-display px-2 py-0.5 rounded-md ${
                            isOverdue ? "bg-rose-50 text-rose-700 animate-pulse" : "bg-neutral-100 text-[#006e2f]"
                          }`}>
                            {dDayText}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Stop parent modal triggering
                              onWaterPlant(plant.id);
                            }}
                            className="bg-[#f0f3ff] hover:bg-blue-600 hover:text-white text-[#006e2f] border border-blue-200 p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center"
                            title="오늘 관수한 것으로 달력 연동"
                          >
                            <Droplet className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Month Calendar view (ColSpan: 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
              {/* Calendar Month Selector Header */}
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#006e2f]" />
                  <h3 className="font-display font-extrabold text-[#111c2d] text-base">
                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 물주기 스케줄
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-1.5 hover:bg-gray-150 rounded-lg cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date("2026-06-15"))}
                    className="text-[11px] px-2 py-1 bg-stone-50 border hover:bg-stone-100 rounded-md font-bold cursor-pointer"
                  >
                    오늘
                  </button>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-1.5 hover:bg-gray-150 rounded-lg cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Monthly Custom Grid rendering */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* Headers */}
                {weekDays.map((wd, idx) => (
                  <div
                    key={idx}
                    className={`text-center text-xs font-bold py-1 ${
                      idx === 0 ? "text-rose-500" : idx === 6 ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    {wd}
                  </div>
                ))}

                {/* Day Blocks */}
                {cells.map((cell, idx) => {
                  const isToday = cell.dateStr === "2026-06-15";
                  const nextWateringGroup = getWateringScheduleForDate(cell.dateStr);
                  const logWateredGroup = getWaterHistoryForDate(cell.dateStr);

                  return (
                    <div
                      key={idx}
                      className={`min-h-[72px] sm:min-h-[84px] p-1.5 rounded-lg border flex flex-col justify-between align-stretch transition-all ${
                        cell.dayNum === null ? "bg-stone-50 border-transparent text-transparent" : "bg-white border-gray-150"
                      } ${isToday ? "ring-2 ring-emerald-500 bg-emerald-50/15" : ""}`}
                    >
                      {cell.dayNum !== null ? (
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-xs font-extrabold ${
                              isToday
                                ? "bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                                : idx % 7 === 0
                                ? "text-rose-500 font-bold"
                                : idx % 7 === 6
                                ? "text-blue-500 font-bold"
                                : "text-stone-700"
                            }`}
                          >
                            {cell.dayNum}
                          </span>
                        </div>
                      ) : (
                        <div />
                      )}

                      {/* Scheduling elements on each day block */}
                      {cell.dayNum !== null && (
                        <div className="space-y-1 mt-1 text-[9px] overflow-hidden">
                          {/* 1. Watering Scheduled today */}
                          {nextWateringGroup.map((wp) => (
                            <div
                              key={wp.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`${wp.nickname}의 물주기를 완료 기록 처리하시겠습니까?`)) {
                                  onWaterPlant(wp.id, cell.dateStr);
                                }
                              }}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 px-1 py-0.5 rounded cursor-pointer truncate font-medium flex items-center gap-0.5"
                              title={`${wp.nickname} 물주기 예정 (클릭시 즉시 완료 로깅)`}
                            >
                              <Droplet className="w-2.5 h-2.5 fill-blue-500 text-transparent flex-shrink-0" />
                              <span className="truncate">{wp.nickname}</span>
                            </div>
                          ))}

                          {/* 2. Water Completed History logging */}
                          {logWateredGroup.map(({ plant, count }) => (
                            <div
                              key={plant.id}
                              className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-1 py-0.5 rounded truncate font-bold flex items-center gap-0.5"
                              title={`${plant.nickname} ${count}회 관수 완료`}
                            >
                              <Check className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0" />
                              <span className="truncate">{plant.nickname}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend bar */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-2 border-t border-[#bccbb9]/20 text-[10px] text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-blue-50 border border-blue-100" />
                  <span>급수 예정일 (클릭하여 로깅)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-100" />
                  <span>급수 완료 완료기기</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border border-emerald-500 bg-emerald-50/15" />
                  <span>오늘 기준일 (2026.06.15)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Detail Modal / Drawer representing selected plant */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 bg-[#111c2d]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
            {/* Header banner */}
            <div className="relative h-44 bg-stone-100">
              <img
                alt={selectedPlant.nickname}
                className="w-full h-full object-cover"
                src={selectedPlant.imageUrl}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="text-[10px] py-0.5 px-2 bg-emerald-600 rounded-full font-bold">
                    {selectedPlant.location}
                  </span>
                  <h3 className="font-display font-black text-xl">{selectedPlant.nickname}</h3>
                  <p className="text-xs text-gray-200">{selectedPlant.commonName} ({selectedPlant.speciesName})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlant(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-700 flex items-center justify-center text-sm font-bold shadow-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 space-y-6 max-h-[55vh] overflow-y-auto">
              {/* Quick Bio metadata parameters */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-2 border border-stone-100 bg-stone-50/50 rounded-xl">
                  <span className="block text-[10px] text-stone-500 font-bold">건강 척도</span>
                  <span className="text-sm font-extrabold text-emerald-800">{selectedPlant.healthScore}점</span>
                </div>
                <div className="p-2 border border-stone-100 bg-stone-50/50 rounded-xl">
                  <span className="block text-[10px] text-stone-500 font-bold">물주기 주기</span>
                  <span className="text-sm font-extrabold text-blue-600">{selectedPlant.wateringIntervalDays}일</span>
                </div>
                <div className="p-2 border border-stone-100 bg-stone-50/50 rounded-xl">
                  <span className="block text-[10px] text-stone-500 font-bold">조도 적성</span>
                  <span className="text-sm font-extrabold text-amber-600">{selectedPlant.lightScore}/100</span>
                </div>
                <div className="p-2 border border-stone-100 bg-stone-50/50 rounded-xl">
                  <span className="block text-[10px] text-stone-500 font-bold">적정 최소온도</span>
                  <span className="text-sm font-extrabold text-teal-600">{selectedPlant.tempMin}도</span>
                </div>
              </div>

              {/* Symptoms Intro */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-[#111c2d] flex items-center gap-1">
                  <Activity className="w-4 h-4 text-emerald-700" />
                  플랜트 케어 시노프시스
                </p>
                <p className="text-xs text-stone-600 leading-relaxed italic bg-emerald-50/10 p-3 rounded-lg border border-emerald-100/30">
                  "{selectedPlant.intro}"
                </p>
              </div>

              {/* Checklists for daily care */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#111c2d] flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  AI 권장 가꿈 미션체크
                </p>
                <div className="space-y-1.5">
                  {selectedPlant.actions.map((act, i) => (
                    <label key={i} className="flex gap-2.5 items-start text-xs text-stone-600">
                      <input type="checkbox" className="rounded text-[#006e2f] border-gray-300 w-3.5 h-3.5 mt-0.5 cursor-pointer" />
                      <span>{act}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Water History Logs */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-[#111c2d] flex items-center gap-1">
                  <Droplet className="w-4 h-4 text-blue-600" />
                  나의 관수 일별 히스토리 ({selectedPlant.wateringHistory.length}회)
                </p>
                
                {selectedPlant.wateringHistory.length === 0 ? (
                  <p className="text-[11px] text-stone-400 italic">아직 물주기를 실시하지 않았습니다.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedPlant.wateringHistory.map((date, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-150 rounded-md"
                      >
                        <Check className="w-3 h-3 text-blue-500" /> {date}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer triggers */}
            <div className="p-4 bg-stone-50 border-t border-stone-150 flex justify-between items-center gap-4">
              <button
                onClick={() => {
                  if (confirm(`${selectedPlant.nickname} 화분을 도감에서 완전히 삭제하시겠습니까?`)) {
                    onDeletePlant(selectedPlant.id);
                    setSelectedPlant(null);
                  }
                }}
                className="text-xs text-rose-500 hover:text-rose-700 underline font-medium cursor-pointer"
              >
                화분 분양(삭제)
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPlant(null)}
                  className="px-4 py-2 bg-white border border-stone-250 text-stone-700 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  닫기
                </button>
                <button
                  onClick={() => {
                    onWaterPlant(selectedPlant.id);
                    // refresh current modal
                    setSelectedPlant((prev) => prev ? {
                      ...prev,
                      lastWateredDate: new Date().toISOString().split("T")[0],
                      nextWateringDate: new Date(Date.now() + prev.wateringIntervalDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                      wateringHistory: [...prev.wateringHistory, new Date().toISOString().split("T")[0]]
                    } : null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 tracking-wide cursor-pointer shadow-sm"
                >
                  <Droplet className="w-3 h-3 fill-blue-50" />
                  오늘 물주기 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
