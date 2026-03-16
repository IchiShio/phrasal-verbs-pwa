# CLAUDE.md

## プロジェクト概要
Phrasal Verbs Daily - 毎日の句動詞学習PWA（完全クライアントサイド）
ログイン不要・バックエンド不要。IndexedDB + SRS（間隔反復）で継続学習を促進。

## 技術スタック
- Vite 8 + React + TypeScript
- Tailwind CSS v4（`@tailwindcss/vite`）
- Dexie.js（IndexedDB ラッパー）
- canvas-confetti（正解アニメーション）
- vite-plugin-pwa（Service Worker + manifest 自動生成）
- デプロイ: Vercel

## ディレクトリ構成
```
src/
  db/index.ts          - Dexie DB定義（verbs, progress, stats）
  lib/types.ts         - 型定義・レベル定義
  lib/srs.ts           - SM-2 間隔反復アルゴリズム
  lib/daily.ts         - 毎日の出題ロジック
  lib/streak.ts        - 連続日数トラッキング
  hooks/useDailyVerbs  - 日次データ取得フック
  hooks/useQuiz        - クイズ状態管理フック
  components/          - UIコンポーネント
public/data/verbs.json - 句動詞マスターデータ（100語）
```

## 開発ルール
- `npm run dev` → 開発サーバー
- `npm run build` → 本番ビルド
- コード変更後は自動でコミット＆プッシュまで行う
- APIキー不要（完全クライアントサイド）
- 句動詞追加: `public/data/verbs.json` に追記
- choices配列の[0]が常に正答（クイズ時にシャッフル）
