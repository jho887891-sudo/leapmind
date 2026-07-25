import { useState } from 'react'
import { Send, MessageCircle, X } from 'lucide-react'

export default function AskMoreButton({ questionContext }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)

    // Mock AI 回答
    await new Promise(r => setTimeout(r, 1000))
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '这是个很好的问题！让我们进一步分析一下...（M7 对话接口对接后将启用真实回答）'
    }])
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm text-white/70 hover:bg-white/20 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          还有疑问？点击追问
        </button>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <span className="text-sm font-medium text-white/80 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-purple-300" />
              追问
            </span>
            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white/70 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {messages.length > 0 && (
            <div className="px-4 py-3 max-h-40 overflow-y-auto space-y-2">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 px-3 py-2 rounded-xl">
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-2 border-t border-white/10">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-400/50"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center disabled:opacity-40 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
