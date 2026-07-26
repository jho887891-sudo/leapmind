import { useState, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function VoicePlayButton({ text }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  const handlePlay = async () => {
    if (playing) {
      audioRef.current?.pause()
      setPlaying(false)
      return
    }

    try {
      const res = await fetch('/api/virtual-teacher/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceType: 'default' }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
        setPlaying(true)
      }
    } catch {
      // TTS 接口未就绪时 fallback 到 Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text.replace(/[$\\{}[\]()_^#|]/g, ''))
        utterance.rate = 0.9
        utterance.lang = 'zh-CN'
        utterance.onend = () => setPlaying(false)
        setPlaying(true)
        speechSynthesis.speak(utterance)
      }
    }
  }

  const handleStop = () => {
    audioRef.current?.pause()
    if ('speechSynthesis' in window) speechSynthesis.cancel()
    setPlaying(false)
  }

  return (
    <>
      <button
        onClick={playing ? handleStop : handlePlay}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          playing
            ? 'bg-purple-400/20 text-purple-300 border border-purple-400/30 animate-pulse'
            : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80 border border-white/10'
        }`}
      >
        {playing ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        {playing ? '停止朗读' : '语音朗读'}
      </button>
      <audio ref={audioRef} onEnded={() => setPlaying(false)} className="hidden" />
    </>
  )
}
