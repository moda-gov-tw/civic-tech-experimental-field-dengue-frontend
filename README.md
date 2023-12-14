# 台南市登革熱防疫現場數位工具 - 前端
本案為「112年數位發展部公民科技試驗場域示範案」由「好想打流感」團隊開發的「台南市登革熱防疫現場數位工具」透過與臺南市政府衛生局的合作，協助開發數位工具以簡化登革熱防治工作上的流程，並改善目前繁瑣的人工確認作業及掌握更即時的資訊。
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
