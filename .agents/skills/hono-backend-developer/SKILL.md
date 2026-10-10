---
name: hono-backend-developer
description: Hono と Cloudflare Workers で、このアプリの API、D1、Kaggle API 連携を実装・変更する。ブラウザ内推論や React UI の実装には使わない。
---

# Hono バックエンド開発

仕様、既存の workspace 構成、対象パッケージの `package.json` を最初に確認する。未導入の依存関係を前提にせず、導入済みの Hono、Drizzle、検証ライブラリの標準機能を優先する。

- Cloudflare Workers の binding は `Env` として明示し、資格情報は Secret binding からだけ参照する。Kaggle の資格情報や WebLLM の推論をクライアントへ渡さない。
- API の入出力はリクエスト境界で検証する。Hono RPC を使える構成では、ルートをエクスポートしてフロントエンドと型を共有し、同じ API 型を手書きで複製しない。
- D1 は migration でスキーマを管理し、ユーザー固有の読み書きには Cloudflare Access で得た利用者識別子を必ず条件に含める。動的な SQL 文字列の組み立てを避け、パラメータ化されたクエリまたは ORM を使う。
- Kaggle API 呼び出しは、キーワードごとの結果をコンペ ID で統合・重複排除し、候補を最大 20 件程度に絞って返す。外部 API の失敗は原因を漏らさない利用者向けエラーへ変換する。
- キャッシュは検索結果の短期再利用に限定し、Kaggle の全コンペを D1 に複製しない。Workers で WebLLM や Cross-Encoder の推論を行わない。
- ルートハンドラは HTTP 境界に留め、永続化・外部 API・ドメイン規則を一箇所に混在させない。小さな処理単位の名前付き関数に分け、不要な class、cast、抽象化を増やさない。

変更後は対象 package の型検査・テスト・Wrangler のローカル検証を、定義済みの pnpm script から実行する。Cloudflare と Kaggle の現在の仕様に依存する実装を決める前には、公式ドキュメントを確認する。
