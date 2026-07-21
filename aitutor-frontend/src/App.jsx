import React, { useEffect, useState } from 'react';  
import GlobalStyles from './styles/GlobalStyles.jsx';
import LoginPage from './pages/LoginPage';
import LoginPage2 from './pages/LoginPage2.jsx';
import ProjectListPage from './pages/ProjectListPage';
import LecturePage from './pages/LecturePage';
import LecturePage2 from './pages/LecturePage2';
import TemHomePage from './pages/TemHomePage';
import ProfilePage from './pages/ProfilePage.jsx';
import TeacherAvatarPage from './pages/TeacherAvatarPage.jsx';
// M4 讲课流程 - 独立容器，通过 hash 路由触发，不污染主路由表
import M4LectureContainer from './pages/lecture/M4LectureContainer';
import { hasValidToken } from './utils/tokenManager';
import { checkAuth, logout } from './services/authService';

export default function App() {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);
    const [currentCourseId, setCurrentCourseId] = useState('');
    const [guestRoute, setGuestRoute] = useState('home'); // home | profile
    const [showProfile, setShowProfile] = useState(false);
    const [showTeacherAvatar, setShowTeacherAvatar] = useState(false);
    // M4 路由：通过 location.hash 触发，与主路由完全隔离
    const [m4Active, setM4Active] = useState(() => typeof window !== 'undefined' && window.location.hash === '#m4');

    useEffect(() => {
        const onHashChange = () => setM4Active(window.location.hash === '#m4');
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

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

    const handleLogout = () => {
        logout();
        setCurrentCourseId('');
        setIsAuthed(false);
        window.location.reload();
    };

    const handleLoginSuccess = (user) => {
        console.log('登录成功，用户信息:', user);
        setIsAuthed(true);
    };

    const handleOpenProfile = () => {
        setShowProfile(true);
    };

    // M4 入口/出口：浮动按钮设 hash，组件内部 onExit 清 hash
    const handleLaunchM4 = () => { window.location.hash = '#m4'; setM4Active(true); };
    const handleExitM4 = () => { window.location.hash = ''; setM4Active(false); };

    return (
        <div className={isAuthed ? "flex h-screen bg-slate-100 text-slate-800" : "w-full h-screen"}>
            <GlobalStyles />
            {m4Active && isAuthed ? (
                <M4LectureContainer onExit={handleExitM4} />
            ) : isChecking ? (
                <div className="m-auto text-slate-600">检查会话中…</div>
            ) : !isAuthed ? (
                guestRoute === 'profile' ? (
                    <ProfilePage onBack={() => setGuestRoute('home')} />
                ) : (
                    // 使用登录页面
                    <LoginPage2 onLoginSuccess={handleLoginSuccess} />
                )
            ) : currentCourseId ? (
                      <LecturePage2 courseId={currentCourseId} onBack={() => setCurrentCourseId('')} />
            ) : (
                showTeacherAvatar ? (
                    <TeacherAvatarPage onBack={() => setShowTeacherAvatar(false)} />
                ) : showProfile ? (
                    <ProfilePage onBack={() => setShowProfile(false)} />
                ) : (
                    <div className="relative w-full h-full">
                        <TemHomePage
                            onEnterProject={(courseId) => setCurrentCourseId(courseId)}
                            onOpenProfile={handleOpenProfile}
                            onOpenTeacherAvatar={() => setShowTeacherAvatar(true)}
                        />
                        {/* M4 讲课入口（浮动按钮，联调后可移除或整合到首页） */}
                        <button
                            onClick={handleLaunchM4}
                            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 active:scale-95 transition-all text-sm font-medium z-40"
                            title="AI 即时讲课"
                        >
                            <span className="text-lg">🎓</span>
                            AI 讲课
                        </button>
                    </div>
                )
            )}
        </div>
    );
}
