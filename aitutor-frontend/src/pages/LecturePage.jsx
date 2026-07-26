// 实际项目中，这里会导入各个子组件。为了简化，我们暂时将它们都放在一个文件里。
import React, { useState } from 'react';
import Header from '../components/common/Header';
import SlideViewer from '../components/lecture/SlideViewer';
import TeacherPanel from '../components/teacher/TeacherPanel';
import { ChatPanel } from '../components/chat';
import { getUserInfo } from '../utils/tokenManager';

const LecturePage = ({ projectId, courseId: courseIdProp }) => {
    const courseId = courseIdProp ?? projectId;
    const [chatOpen, setChatOpen] = useState(false);
    const userInfo = getUserInfo();

    return (
        <div className="w-full flex h-full">
             <div className="w-3/4 flex flex-col bg-white overflow-hidden">
                  <Header lessonSubtitle={courseId ? `课程 ${courseId}` : '在线课堂'} />
                  <SlideViewer courseId={courseId} projectId={projectId} />
             </div>
            <div className="w-1/4 flex flex-col">
                <TeacherPanel />
                <button
                    onClick={() => setChatOpen((v) => !v)}
                    className="m-2 p-2 bg-violet-50 text-violet-600 rounded-xl text-sm font-medium hover:bg-violet-100"
                >
                    💬 问 AI
                </button>
                {chatOpen && (
                    <div className="flex-1">
                        <ChatPanel
                            sceneType="teaching"
                            context={{ lectureId: courseId, slide: 1 }}
                            userId={userInfo?.id}
                            visible={chatOpen}
                            onClose={() => setChatOpen(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default LecturePage;