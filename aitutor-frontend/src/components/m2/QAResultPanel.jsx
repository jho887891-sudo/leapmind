import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Sparkles, ThumbsUp, HelpCircle } from 'lucide-react'
import { mockPhotoQA } from '../../services/m2'

export default function QAResultPanel({ ocrRecordId, question }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setContent('')
    setDone(false)

    await mockPhotoQA(
      ocrRecordId,
      question,
      (chunk) => {
        if (chunk.type === 'done') {
          setDone(true)
          setLoading(false)
        } else {
          setContent(prev => prev + chunk.content + '\n\n')
        }
      },
      (err) => {
        console.error('SSE error:', err)
        setLoading(false)
      }
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
      {/* 按钮区域 */}
      {!loading && !done && (
        <button
          onClick={handleGenerate}
          className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group"
        >
          <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
          开始答疑
        </button>
      )}

      {/* 加载动画 */}
      {loading && !done && (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto relative mb-4">
            <div className="w-12 h-12 border-4 border-purple-300/30 border-t-purple-400 rounded-full animate-spin" />
          </div>
          <p className="text-purple-200 text-sm font-medium">AI 思考中，请稍候...</p>
          <div className="mt-3 flex justify-center gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 bg-purple-300/50 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* 内容展示 */}
      {content && (
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-medium text-white">AI 解答</span>
            {!done && (
              <span className="text-xs text-purple-200/50 animate-pulse">生成中...</span>
            )}
          </div>
          <div className="bg-white/5 rounded-xl p-4 prose prose-sm max-w-none text-white/90">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                strong: ({ children }) => <span className="text-purple-300 font-bold">{children}</span>,
                p: ({ children }) => <p className="text-white/80 leading-relaxed mb-2">{children}</p>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* 反馈按钮 */}
      {done && (
        <div className="mt-4 flex gap-3 justify-center">
          <button className="px-4 py-2 bg-green-500/20 text-green-300 rounded-xl text-sm font-medium hover:bg-green-500/30 transition-all flex items-center gap-1.5 border border-green-400/20">
            <ThumbsUp className="w-4 h-4" /> 懂了
          </button>
          <button className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-xl text-sm font-medium hover:bg-yellow-500/30 transition-all flex items-center gap-1.5 border border-yellow-400/20">
            <HelpCircle className="w-4 h-4" /> 还有疑问
          </button>
        </div>
      )}
    </div>
  )
}
