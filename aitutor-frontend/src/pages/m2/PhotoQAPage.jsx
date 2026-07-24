import { useState } from 'react'
import { ArrowLeft, Camera, Upload, Sparkles, RefreshCw, CheckCircle, HelpCircle } from 'lucide-react'
import CameraCapture from '../../components/m2/CameraCapture'
import ImageUploader from '../../components/m2/ImageUploader'
import OCRResultCard from '../../components/m2/OCRResultCard'
import QAResultPanel from '../../components/m2/QAResultPanel'
import { mockRecognizeQuestion } from '../../services/m2'

export default function PhotoQAPage({ onBack }) {
  const [ocrResult, setOcrResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState(null)
  const [showCamera, setShowCamera] = useState(false)

  const handleImage = async (image) => {
    setLoading(true)
    setError(null)
    setImagePreview(URL.createObjectURL(image))
    setShowCamera(false)
    try {
      const result = await mockRecognizeQuestion(image)
      setOcrResult(result)
    } catch (err) {
      setError('OCR 识别失败，请重试')
    }
    setLoading(false)
  }

  const handleReset = () => {
    setOcrResult(null)
    setImagePreview(null)
    setError(null)
  }

  return (
    <div className="min-h-screen w-full" style={{backgroundImage: "linear-gradient(135deg, #861FCE 0%, #861FCE 16%, #731CCD 16%, #731CCD 32%, #6B1CCF 32%, #6B1CCF 48%, #631DCE 48%, #631DCE 64%, #5A1BCE 64%, #5A1BCE 80%, rgb(86, 43, 205) 80%, rgb(47, 8, 154) 100%)"}}>
      {/* 顶部导航 */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-purple-400/20">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">返回</span>
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-200" />
          <h1 className="text-lg font-bold text-white">拍照答疑</h1>
        </div>
        <div className="w-16" />
      </header>

      {/* 主内容 */}
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {error && (
          <div className="mb-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-xl flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button onClick={() => setError(null)} className="text-red-200 hover:text-white text-sm underline">关闭</button>
          </div>
        )}

        {!ocrResult ? (
          <>
            {/* 顶部装饰卡片 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 text-center border border-white/10">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-pink-400 via-purple-300 to-orange-300 rounded-2xl flex items-center justify-center shadow-lg">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">拍照搜题</h2>
              <p className="text-sm text-purple-200/70">拍摄或上传题目图片，AI 自动识别并生成详细解答</p>
            </div>

            {/* 图片预览 */}
            {imagePreview && (
              <div className="mb-4 relative rounded-2xl overflow-hidden shadow-xl border border-white/10">
                <img src={imagePreview} alt="preview" className="w-full max-h-72 object-contain bg-black/20" />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 选择区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowCamera(true)}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <p className="text-white font-semibold">拍照</p>
                <p className="text-xs text-purple-200/60 mt-1">使用摄像头拍摄题目</p>
              </button>

              <ImageUploader onUpload={handleImage} />
            </div>

            {/* 摄像头区域 */}
            {showCamera && (
              <div className="mt-4 animate-fadeIn">
                <CameraCapture onCapture={handleImage} />
              </div>
            )}

            {/* 加载状态 */}
            {loading && (
              <div className="mt-8 text-center">
                <div className="w-12 h-12 mx-auto relative">
                  <div className="w-12 h-12 border-4 border-purple-300/30 border-t-purple-400 rounded-full animate-spin" />
                </div>
                <p className="mt-3 text-purple-200 text-sm font-medium">AI 正在识别题目...</p>
                <div className="mt-2 flex justify-center gap-1.5">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 bg-purple-300/50 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {/* 快速提示 */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-purple-300 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-200">使用提示</p>
                  <ul className="mt-1 text-xs text-purple-200/60 space-y-1">
                    <li>• 确保题目图片清晰、光线充足</li>
                    <li>• 支持印刷体和手写体混合识别</li>
                    <li>• 支持数学公式（勾股定理、三角函数等）</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 识别成功动画 */}
            <div className="bg-green-500/10 backdrop-blur-sm border border-green-400/20 rounded-2xl p-4 mb-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-300">识别成功</p>
                <p className="text-xs text-green-200/60">置信度 {(ocrResult.confidence * 100).toFixed(0)}%</p>
              </div>
              <button onClick={handleReset} className="ml-auto flex items-center gap-1.5 text-xs text-purple-200/70 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                重拍
              </button>
            </div>

            <OCRResultCard result={ocrResult} onEdit={(text) => setOcrResult({
              ...ocrResult,
              structuredQuestion: { ...ocrResult.structuredQuestion, stem: text }
            })} />

            <QAResultPanel ocrRecordId={ocrResult.ocrRecordId} question={ocrResult.structuredQuestion} />
          </>
        )}
      </div>
    </div>
  )
}
