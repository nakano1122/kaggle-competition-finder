---
name: cloudflare-deployer
description: このアプリを Cloudflare Workers Static Assets、D1、Cloudflare Access でローカル実行・設定・デプロイする。通常の React または Hono の機能実装だけには使わない。
---

# Cloudflare デプロイ

まず `wrangler` の設定、pnpm workspace、既存の migration、Cloudflare の現在の公式ドキュメントを確認する。無料枠で動かすため、仕様にない Worker、データストア、常時実行サービスを増やさない。

- SPA は Workers Static Assets で配信し、API は同じ Worker の Hono ルートとして提供する。環境別の値は `wrangler` 設定と binding で明示する。
- D1 のスキーマ変更は順序付き migration として追加し、対象環境を確認してから適用する。ローカル D1 とリモート D1 の実行対象を混同しない。
- Kaggle API の資格情報は Wrangler Secret として登録し、値を設定ファイル、ログ、ソース管理に出力しない。Cloudflare Access のアプリケーション設定は、利用者識別と保護対象を確認してから変更する。
- デプロイ前に build、型検査、テスト、`wrangler dev` を実行する。実際のリモートデプロイ、リモート migration、Secret や Access の変更は外部状態を変えるため、ユーザーが明示的に依頼した場合だけ実行する。
- デプロイ後は公開 URL で静的画面と API の最低限の動作を確認し、利用した環境と migration の有無を報告する。
