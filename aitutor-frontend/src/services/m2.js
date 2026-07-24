import { post as apiPost, get as apiGet } from './api'

/**
 * OCR 识别题目（真实接口）
 * 对接人：王圳 - POST /api/ocr/recognize-question
 */
export async function recognizeQuestion(image, subject) {
  const formData = new FormData()
  formData.append('image', image)
  if (subject) formData.append('subject', subject)
  const res = await fetch('/api/ocr/recognize-question', { method: 'POST', body: formData })
  return res.json()
}

/**
 * OCR 识别题目（Mock 数据，接口未就绪时使用）
 */
export async function mockRecognizeQuestion(image, subject) {
  await new Promise(r => setTimeout(r, 1500))
  return {
    ocrRecordId: 501,
    imageUrl: URL.createObjectURL(image),
    recognizedText: '在直角三角形ABC中，∠C=90°，AC=3，BC=4，则AB=？ A. 5 B. 6 C. 7 D. 8',
    structuredQuestion: {
      stem: '在直角三角形ABC中，∠C=90°，AC=3，BC=4，则AB=？',
      options: ['5', '6', '7', '8'],
      type: 'single_choice',
      subject: subject || 'math'
    },
    confidence: 0.95
  }
}

/**
 * 拍照答疑（SSE 流式，真实接口）
 * 对接人：王圳/孔维诚 - POST /api/explain/photo-qa
 */
export async function photoQA(ocrRecordId, question, onMessage, onError) {
  try {
    const res = await fetch('/api/explain/photo-qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ocrRecordId, question })
    })
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            onMessage(data)
          } catch { /* skip invalid JSON */ }
        }
      }
    }
  } catch (err) {
    onError?.(err)
  }
}

/**
 * 拍照答疑（Mock 流式数据）
 */
export async function mockPhotoQA(ocrRecordId, question, onMessage, onError) {
  const mockChunks = [
    { type: 'answer', content: '正确答案是 **5**（选项A）\n\n' },
    { type: 'step', content: '**第一步：识别题型**\n这是一道直角三角形求斜边长的题目。' },
    { type: 'step', content: '**第二步：套用公式**\n根据勾股定理：$a^2 + b^2 = c^2$' },
    { type: 'step', content: '**第三步：代入计算**\n$3^2 + 4^2 = 9 + 16 = 25$，$c = \\sqrt{25} = 5$' },
    { type: 'knowledge', content: '涉及知识点：勾股定理、平方根运算' },
    { type: 'done', content: '', contentId: 999 }
  ]

  for (const chunk of mockChunks) {
    await new Promise(r => setTimeout(r, 800))
    onMessage(chunk)
  }
}
