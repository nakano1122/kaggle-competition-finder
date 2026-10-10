---
name: vite-react-frontend-developer
description: Vite、React、TypeScript でこのアプリの画面、ブラウザ内検索パイプライン、Hono RPC クライアントを実装・変更する。Workers API やデプロイ専用の作業には使わない。
---

# Vite + React フロントエンド開発

対象パッケージの `package.json`、Vite 設定、既存コンポーネントを確認してから実装する。React、Tailwind、shadcn/ui、Hono RPC の導入済み機能を優先し、同じ役割の state 管理や API 型を追加しない。

- ユーザー実績、編集可能な日本語クエリ、保存済みクエリ、お気に入りを画面のドメイン名で扱う。API の DTO を画面全体の state にそのまま広げず、必要な箇所で変換する。
- WebLLM と Transformers.js はブラウザだけで遅延ロードし、同じセッション中はロード済みモデルを再利用する。API キーなどの秘密情報はクライアントに置かない。
- 検索は「日本語クエリ → 英語キーワード（最大 3 件）→ API 候補 → Reranking → 要約」の状態を利用者が追える UI にする。非同期処理中、失敗、空の結果を明示し、連続実行で古い結果が新しい検索を上書きしないようにする。
- Reranking は日本語クエリと英語のコンペ説明を入力にして候補を並べ替える。Embedding や独自検索インデックスを追加しない。要約は上位 3 件を先に生成し、残りは詳細表示時に生成してブラウザ内で一時キャッシュする。
- props、state、イベントハンドラを必要最小限にし、コンポーネント内に複雑な業務規則を埋め込まない。条件式や JSX の入れ子が読みにくくなったら、名前付きの表示用変数または小さなコンポーネントへ分ける。

変更後は対象 package の lint、型検査、Vitest、Vite build を既存の pnpm script で検証する。WebLLM または Transformers.js の API はバージョン差が大きいため、利用前に公式ドキュメントとインストール済みバージョンを確認する。
