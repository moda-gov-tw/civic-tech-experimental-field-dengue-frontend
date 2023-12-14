# 台南市登革熱防疫現場數位工具 - 前端

## 系統環境

- Nodejs ^18
- Firebase realtime database

## 安裝準備

1. Install Nodejs ^18
2. Create Firebase project
3. Clone repository

### 相依套件

```bash
yarn install
```

### 編輯 .env

1. rename .env.sample to .env
2. Filled .env

```
// 後端 API URL
VITE_API_URL=https://xxxx.xxx.xxx

// Firebase config，使用 Json 格式，從 firebase 複製後，key 需要 "" wrapper
VITE_FIREBASE_CONFIG=`{"xxx": "xxxx"}`
```

## 運行開發模式

```bash
yarn dev
```

## 編譯正式環境

```bash
yarn build
```
