# Kaggle Competition Finder 実装計画書

## 1. プロジェクト概要

### 1.1 目的

ユーザーの研究・開発実績に適したKaggleコンペティションを検索・推薦するWebアプリケーションを開発する。

ユーザーが自身の実績を登録すると、WebLLMが実績に基づいた日本語の検索クエリを生成する。ユーザーは生成されたクエリを自由に編集でき、確定した検索意図に基づいてKaggle APIからコンペを検索する。

取得したコンペはブラウザ内で動作する多言語Cross-EncoderによってRerankingし、関連度順に表示する。また、WebLLMによって英語のコンペ説明を日本語で要約する。

### 1.2 開発の動機

Kaggleでは様々な機械学習コンペが公開されているが、自身の研究・開発経験を活用できるコンペを探すには、コンペの課題内容を個別に確認する必要がある。

また、コンペの説明は英語が中心であり、自身の経験との関連性を判断するために内容を読み解く負担がある。

そこで、ユーザーの実績に基づく検索クエリ生成、検索モデルによるReranking、日本語要約を組み合わせ、自身に適したコンペを効率的に発見できるシステムを開発する。

### 1.3 開発方針

- フロントエンド・バックエンドはTypeScriptで統一する。
- pnpm workspaceを利用したmonorepoで管理する。
- インフラはCloudflareに集約し、無料プランで運用する。
- ユーザーデータはCloudflare D1に保存する。
- LLMとRerankingモデルはブラウザ内で実行する。
- Kaggle公式APIをFirst-stage Retrievalに利用する。
- 独自のEmbedding・検索インデックスは構築しない。
- モデル学習やオフライン処理は実施しない。
- 外部ライブラリの標準機能を最大限に活用する。
- 不要な抽象化や追加のインフラは導入しない。
- ディレクトリ構成は開発開始時に別途決定する。

## 2. 技術スタック

| 領域            | 技術                             | 用途                         |
| --------------- | -------------------------------- | ---------------------------- |
| Frontend        | React + Vite + TypeScript        | Web UI                       |
| UI              | shadcn/ui + Tailwind CSS         | UIコンポーネント             |
| Backend         | Cloudflare Workers + Hono        | REST API                     |
| Database        | Cloudflare D1                    | データ永続化                 |
| Authentication  | Cloudflare Access                | 認証・アクセス制御           |
| LLM             | WebLLM                           | クエリ生成・翻訳・日本語要約 |
| Reranking       | Transformers.js                  | Cross-Encoder推論            |
| Retrieval       | Kaggle公式API                    | コンペ検索・情報取得         |
| Package Manager | pnpm                             | 依存関係管理                 |
| Monorepo        | pnpm workspace                   | パッケージ管理               |
| Deployment      | Cloudflare Workers Static Assets | Web UI・API公開              |
| Testing         | Vitest                           | 単体テスト                   |
| Development     | Wrangler                         | Workers・D1開発              |

### 2.1 Monorepo管理

pnpm workspaceを採用する。

- フロントエンドとバックエンドは独立したパッケージとして管理する。
- 必要に応じてTypeScriptの型定義を共有する。
- API呼び出しはHono RPCの利用を優先する。
- 依存関係は`pnpm-lock.yaml`で固定する。
- ビルド・テスト・デプロイはpnpm scriptsに統一する。
- TurborepoやNxは導入しない。

## 3. システムアーキテクチャ

### 3.1 フロントエンド

React + ViteでSPAを構築する。

担当機能：

- ユーザー実績の入力・編集
- WebLLMによる日本語クエリ生成
- 検索クエリの編集
- WebLLMによる英語検索キーワード生成
- Transformers.jsによるReranking
- WebLLMによる日本語要約
- 検索結果・お気に入りの表示

LLM・Rerankingの推論処理はブラウザ内で完結させる。

### 3.2 バックエンド

Cloudflare Workers上でHonoを利用する。

担当機能：

- D1へのデータ読み書き
- Kaggle APIとの通信
- API認証情報の管理
- リクエストの検証
- ユーザーごとのアクセス制御
- 検索結果のキャッシュ
- 外部APIのエラーハンドリング

WorkersではML推論を実行しない。

### 3.3 データベース

Cloudflare D1に以下を保存する。

- ユーザーの研究・開発実績
- 保存済み検索クエリ
- お気に入りコンペ

Kaggleのコンペ情報は原則として公式APIから取得する。コンペ全件をD1へ複製することはしない。

## 4. 主要機能

### 4.1 実績登録

ユーザーが研究・開発経験を日本語で自由記述する。

入力例：

> 情報検索モデルの研究に取り組んでおり、Dense RetrievalやRerankingモデルの実装経験がある。PythonとPyTorchを用いた機械学習モデルの開発・評価経験がある。

登録内容はD1に保存する。

ユーザーは実績を後から編集できる。

### 4.2 検索クエリ生成

WebLLMが登録された実績をもとに、日本語の検索クエリを生成する。

生成例：

> 自然言語処理や情報検索の経験を活用できるKaggleコンペを探したい。特に、テキスト分類や文書の関連度予測などのタスクに興味がある。

生成されたクエリはテキストエリアに表示する。

ユーザーはクエリを自由に編集できる。

検索クエリの保存機能を提供し、過去に使用したクエリを再利用できるようにする。

### 4.3 英語検索キーワード生成

WebLLMで、日本語クエリをKaggle API向けの英語検索キーワードに変換する。

複数の短いキーワードを生成し、それぞれ独立して検索する。

出力例：

```json
["natural language processing", "text classification", "semantic similarity"]
```

実装方針：

- 最大3キーワードとする。
- WebLLMの構造化出力機能を優先する。
- JSONスキーマを使って出力形式を検証する。
- Kaggle APIへの検索語として使用する。
- 元の日本語クエリはRerankingのために保持する。

### 4.4 Kaggle APIによる候補検索

Kaggle公式APIからコンペを取得する。

処理手順：

1. WebLLMが生成した英語キーワードを取得する。
2. Workersから各キーワードでKaggle APIを呼び出す。
3. 取得結果を統合する。
4. コンペIDを使用して重複を排除する。
5. 必要なコンペ説明を取得する。
6. Reranking用の候補一覧を返す。

初期実装では、Rerankingの候補数を最大20件程度とする。

Kaggle公式CLIでは統合検索とコンペ一覧検索が提供されているため、まずそれらが利用するHTTP APIへのアクセス方法を検証する。

Kaggle APIの利用方法は、実際に利用可能な公式インターフェースを確認して確定する。

### 4.5 Reranking

Kaggle APIから取得したコンペをCross-EncoderでRerankingする。

**第一候補モデル**

`cross-encoder/mmarco-mMiniLMv2-L12-H384-v1`

採用方針：

- 日本語・英語に対応した多言語モデルを使用する。
- Transformers.jsを使用する。
- ONNX形式の量子化モデルを優先する。
- ブラウザのCPUで推論する。
- 日本語クエリと英語コンペ説明のペアを入力する。
- 関連度スコアの降順でコンペを並び替える。

モデルのロードにはTransformers.jsの`pipeline()`を使用する。

入力例：

```text
Query:
自然言語処理や情報検索の経験を活用したい

Document:
This competition focuses on predicting
the relevance between search queries
and candidate documents.
```

コンペの課題説明を検索対象とし、タイトルや評価方法など取得できる情報も利用する。

モデルの最大入力トークン数を超える場合は、コンペ説明の前処理方法を検討する。

なお、Cross-EncoderによるRerankingではEmbeddingやベクトルインデックスを作成しない。

採用モデルについては、日本語クエリと英語文書のペア入力、およびブラウザ内CPU推論が正常に動作することを検証する。

### 4.6 日本語要約

WebLLMで英語のコンペ説明を日本語に要約する。

要約には以下の情報を含める。

- コンペの概要
- 解決する課題
- 求められる機械学習技術
- ユーザーの実績との関連性

コンペの公式情報と、ユーザー実績に基づく推薦理由は区別する。

実装方針：

- Reranking後の上位3件を自動要約する。
- その他のコンペはユーザーが詳細を開いた際に要約する。
- コンペの説明に存在しない事実を生成しないようプロンプトを設計する。
- 要約結果はブラウザ内で一時キャッシュする。

### 4.7 お気に入り

ユーザーがお気に入りのコンペを保存できるようにする。

保存対象：

- コンペID
- コンペ名
- コンペURL
- 登録日時

お気に入り情報はD1に保存し、後から一覧表示・削除できるようにする。

## 5. 検索パイプライン

1. D1からユーザーの実績を取得する。
2. WebLLMで日本語検索クエリを生成する。
3. ユーザーがクエリを編集する。
4. WebLLMで英語検索キーワードを生成する。
5. Kaggle APIでコンペ候補を取得する。
6. Cross-Encoderで候補をRerankingする。
7. 関連度順に検索結果を表示する。
8. WebLLMで上位コンペを日本語要約する。
9. ユーザーが必要に応じてお気に入りに登録する。

モデルはブラウザ内でロードし、同一セッション中は再利用する。

## 6. MLモデルの実装方針

### 6.1 WebLLM

使用ライブラリ：

`@mlc-ai/web-llm`

標準APIを使用する。

- `CreateMLCEngine()`によるモデル初期化
- `chat.completions.create()`による文章生成
- ストリーミング出力
- モデルロード進捗の取得
- 対応するWeb Worker機能によるUIスレッドからの分離

クエリ生成、検索キーワード生成、コンペ要約で同じEngineを共有する。

モデルは日本語生成品質とブラウザ内のメモリ使用量を考慮し、WebLLMが公式にサポートする軽量モデルから選定する。

WebLLMの実行にはWebGPU対応環境が必要である。

### 6.2 Transformers.js

使用ライブラリ：

`@huggingface/transformers`

- `pipeline()`によるモデルロード
- Cross-Encoderのペア入力
- バッチ推論
- ONNX Runtime WebのWASMバックエンド
- 量子化モデルの利用
- モデルキャッシュ

Reranking処理はWeb Workerで実行し、画面操作を妨げないようにする。

対応する量子化ONNXモデルとTokenizerの組み合わせを確認してからモデルを確定する。

## 7. データベース設計

### 7.1 profiles

| カラム     | 型               | 内容           |
| ---------- | ---------------- | -------------- |
| user_id    | TEXT PRIMARY KEY | ユーザーID     |
| content    | TEXT             | 研究・開発実績 |
| updated_at | TEXT             | 更新日時       |

### 7.2 search_queries

| カラム     | 型               | 内容         |
| ---------- | ---------------- | ------------ |
| id         | TEXT PRIMARY KEY | クエリID     |
| user_id    | TEXT             | ユーザーID   |
| query      | TEXT             | 日本語クエリ |
| created_at | TEXT             | 作成日時     |

### 7.3 favorites

| カラム         | 型   | 内容       |
| -------------- | ---- | ---------- |
| user_id        | TEXT | ユーザーID |
| competition_id | TEXT | コンペID   |
| title          | TEXT | コンペ名   |
| url            | TEXT | Kaggle URL |
| created_at     | TEXT | 登録日時   |

`favorites`では`user_id`と`competition_id`を複合主キーとする。

D1へのアクセスにはCloudflare公式Binding APIとPrepared Statementを利用する。

## 8. API設計

HonoでREST APIを提供する。

| Method | Endpoint                | 用途               |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/profile`          | 実績取得           |
| PUT    | `/api/profile`          | 実績登録・更新     |
| GET    | `/api/queries`          | 保存済みクエリ取得 |
| POST   | `/api/queries`          | クエリ保存         |
| DELETE | `/api/queries/:id`      | クエリ削除         |
| GET    | `/api/favorites`        | お気に入り取得     |
| POST   | `/api/favorites`        | お気に入り登録     |
| DELETE | `/api/favorites/:id`    | お気に入り削除     |
| GET    | `/api/competitions`     | コンペ検索         |
| GET    | `/api/competitions/:id` | コンペ詳細取得     |

APIの型安全性を確保するため、Hono RPCを優先して使用する。

Kaggleへの認証情報はCloudflare Secretsで管理し、ブラウザへ公開しない。

## 9. 認証・セキュリティ

初期公開ではCloudflare Accessを使用する。

- 許可されたユーザーのみ利用できる。
- Workers側で認証済みユーザーを識別する。
- D1への読み書きをユーザー単位で制限する。
- ユーザーIDはリクエスト本文から受け取らず、検証済み認証情報から決定する。
- APIキーはCloudflare Secretsで管理する。
- リクエストの入力検証とレート制限を実装する。

不特定多数への一般公開を行う場合は、Cloudflare Accessの認証フローやユーザー管理が要件を満たすか改めて確認する。

## 10. UI設計

単一ページを中心とした構成とする。

### 実績入力エリア

- 実績の入力・編集
- 保存ボタン
- クエリ生成ボタン

### 検索エリア

- 生成された日本語クエリ
- 編集可能なテキストエリア
- 検索ボタン
- 保存済みクエリの選択

### 検索結果エリア

- コンペ名
- カテゴリ
- 締切
- Rerankingスコア
- 日本語要約
- 実績との関連性
- Kaggleへのリンク
- お気に入りボタン

モデルのロード中、検索中、要約中の進捗を表示する。

複雑なアニメーションや独自UIは実装せず、shadcn/uiを使用する。

## 11. 開発手順

### Phase 1. 技術検証

優先して以下を確認する。

- Kaggle APIをWorkersから呼び出せるか。
- 必要なコンペ説明を取得できるか。
- WebLLMで日本語クエリを生成できるか。
- WebLLMで日本語要約を生成できるか。
- Transformers.jsでCross-Encoderを実行できるか。
- 日本語クエリと英語文書を直接比較できるか。
- ブラウザ内でモデルを同時に利用できるか。

この段階では本格的なUIやDBは実装しない。

### Phase 2. 開発環境構築

- pnpm workspaceの設定
- React + Viteの初期設定
- Cloudflare Workers + Honoの初期設定
- D1の作成・Migration
- Hono RPCの設定
- Vitestの導入
- Wranglerによるローカル開発環境の構築

### Phase 3. 基本機能

- 実績登録・編集
- D1への保存
- 日本語クエリ生成・編集
- 英語キーワード生成
- Kaggle API検索
- Cross-Encoder Reranking
- 検索結果表示

### Phase 4. 追加機能

- WebLLMによる日本語要約
- お気に入り登録
- 保存済みクエリの再利用
- モデルロード進捗表示
- エラー処理
- 検索APIキャッシュ

### Phase 5. 評価・デプロイ

- 検索精度評価
- 推論レイテンシ計測
- メモリ使用量計測
- Cloudflare無料枠の利用量確認
- Cloudflare Accessの設定
- 本番環境へのデプロイ
- README・デモ動画の整備

## 12. 評価方法

### 12.1 検索精度

以下を比較する。

1. Kaggle APIによる初期ランキング
2. Cross-EncoderによるReranking後のランキング

日本語クエリとコンペの関連度を人手で評価し、正解ラベルを作成する。

主な評価指標：

- NDCG@10
- MRR
- Precision@5

取得した候補集合を固定して比較することで、Rerankingの効果を評価する。

また、Kaggle APIが関連コンペを候補として取得できない場合、Rerankingでは改善できないため、First-stage Retrievalの候補取得性能を別途確認する。

### 12.2 推論性能

以下を計測する。

- WebLLMの初回ロード時間
- Rerankingモデルの初回ロード時間
- クエリ生成時間
- Kaggle APIの応答時間
- Cross-EncoderによるReranking時間
- 日本語要約生成時間
- ブラウザのメモリ使用量

初回ロード時間とウォーム状態の検索レイテンシは分けて評価する。

### 12.3 テスト

Vitestで以下をテストする。

- D1へのデータ保存・取得
- ユーザーごとのアクセス制御
- LLM出力の解析
- 検索結果の重複排除
- Reranking結果の並び替え
- Kaggle APIのエラーハンドリング

外部APIはモックを利用してテストする。

## 13. デプロイ・運用

### 13.1 Cloudflare

以下をCloudflareに配置する。

- Reactの静的ファイル：Workers Static Assets
- Hono API：Workers
- ユーザーデータ：D1
- API認証情報：Secrets

WebLLMとRerankingモデルはブラウザ内で実行する。

モデル重みはWorkerのJavaScriptバンドルには含めず、モデル配布元から取得してブラウザにキャッシュする。

### 13.2 無料枠

2026年10月時点の主な制限：

| サービス       | 無料枠                 |
| -------------- | ---------------------- |
| Workers        | 100,000リクエスト/日   |
| Workers CPU    | 10ms/リクエスト        |
| Workers Memory | 128MB                  |
| D1 Read        | 500万行/日             |
| D1 Write       | 10万行/日              |
| D1 Storage     | 5GB                    |
| Static Assets  | 静的配信リクエスト無料 |

無料枠に収めるため、以下を徹底する。

- WorkersではML推論を行わない。
- Kaggle APIへのアクセス数を制限する。
- 同じ検索条件のAPI応答をキャッシュする。
- D1には必要最小限のデータだけを保存する。
- ブラウザ内モデルを再利用する。
- Reranking件数・要約件数に上限を設ける。

無料枠への適合は実運用時の利用量を計測して確認する。

## 14. 初期実装の対象外

以下は実装しない。

- 独自Embeddingモデル
- ベクトルデータベース
- Elasticsearch
- Fine-tuning
- オフラインインデックス構築
- Google Colabによるバッチ処理
- FastAPI・Goによるバックエンド
- GPU推論サーバー
- 外部LLM推論API
- Kaggleへの自動参加・提出
- コンペ解法の自動生成
- 独自の認証システム
- Turborepo・Nx

## 15. 完成条件

- 研究・開発実績を登録・編集・保存できる。
- WebLLMが日本語検索クエリを生成できる。
- ユーザーが検索クエリを自由に編集できる。
- 日本語クエリから英語キーワードを生成できる。
- Kaggle APIでコンペを取得できる。
- 多言語Cross-EncoderによってRerankingできる。
- 関連度順に検索結果を表示できる。
- WebLLMで英語のコンペ説明を日本語要約できる。
- お気に入りをD1へ保存できる。
- Cloudflare上で公開できる。
- 検索精度と推論性能の評価結果を提示できる。

## 16. 参考資料

- [Kaggle公式CLI](https://github.com/Kaggle/kaggle-cli)
- [Kaggle Search CLI](https://github.com/Kaggle/kaggle-cli/blob/main/skills/references/search.md)
- [Kaggle Competitions CLI](https://github.com/Kaggle/kaggle-cli/blob/main/docs/competitions.md)
- [WebLLM](https://webllm.mlc.ai/docs/)
- [Transformers.js](https://huggingface.co/docs/transformers.js/)
- [mMARCO Multilingual Cross-Encoder](https://huggingface.co/cross-encoder/mmarco-mMiniLMv2-L12-H384-v1)
- [Hono](https://hono.dev/)
- [pnpm Workspace](https://pnpm.io/workspaces)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
