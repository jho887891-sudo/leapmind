# M8 虚拟 AI 教师 Java 接口

## 已实现能力

- `teacher_avatars` 教师形象表及管理员 CRUD
- `user_teacher_preferences` 用户形象、音色、语速偏好
- 统一阿里云 TTS 服务编排
- `SHA-256(text + voiceType + speed)` 缓存键
- Redis 缓存，TTL 24 小时
- Redis 不可用时进程内缓存降级
- MinIO 音频存储
- 无 MinIO 时本地文件存储降级
- JSON 音频 URL 响应
- HTTP 分块音频响应

## 用户接口

所有接口除本地音频读取外均需要 JWT。

| 方法 | 地址 | 说明 |
|---|---|---|
| GET | `/api/virtual-teacher/avatars` | 获取启用的教师形象 |
| GET | `/api/virtual-teacher/preference` | 获取当前用户偏好 |
| PUT | `/api/virtual-teacher/preference` | 保存当前用户偏好 |
| POST | `/api/virtual-teacher/tts` | 合成语音并返回音频 URL |
| POST | `/api/virtual-teacher/tts/stream` | 以 HTTP 分块方式返回 WAV |
| GET | `/api/virtual-teacher/audio/{objectKey}` | 读取本地存储音频 |

### 保存偏好

```json
{
  "avatarId": "teacher-001",
  "voiceType": "zhixiaoxia",
  "speed": 1.0
}
```

### TTS

```json
{
  "courseId": "course-1001",
  "text": "同学们，我们开始上课。",
  "voiceType": "zhixiaoxia",
  "speed": 1.0
}
```

返回：

```json
{
  "code": 200,
  "message": "语音合成完成",
  "data": {
    "audioUrl": "/api/virtual-teacher/audio/{sha256}.wav",
    "contentType": "audio/wav",
    "audioSize": 123456,
    "cacheHit": false,
    "cacheKey": "tts:audio:{sha256}"
  }
}
```

## 管理员接口

| 方法 | 地址 | 说明 |
|---|---|---|
| GET | `/api/virtual-teacher/avatars/admin` | 获取全部形象 |
| POST | `/api/virtual-teacher/avatars` | 创建形象 |
| PUT | `/api/virtual-teacher/avatars/{id}` | 更新形象 |
| DELETE | `/api/virtual-teacher/avatars/{id}` | 删除未被使用的形象 |

管理员写接口使用现有 `@AdminRequired` 权限校验。

## Redis

```text
key:   tts:audio:{sha256(text + voiceType + speed)}
value: {sha256}.wav
TTL:   24h
```

环境变量：

```text
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

Redis 无法连接时服务不会中断，而是使用当前 Java 进程内的 24 小时缓存。

## 存储

本地开发默认使用：

```text
VIRTUAL_TEACHER_STORAGE_TYPE=local
VIRTUAL_TEACHER_LOCAL_DIR=${java.io.tmpdir}/leapmind-tts
```

部署 MinIO：

```text
VIRTUAL_TEACHER_STORAGE_TYPE=minio
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=leapmind-tts
```

MinIO 模式返回有效期 24 小时的预签名 URL。

## 数据库

Flyway 启动时执行：

```text
src/main/resources/db/migration/V3__add_virtual_teacher.sql
```

迁移会创建两张表并初始化三个教师形象。

## 验证

```powershell
$env:JAVA_HOME='E:\application2\Java\jdk-17'
mvn test
```

M8 TTS 单元测试覆盖：

- 缓存命中时不调用第三方 TTS
- 缓存未命中时合成、存储并写入缓存
