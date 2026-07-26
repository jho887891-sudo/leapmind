/**
 * M4 讲课演示页 (4.2.3) —— 核心页面
 * 
 * 桌面端：三栏布局（幻灯片 60% | 追问面板 20% | 虚拟教师 20%）
 * 移动端：全屏幻灯片 + 底部 Tab 切换（幻灯片 / 追问 / 教师）
 * 
 * 复用现有组件：
 *  - SlideViewer（幻灯片渲染 + 翻页动画 + 音频 + 字幕）
 *  - TeacherPanel（虚拟教师形象 + 对话）
 * 
 * 新增：
 *  - ChatPanelPlaceholder（追问面板占位，联调时替换为 M7 ChatPanel）
 *  - 讲课结束时的总结面板
 *  - "做配套练习"按钮（跳转 M1 做题）
 */

import React, { useState, useCallback } from 'react';
import Header from '../../components/common/Header';
import { SlideRenderer } from '../../components/lecture';
import TeacherPanel from '../../components/teacher/TeacherPanel';
import ChatPanelPlaceholder from '../../components/lecture/ChatPanelPlaceholder';
import { Flag, BookOpen, MessageCircle, Monitor, User } from 'lucide-react';

const TABS = [
  { key: 'slides', label: '幻灯片', icon: Monitor },
  { key: 'chat', label: '追问', icon: MessageCircle },
  { key: 'teacher', label: '老师', icon: User },
];

const LecturePresentPage = ({ lectureData, userId = 1, onBack, onFinish }) => {
  const { lectureId, title = '在线课堂', slides: mockSlides } = lectureData || {};
  const hasSlides = Array.isArray(mockSlides) && mockSlides.length > 0;
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showEndPanel, setShowEndPanel] = useState(false);
  const [mobileTab, setMobileTab] = useState('slides');

  const handleSlideChange = useCallback((pageNum) => {
    setCurrentSlide(pageNum);
  }, []);

  const handleEndLecture = () => setShowEndPanel(true);

  const handleGoPractice = () => {
    onFinish?.({ lectureId, knowledgePoints: lectureData?.knowledgePoints });
  };

  const bgGradient = {
    backgroundImage: "linear-gradient(135deg, #861FCE 0%, #861FCE 16%, #731CCD 16%, #731CCD 32%, #6B1CCF 32%, #6B1CCF 48%, #631DCE 48%, #631DCE 64%, #5A1BCE 64%, #5A1BCE 80%, rgb(86,43,205) 80%, rgb(47,8,154) 100%)",
  };

  // ─── 结束面板（共用） ──────────────────────────
  const EndPanel = () => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <span className="text-2xl sm:text-3xl">🎉</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">讲课结束！</h2>
        <p className="text-sm sm:text-base text-slate-500 mb-5 sm:mb-6">
          你已完成「{title}」的学习，来检验一下掌握情况吧。
        </p>
        <div className="space-y-2.5 sm:space-y-3">
          <button
            onClick={handleGoPractice}
            className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors text-sm sm:text-base"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            做配套练习
          </button>
          <button
            onClick={() => setShowEndPanel(false)}
            className="w-full py-2 sm:py-2.5 text-slate-500 text-sm hover:text-slate-700 transition-colors"
          >
            继续讲课
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row bg-gradient-to-br from-purple-700 via-purple-600 via-blue-600 to-blue-700" style={bgGradient}>
      {/* ═══════════════ 桌面端：左右两栏布局 ═══════════════ */}
      {/* 左侧：幻灯片区 (75%) */}
      <div className="hidden lg:flex lg:w-[75%] flex-col overflow-hidden">
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <Header lessonSubtitle={title} dark={true} onBack={onBack} />
        </div>
        {hasSlides ? (
          <SlideRenderer
            slides={mockSlides}
            initialPage={currentSlide}
            mode="play"
            showNavigator={true}
            showProgress={true}
            onPageChange={handleSlideChange}
            className="flex-1 min-h-0 bg-transparent"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/40">
            暂无幻灯片数据
          </div>
        )}
      </div>

      {/* 右侧：追问对话面板 (25%) - 含输入框 */}
      <div className="hidden lg:flex lg:w-[25%] flex-col p-3 gap-3">
        <div className="flex-1 min-h-0">
          <ChatPanelPlaceholder sceneType="teaching" context={{ lectureId, slide: currentSlide }} userId={userId} />
        </div>
        <button
          onClick={handleEndLecture}
          className="flex-shrink-0 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/90 hover:bg-red-500 text-white text-sm font-medium shadow-lg transition-colors"
        >
          <Flag className="w-4 h-4" />结束讲课
        </button>
      </div>

      {/* ═══════════════ 移动端：全屏 + 底部 Tab ═══════════════ */}
      {/* 幻灯片视图 */}
      <div className={`lg:hidden flex-1 flex flex-col overflow-hidden ${mobileTab !== 'slides' ? 'hidden' : ''}`}>
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 flex-shrink-0">
          <Header lessonSubtitle={title} dark={true} onBack={onBack} />
        </div>
        {hasSlides ? (
          <SlideRenderer
            slides={mockSlides}
            initialPage={currentSlide}
            mode="play"
            showNavigator={true}
            showProgress={true}
            onPageChange={handleSlideChange}
            className="flex-1 min-h-0 bg-transparent"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/40">
            暂无幻灯片数据
          </div>
        )}
        {/* 移动端结束按钮（幻灯片页底部） */}
        <div className="flex-shrink-0 px-4 py-2 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <button
            onClick={handleEndLecture}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 text-white/70 text-sm active:bg-red-500/30 active:text-red-200 transition-all"
          >
            <Flag className="w-4 h-4" />结束讲课
          </button>
        </div>
      </div>

      {/* 追问面板视图 */}
      <div className={`lg:hidden flex-1 flex flex-col ${mobileTab !== 'chat' ? 'hidden' : ''}`}>
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 flex-shrink-0">
          <Header lessonSubtitle={title} dark={true} onBack={onBack} />
        </div>
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-white/80 text-sm font-medium">💬 课堂追问</p>
            <p className="text-white/40 text-xs">当前第 {currentSlide} 页</p>
          </div>
        </div>
        <div className="flex-1 p-3 overflow-hidden">
          <ChatPanelPlaceholder sceneType="teaching" context={{ lectureId, slide: currentSlide }} userId={userId} />
        </div>
      </div>

      {/* 教师视图 */}
      <div className={`lg:hidden flex-1 flex flex-col ${mobileTab !== 'teacher' ? 'hidden' : ''}`}>
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 flex-shrink-0">
          <Header lessonSubtitle={title} dark={true} onBack={onBack} />
        </div>
        <div className="flex-1 overflow-hidden [&>aside]:w-full [&>aside]:h-full">
          <TeacherPanel dark={true} />
        </div>
      </div>

      {/* 移动端底部 Tab 栏 */}
      <div className="lg:hidden flex-shrink-0 flex bg-black/30 backdrop-blur-md border-t border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMobileTab(tab.key)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
              mobileTab === tab.key
                ? 'text-white'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 讲课结束面板 */}
      {showEndPanel && <EndPanel />}
    </div>
  );
};

export default LecturePresentPage;
