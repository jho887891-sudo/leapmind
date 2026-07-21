/**
 * M4 即时讲课 - 路由容器
 *
 * 设计目的：把 M4 4 个页面（Create / Waiting / Present / History）的状态
 * 和路由**完全封装**在这个独立组件里。App.jsx 只需要一行 hash 触发：
 *   <M4LectureContainer hash={window.location.hash} onExit={onExit} />
 *
 * 这样 M4 组其他成员修改 App.jsx 不会和本组件冲突。
 *
 * 触发方式：
 *   - 浮动按钮点击 → 设置 hash → 组件 mount
 *   - 用户返回 → 清空 hash → 组件 unmount
 *
 * 状态机：
 *   null → create → waiting → present
 *                ↑                 ↓
 *                ←── history ←─────┘
 */
import React, { useState, useCallback } from 'react';
import LectureCreatePage from './LectureCreatePage';
import LectureWaitingPage from './LectureWaitingPage';
import LecturePresentPage from './LecturePresentPage';
import LectureHistoryPage from './LectureHistoryPage';

export default function M4LectureContainer({ onExit }) {
  const [route, setRoute] = useState('create'); // create | waiting | present | history
  const [params, setParams] = useState(null);
  const [result, setResult] = useState(null);

  const handleStartGeneration = useCallback((p) => {
    setParams(p);
    setRoute('waiting');
  }, []);

  const handleGenerationComplete = useCallback((r) => {
    setResult(r);
    setRoute('present');
  }, []);

  const handleViewHistory = useCallback(() => setRoute('history'), []);
  const handleBackFromLecture = useCallback(() => {
    setRoute('create');
    setParams(null);
    setResult(null);
  }, []);
  const handleLectureFinish = useCallback((info) => {
    console.log('讲课完成:', info);
    // TODO-REAL: 跳转 M1 做题（带知识点参数）
    onExit?.();
  }, [onExit]);

  if (route === 'create') {
    return (
      <LectureCreatePage
        userId={1}
        onStartGeneration={handleStartGeneration}
        onViewHistory={handleViewHistory}
        onExit={onExit}
      />
    );
  }
  if (route === 'waiting') {
    return (
      <LectureWaitingPage
        params={params}
        onComplete={handleGenerationComplete}
        onBack={handleBackFromLecture}
      />
    );
  }
  if (route === 'present') {
    return (
      <LecturePresentPage
        lectureData={result}
        userId={1}
        onBack={handleBackFromLecture}
        onFinish={handleLectureFinish}
      />
    );
  }
  if (route === 'history') {
    return (
      <LectureHistoryPage
        userId={1}
        onSelectLecture={(item) => {
          setResult({ lectureId: item.lectureId, title: item.title, slides: item.slides || item.previewSlides });
          setRoute('present');
        }}
        onBack={handleBackFromLecture}
      />
    );
  }
  return null;
}
