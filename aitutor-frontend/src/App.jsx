import React, { useEffect, useState } from 'react';  
import GlobalStyles from './styles/GlobalStyles.jsx';
import LoginPage from './pages/LoginPage';
import LoginPage2 from './pages/LoginPage2.jsx';
import ProjectListPage from './pages/ProjectListPage';
import LecturePage from './pages/LecturePage';
import LecturePage2 from './pages/LecturePage2';
import TemHomePage from './pages/TemHomePage';
import ProfilePage from './pages/ProfilePage.jsx';
import PhotoQAPage from './pages/m2/PhotoQAPage';
import ExplainPage from './pages/m2/ExplainPage';
import ExplainHistoryPage from './pages/m2/ExplainHistoryPage';
import LearningProfilePage from './pages/LearningProfilePage.jsx';
import KnowledgePointDetailPage from './pages/KnowledgePointDetailPage.jsx';
import { hasValidToken } from './utils/tokenManager';
import { checkAuth } from './services/authService';

export default function App() {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);
    const [currentCourseId, setCurrentCourseId] = useState('');
    const [guestRoute, setGuestRoute] = useState('home'); // home | profile
    const [showProfile, setShowProfile] = useState(false);
    const [m2Page, setM2Page] = useState(null); // null | 'photo-qa' | 'explain' | 'explain-history'
    const [m2Params, setM2Params] = useState({}); // 传递给 M2 页面的参数
    const [learningProfileView, setLearningProfileView] = useState(null); // null | overview | detail
    const [selectedKnowledgePointId, setSelectedKnowledgePointId] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                // 先检查本地是否有有效的 token
                if (!hasValidToken()) {
                    setIsAuthed(false);
                    setIsChecking(false);
                    return;
                }

                // 验证 token 是否真的有效（调用后端接口）
                const isValid = await checkAuth();
                setIsAuthed(isValid);
            } catch (error) {
                console.error('会话检查失败:', error);
                setIsAuthed(false);
            } finally {
                setIsChecking(false);
            }
        };
        checkSession();
    }, []);

    const handleLoginSuccess = (user) => {
        console.log('登录成功，用户信息:', user);
        setIsAuthed(true);
    };

    const handleOpenProfile = () => {
        setShowProfile(true);
    };

    const handleOpenLearningProfile = () => {
        setSelectedKnowledgePointId(null);
        setLearningProfileView('overview');
    };

    const handleOpenKnowledgePoint = (knowledgePoint) => {
        const id = typeof knowledgePoint === 'object' ? knowledgePoint?.id : knowledgePoint;
        if (!id) return;
        setSelectedKnowledgePointId(id);
        setLearningProfileView('detail');
    };

    return (
        <div className={isAuthed ? "flex h-screen bg-slate-100 text-slate-800" : "w-full h-screen"}>
            <GlobalStyles />
            {isChecking ? (
                <div className="m-auto text-slate-600">检查会话中…</div>
            ) : !isAuthed ? (
                guestRoute === 'profile' ? (
                    <ProfilePage onBack={() => setGuestRoute('home')} />
                ) : (
                    <div className="relative w-full h-full">
                        <LoginPage2 onLoginSuccess={handleLoginSuccess} />
                        {import.meta.env.DEV && (
                            <button
                                onClick={() => { setIsAuthed(true); console.log('开发模式：已跳过登录') }}
                                className="fixed top-4 right-4 z-50 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 shadow"
                            >
                                🚀 跳过登录（开发模式）
                            </button>
                        )}
                    </div>
                )
            ) : m2Page === 'photo-qa' ? (
                <PhotoQAPage onBack={() => setM2Page(null)} onExplain={(params) => { setM2Params(params); setM2Page('explain'); }} />
            ) : m2Page === 'explain' ? (
                <ExplainPage onBack={() => { const from = m2Params.from; setM2Params(from === 'explain-history' ? { from: 'explain' } : {}); setM2Page(from === 'explain-history' ? 'explain-history' : null); }} wrongQuestionId={m2Params.wrongQuestionId} replayId={m2Params.replayId} onExplainHistory={() => { setM2Params({ from: 'explain' }); setM2Page('explain-history'); }} />
            ) : m2Page === 'explain-history' ? (
                <ExplainHistoryPage onBack={m2Params.from === 'explain' ? () => { setM2Params({}); setM2Page('explain'); } : () => setM2Page(null)} onReplay={(id) => { setM2Params({ replayId: id, from: 'explain-history' }); setM2Page('explain'); }} />
            ) : currentCourseId ? (
                      <LecturePage2 courseId={currentCourseId} onBack={() => setCurrentCourseId('')} />
            ) : learningProfileView === 'detail' ? (
                <KnowledgePointDetailPage
                    knowledgePointId={selectedKnowledgePointId}
                    onBack={() => setLearningProfileView('overview')}
                    onHome={() => setLearningProfileView('overview')}
                />
            ) : learningProfileView === 'overview' ? (
                <LearningProfilePage
                    onBack={() => setLearningProfileView(null)}
                    onOpenKnowledgePoint={handleOpenKnowledgePoint}
                />
            ) : (
                showProfile ? (
                    <ProfilePage onBack={() => setShowProfile(false)} />
                ) : (
                    <TemHomePage 
                        onEnterProject={(courseId) => setCurrentCourseId(courseId)}
                        onOpenProfile={handleOpenProfile}
                        onM2PhotoQa={() => setM2Page('photo-qa')}
                        onM2Explain={() => { setM2Params({}); setM2Page('explain'); }}
                        onOpenLearningProfile={handleOpenLearningProfile}
                    />
                )
            )}
        </div>
    );
}
