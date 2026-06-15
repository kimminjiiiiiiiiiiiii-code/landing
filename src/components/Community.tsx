import React, { useState } from "react";
import { MessageSquare, Heart, Share2, Award, Users, Bot, Sparkles, Send, Check } from "lucide-react";
import { CommunityPost, Comment } from "../types";

interface CommunityProps {
  posts: CommunityPost[];
  onAddPost: (content: string, plantName?: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
}

export default function Community({ posts, onAddPost, onLikePost, onAddComment }: CommunityProps) {
  const [newPostText, setNewPostText] = useState("");
  const [selectedPlantName, setSelectedPlantName] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [activeTag, setActiveTag] = useState("전체");

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    onAddPost(newPostText, selectedPlantName || undefined);
    setNewPostText("");
    setSelectedPlantName("");
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, postId: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(postId);
    }
  };

  const tags = ["전체", "Q&A 질문방", "성장기록", "초보팁", "인테리어"];

  const filteredPosts = activeTag === "전체"
    ? posts
    : posts.filter((post) => post.tags.includes(activeTag) || (activeTag === "Q&A 질문방" && post.tags.some(t => t.includes("Q&A") || t.includes("질문"))));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Community Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4 text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border bg-stone-50">
            <img
              alt="Roots Plant Lovers Logo"
              className="w-full h-full object-containScale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-IoimTboCwBF7eqvAkvbHqAGWn5XAfRH_ZTtsHdf8XDqNwHwMSuHMwTo-7aVY6bzOKUxCWNATs4PmjgRaUH_HH6YYi-LaKUTTjmHh7G5vYH3Vjwngehq8O80WuTxm5J_7U9vDHXLqQ3SG6e2mgUpOCQciEmjnniFqKgxHBGaW2rjO_lTJa5N9lSH2ZHvzTEpFjXd6bl0Pu1DnUMwzb-ScLBKE6yusjCT67K4fWjsNmeZgurnmmdpLpJsFXVTjap6OeOBunCt-TShY"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#006e2f]/10 text-[#006e2f] text-[10px] font-black px-2 py-0.5 rounded-full font-display">
                Plant Lovers Union
              </span>
              <h2 className="text-lg md:text-xl font-extrabold text-[#111c2d] tracking-tight">Roots 새싹 식집사 커뮤니티</h2>
            </div>
            <p className="text-[#3d4a3d] text-xs md:text-sm">
              다른 초보 식집사 및 전문 가드너 동반자들과 일상의 물주기 희열, 힐링 경험을 나누어 보세요.
            </p>
          </div>
        </div>

        <div className="flex gap-2 text-center bg-[#f0f3ff] px-4 py-2 rounded-xl text-xs font-bold text-[#006e2f] border border-blue-100">
          <Users className="w-4 h-4" />
          <span>실시간 364명 온라인 케어 중</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Tag selector & Post Form (ColSpan: 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Post submission form box */}
          <form
            onSubmit={handlePostSubmit}
            className="bg-white rounded-2xl border border-gray-150 p-5 md:p-6 shadow-xs space-y-4"
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                나
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="오늘 어떤 식물 친구가 기쁜 새순을 틔웠나요? 물주기 노하우나 시들어 가는 식물에 대한 질문을 여기에 마음껏 나누어 보세요..."
                  rows={3}
                  className="w-full text-xs md:text-sm p-3 rounded-xl border border-gray-150 focus:outline-[#006e2f] bg-[#f9f9ff]/50 placeholder-gray-400"
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#3d4a3d] font-bold">집중할 식물지정:</span>
                    <input
                      type="text"
                      value={selectedPlantName}
                      onChange={(e) => setSelectedPlantName(e.target.value)}
                      placeholder="예) 몬이, 산세 (생략가능)"
                      className="text-xs p-1 px-2 border rounded-md border-gray-200 outline-none max-w-[130px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#006e2f] hover:bg-[#005321] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-transform cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    다이어리 리폿 등록
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Tag filter ribbon */}
          <div className="flex flex-wrap gap-2 pb-1">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  activeTag === tag
                    ? "bg-[#006e2f] text-white border-transparent"
                    : "bg-white text-stone-600 border-gray-150 hover:border-emerald-600/30"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4"
              >
                {/* Author row */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-50 border">
                      <img
                        alt={post.authorName}
                        className="w-full h-full object-cover"
                        src={post.authorAvatar}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#111c2d] flex items-center gap-1.5">
                        {post.authorName}
                        {post.authorName.includes("양가드너") && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Award className="w-2.5 h-2.5" /> 최강 마스터
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-stone-400 font-mono">{post.timestamp}</p>
                    </div>
                  </div>

                  {post.plantName && (
                    <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border-emerald-100 border px-2.5 py-1 rounded-lg">
                      🌿 {post.plantName} ({post.plantStatus || "집중돌봄"})
                    </span>
                  )}
                </div>

                {/* Content body */}
                <div className="text-xs md:text-sm text-[#3d4a3d] leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>

                {/* Tags preview inside Post */}
                <div className="flex gap-1.5">
                  {post.tags.map((tg, i) => (
                    <span
                      key={i}
                      onClick={() => setActiveTag(tg)}
                      className="text-[10px] font-bold text-[#006e2f] hover:underline cursor-pointer"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>

                {/* Optional attached Post image */}
                {post.imageUrl && (
                  <div className="rounded-xl overflow-hidden max-h-80 border bg-stone-50">
                    <img
                      alt="첨부 이미지"
                      className="w-full h-full object-cover"
                      src={post.imageUrl}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Action footer (Likes, Comments Count) */}
                <div className="flex items-center justify-between border-t border-b border-[#bccbb9]/10 py-2.5 text-xs text-stone-500 font-semibold px-1">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                      post.likedByUser ? "text-rose-500 font-bold" : "hover:text-rose-500"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByUser ? "fill-rose-500 text-rose-500" : ""}`} />
                    <span>좋아요 {post.likes}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-stone-400">
                    <MessageSquare className="w-4 h-4 text-stone-400" />
                    <span>댓글 {post.comments.length}개</span>
                  </div>
                </div>

                {/* Comments List render */}
                <div className="space-y-3 pt-1">
                  {post.comments.map((comment) => {
                    const isAiDoctor = comment.authorName.includes("AI 식물주치의");
                    return (
                      <div
                        key={comment.id}
                        className={`flex gap-3 text-xs leading-relaxed p-2.5 rounded-xl border ${
                          isAiDoctor
                            ? "bg-[#f0f3ff] border-blue-150 shadow-xs"
                            : "bg-stone-50/50 border-stone-100"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-50 border flex-shrink-0 flex items-center justify-center">
                          {isAiDoctor ? (
                            <div className="w-full h-full bg-[#006e2f] text-white flex items-center justify-center">
                              <Bot className="w-4.5 h-4.5 animate-pulse" />
                            </div>
                          ) : (
                            <img
                              alt={comment.authorName}
                              className="w-full h-full object-cover"
                              src={comment.authorAvatar}
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <h5 className="font-bold text-[#111c2d] flex items-center gap-1">
                              {comment.authorName}
                              {isAiDoctor && (
                                <span className="bg-[#006e2f] text-white px-1.5 py-0.5 rounded text-[8px] font-extrabold flex items-center gap-0.5 animate-pulse">
                                  <Sparkles className="w-2 h-2 fill-white text-transparent" /> SYSTEM
                                </span>
                              )}
                            </h5>
                            <span className="text-[9px] text-stone-400 font-mono">{comment.timestamp}</span>
                          </div>
                          <p className="text-stone-700 whitespace-pre-line text-[11px] md:text-xs">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Comment Input field */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    onKeyDown={(e) => handleKeyDown(e, post.id)}
                    placeholder="여기에 따뜻한 소통이나 격려의 조언을 한마디 더해 주세요 (엔터 피드 등록)..."
                    className="flex-1 text-xs px-3 py-2 border rounded-xl outline-none focus:border-[#006e2f] bg-[#f9f9ff]/50"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="bg-[#006e2f] hover:bg-emerald-950 text-white px-3 py-2 rounded-xl font-bold text-xs cursor-pointer flex justify-center items-center"
                  >
                    댓글등록
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Info Panel (ColSpan: 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Automatic AI Doctor intro */}
          <div className="bg-gradient-to-br from-[#f0f3ff] to-[#e7eeff] p-5 rounded-2xl border border-blue-150 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#006e2f] text-white flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-black text-[#111c2d] text-sm flex items-center gap-1">
                  실시간 AI 원예 주치의 봇
                </h4>
                <p className="text-[10px] text-[#3d4a3d] font-bold">24시간 자동 문진 응답 대기</p>
              </div>
            </div>
            
            <p className="text-[#3d4a3d] text-xs leading-relaxed">
              자신의 식물 사진이나 질병 이력(예: "잎 끝이 타들어가")을 포함해 글을 쓰시면 인공지능이 즉시 다정하고 명쾌한 구제 처방전을 댓글로 달아 동반자가 되어 줍니다.
            </p>

            <div className="space-y-2 text-[11px] font-bold text-blue-800">
              <div className="flex items-center gap-1 bg-white p-2 rounded-lg border border-blue-150">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>#질문방 태그 입력시 자동 진단 작동</span>
              </div>
              <div className="flex items-center gap-1 bg-white p-2 rounded-lg border border-blue-150">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>질병 유형별 친환경 응급 요령 수립</span>
              </div>
            </div>
          </div>

          {/* Plant parent mission lists */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
            <h4 className="font-display font-bold text-sm text-[#111c2d]">오늘의 식집사 미션 달성도</h4>
            
            <div className="space-y-3">
              <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#006e2f]" />
                <span className="line-through text-stone-400 font-medium">아침 실내 온도 환기시키기 (거실창 10분)</span>
              </label>
              <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer">
                <input type="checkbox" className="rounded text-[#006e2f]" />
                <span className="font-medium">스파티필룸 이파리 분무 스프레이 실시</span>
              </label>
              <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer">
                <input type="checkbox" className="rounded text-[#006e2f]" />
                <span className="font-medium">몬스테라 화분 90도 돌려받아 고르게 빛쐬기</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
