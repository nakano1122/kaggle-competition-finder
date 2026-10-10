export const mockKeywords = [
  'natural language processing',
  'text classification',
  'semantic similarity',
]

export const pipelineSteps = [
  { id: 'query', label: '検索意図', description: '日本語クエリを確認' },
  { id: 'keywords', label: 'キーワード', description: '英語キーワードを準備' },
  { id: 'candidates', label: '候補取得', description: 'Kaggle APIを検索' },
  { id: 'reranking', label: '並び替え', description: '関連度で再順位付け' },
  { id: 'summary', label: '要約', description: '候補を日本語で整理' },
] as const

export type PipelineStage = (typeof pipelineSteps)[number]['id']
