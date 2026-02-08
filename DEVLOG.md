# 開発ログ - 習慣トラッカー

## プロジェクト概要
- **アプリ名**: 習慣トラッカー
- **技術スタック**: Next.js 16 + Prisma 7 + NextAuth.js + Tailwind CSS 4
- **ホスティング**: Vercel
- **データベース**: Turso (libSQL / クラウドSQLite)
- **認証**: Google OAuth
- **リポジトリ**: https://github.com/moco1013/habittracker
- **公開URL**: https://habittracker-six-pi.vercel.app/

---

## プロンプトと解釈の記録

各ステップで、ユーザーがどのような指示を出し、AIがそれをどう解釈・実行したかを記録する。

### デプロイ計画の実行

**プロンプト**: （詳細なデプロイ計画をMarkdownで提示）

**解釈**: 事前に策定されたVercel + Tursoデプロイ計画の実行指示。計画書に記載された手順を上から順に実行する。パッケージ入れ替え → コード変更 → 環境変数更新 → ビルド確認 の順で進める。

---

### Turso CLIインストール〜DB作成

**プロンプト**: `brew install tursodatabase/tap/turso`

**解釈**: ユーザーがTurso CLIのインストールコマンドを直接指定。そのまま実行。Command Line Toolsのバージョン不一致エラーが発生したため、代替手段（curlインストールスクリプト）に自動的に切り替えた。

**プロンプト**: `turso auth login`

**解釈**: Turso CLIへのログイン指示。ブラウザ認証が必要なためバックグラウンドで実行し、ワンタイムコードをユーザーに提示。

**プロンプト**: `turso db create habittracker`

**解釈**: Tursoデータベースの作成指示。作成後、URL・トークンの取得とスキーマ適用まで一気に進めた。

---

### GitHubリポジトリ作成

**プロンプト**: 「はい」（Gitリポジトリの作成に進みますか？に対して）

**解釈**: Git初期化 → GitHub CLIログイン → リポジトリ作成 → push までの一連のフローを実行する承認。`dev.db` がステージに含まれていたため、除外処理を挟んだ。

---

### Vercel環境変数の確認

**プロンプト**: 「環境変数を設定 について詳しく教えて」

**解釈**: Vercelでの環境変数設定手順をまだ把握していないため、設定場所・設定する変数一覧・設定後の手順（Redeploy）を詳しく案内してほしいという質問。

**プロンプト**: 「登録してあります。内容が正しいか、コピペしたら確認できる？？」

**解釈**: 環境変数は設定済みだが正しいか不安。値を貼り付けて確認したいという意図。センシティブな情報もあるため、全文ではなく先頭数文字で確認する方法を提案した。

**プロンプト**: `libsql://habittracker-moco.aws-ap-no\nrtheast-1.turso.io`（改行混入）

**解釈**: `TURSO_DATABASE_URL` の値に改行が混入している。コピペ時にVercelの入力欄で折り返されたのが原因と推定。改行なしの正しい値を提示し、再設定を案内した。

---

### デプロイ後のエラー対応

**プロンプト**: 「デプロイ時のエラーが出る npm warn deprecated node-domexception@1.0.0」

**解釈**: `warn deprecated` は警告であってビルド失敗のエラーではない。ビルドログの別の部分にエラーがないか確認するよう案内した。

**プロンプト**: （`redirect_uri_mismatch` のスクリーンショット）

**解釈**: Google OAuthのリダイレクトURIが未設定。Google Cloud ConsoleでVercelドメインのコールバックURLを追加する手順を案内した。

**プロンプト**: 「your-appには何を？」

**解釈**: `https://your-app.vercel.app/api/auth/callback/google` の `your-app` 部分に何を入れるか分からない。Vercelが自動割り当てするドメインの確認方法を案内した。

**プロンプト**: 「https://habittracker-six-pi.vercel.app/　かな？」

**解釈**: プレビューURLではなく固定のProductionドメインを特定できたことを確認。そのドメインでコールバックURLを案内した。

---

### ローカル開発への切り替え

**プロンプト**: 「ローカル環境で開発を続けたい」

**解釈**: デプロイは完了したので、今後はローカルで機能開発を続けたい。`.env` の `TURSO_DATABASE_URL` を `file:./dev.db` に切り替えることで、ローカルSQLiteでの開発に戻す。

---

### フォント変更

**プロンプト**: 「書体をBIZUDPゴシック」

**解釈**: アプリ全体のフォントをBIZ UDPゴシック（Google Fonts）に変更する指示。`next/font/google` の `BIZ_UDPGothic` を使い、`layout.tsx` と `globals.css` を更新。

**プロンプト**: 「文字が詰まっているので全体的に少しだけ開けたい。」

**解釈**: BIZ UDPゴシックはデフォルトの字間が狭い。`letter-spacing` と `line-height` を `body` に追加して全体的に余白を持たせる。

**プロンプト**: 「書体の設定はbodyに反映して」

**解釈**: CSS変数（`variable`）経由ではなく、`body` 要素に直接フォントを適用してほしい。`variable` → `className` に戻す。

**プロンプト**: 「変更漏れが発生します。すべての書体を変えたい場合はどうしたらいいですか？」

**解釈**: CSS変数方式だと一部のコンポーネントに適用されない問題。`className` で `body` に直接適用すれば全子要素に継承されるため確実、という仕組みの説明を求めている。

---

### タブバーの追加

**プロンプト**: 「タブバーを追加して」

**解釈**: スマホアプリのような画面下部の固定タブナビゲーションを追加する指示。タブの内容を確認するため選択肢を提示 → ユーザーが「ホーム / カレンダー / 設定」を選択。

---

### ホーム画面の再設計

**プロンプト**: 「ホーム画面では、今日やるべき習慣だけが表示されてほしい。週の達成状況は不要。チェックを入れたら華やかなアニメーションが出る」

**解釈**: 3つの要求を含む:
1. ホーム画面は今日のチェックリストのみ表示（週間ドット削除）
2. 不要な情報（週間達成ドット）を削除してシンプルにする
3. チェック時に視覚的なフィードバック（紙吹雪 + チェックマークポップ）を追加

`HabitItem` から weeklyCheckIns 関連を全削除し、Confetti コンポーネントとCSSアニメーションを新規追加。

**プロンプト**: 「ホームは今日設定されている習慣だけが表示される。タブバーにもう一つメニューを追加して、習慣の一覧を作って」

**解釈**: 2つの要求:
1. 習慣に「曜日設定」を導入し、ホームにはその曜日の習慣だけ表示する
2. 全習慣の管理（追加・削除・曜日設定）を行う専用ページを作り、タブバーに追加する

→ DBスキーマに `days` フィールドを追加、`/dashboard/habits` ページと「習慣」タブを新設。ホームからは AddHabitForm と削除ボタンを除去し、管理を「習慣」タブに集約。

---

### 応援メッセージ

**プロンプト**: 「今日の習慣にチェックを入れた時、n日達成というのは出さないで。代わりに「できた！」「最高！」「すごすぎ！」などランダムに応援メッセージが出るようにして」

**解釈**: 2つの要求:
1. streak（連続日数）表示を削除
2. 代わりにチェック時に10種類のランダム応援メッセージをポップアップ表示

`HabitItem` から `streak` prop を完全に削除し、`CHEER_MESSAGES` 配列からランダム選択 + `cheer-pop` アニメーションで表示。

---

### ホームの情報表示

**プロンプト**: 「ホームには、今日の日付と習慣の合計数と残り数を出して」

**解釈**: ホーム画面のヘッダー部分に日付（「2月9日（日）」形式）と進捗サマリー（「3件中 1件完了・残り2件」）を表示する。

---

### 習慣の目的設定

**プロンプト**: 「「習慣」では、それをやる目的を思い出せるようにしたい。各習慣に対して目的を設定し、ひょうじできるようにして」

**解釈**: 習慣にはそれを行う理由（モチベーション）があるので、それを記録・表示したい。DBスキーマに `purpose` フィールドを追加し、習慣管理ページでインライン編集、ホームで習慣名の下に小さく表示する。

---

### 全達成時の名言

**プロンプト**: 「その日の習慣が全て終わったら、偉人の名言が出るようにしてほしい。」

**解釈**: ゲーミフィケーション的な要素。全習慣チェック時に達成感を演出するため、偉人の名言を表示する。日替わり（同じ日には同じ名言）で15種類の日本語名言を用意。

---

### 日付ナビゲーション

**プロンプト**: 「ホームでは過去の日付にも移動できるようにして」

**解釈**: ホーム画面に日付移動機能を追加。`< >` ボタンで前後の日に移動し、その日の曜日に対応する習慣とチェック状態を表示する。`?date=YYYY-MM-DD` クエリパラメータで実装。

**プロンプト**: 「過去の日付もチェックを入れられるようにして」

**解釈**: 当初は過去日付を閲覧専用（disabled）にしていたが、チェック忘れの修正ができるよう操作可能にしてほしい。`toggleCheckIn` に `date` パラメータを追加し、任意の日付のチェックインを切り替え可能にした。

---

### 開発ログの作成

**プロンプト**: 「開発履歴を残したい。ここまでのcurosorとのやりとりを詳細なドキュメントに記録して」

**解釈**: Claude Code（ユーザーは「cursor」と表現）との全やりとりを、後から振り返れる形でドキュメント化してほしい。技術的な変更内容だけでなく、発生したエラーとその解決方法、判断の経緯も含めた詳細な開発ログ。

**プロンプト**: 「私のプロンプと、それをどう解釈したかもも添えて」

**解釈**: 各ステップで、ユーザーが実際に入力したプロンプトと、AIがそれをどう理解して何を実装したかの対応関係を記録してほしい。プロンプトの曖昧さをどう補完したか、複数の要求をどう分解したかが分かる形式にする。

---

## 開発履歴（技術詳細）

### 1. Vercel + Turso デプロイ対応

#### 1-1. パッケージ入れ替え
ローカルSQLite (`better-sqlite3`) からクラウドDB (Turso/libSQL) への移行。

- `@prisma/adapter-better-sqlite3` を削除
- `@prisma/adapter-libsql` と `@libsql/client` を追加

```bash
npm uninstall @prisma/adapter-better-sqlite3
npm install @prisma/adapter-libsql @libsql/client
```

#### 1-2. `src/lib/prisma.ts` のアダプター変更
- `PrismaBetterSqlite3` → `PrismaLibSql` に変更
- 接続先を `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` 環境変数に変更
- **注意**: エクスポート名は `PrismaLibSql`（小文字のql）。`PrismaLibSQL` ではビルドエラーになる
- **注意**: 新しいAPI（v7.3.0）では `PrismaLibSql` のコンストラクタに `Config` オブジェクト（`{ url, authToken }`）を直接渡す。`createClient` で `Client` を作って渡すのは旧API

**変更前:**
```typescript
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
```

**変更後:**
```typescript
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

#### 1-3. 環境変数の追加
`.env` と `.env.example` に `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` を追加。
`DATABASE_URL` はPrismaマイグレーション用にそのまま残す。

#### 1-4. ビルド確認
`npm run build` で成功を確認。

---

### 2. Turso DBセットアップ

#### 2-1. Turso CLIインストール
`brew install` は Command Line Tools のバージョン不一致でエラー。インストールスクリプトで対応。

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

#### 2-2. ログイン・DB作成
```bash
turso auth login          # ブラウザ認証
turso db create habittracker  # DB作成（リージョン: aws-ap-northeast-1 東京）
turso db show habittracker --url     # URL取得
turso db tokens create habittracker  # トークン取得
```

#### 2-3. スキーマ適用
```bash
turso db shell habittracker < prisma/migrations/20260207212747_init/migration.sql
```
6テーブル（User, Account, Session, VerificationToken, Habit, CheckIn）が作成された。

---

### 3. GitHubリポジトリ作成・Vercelデプロイ

#### 3-1. Gitリポジトリ作成
- `git init` → ファイルをステージ
- `dev.db`（ローカルSQLiteファイル）がステージされていたため `git rm --cached` で除外
- `.gitignore` の database セクションを `*.db` / `*.db-journal` に一般化

#### 3-2. GitHub CLIでリポジトリ作成・push
```bash
gh auth login --web -p https --git-protocol https  # ブラウザ認証（ワンタイムコード方式）
gh repo create habittracker --public --source=. --push
```

#### 3-3. Vercelデプロイ時のビルドエラー
**問題**: `src/generated/prisma`（Prisma生成コード）が `.gitignore` で除外されているため、Vercel上に存在しない
**解決**: `package.json` に `postinstall` スクリプトを追加

```json
"postinstall": "prisma generate"
```

#### 3-4. Vercel環境変数の設定
以下5つをVercel Dashboard > Settings > Environment Variables に登録:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

**注意**: 環境変数の値に改行が入るとエラーになる（Vercelの入力欄でコピペ時に発生しやすい）

#### 3-5. Google OAuth リダイレクトURI設定
Google Cloud Console で承認済みリダイレクトURIを追加:
```
https://habittracker-six-pi.vercel.app/api/auth/callback/google
```
これを追加しないと `redirect_uri_mismatch` エラーになる。

---

### 4. ローカル開発環境の切り替え
ローカル開発時は `.env` の `TURSO_DATABASE_URL` を `file:./dev.db` に設定。
libSQL は `file:` プロトコルに対応しているため、ローカルSQLiteファイルをそのまま使える。

```
TURSO_DATABASE_URL="file:./dev.db"
TURSO_AUTH_TOKEN=""
```

---

### 5. フォント変更（BIZ UDPゴシック）

#### 5-1. フォント設定
`next/font/google` の `Noto_Sans_JP` → `BIZ_UDPGothic` に変更。
`weight: ["400", "700"]` を明示的に指定（可変フォントではないため必須）。

#### 5-2. 適用方法
- `variable`（CSS変数方式）だと適用漏れが発生しやすい
- `className`（直接適用方式）に変更することで、`body` 以下すべての要素に確実に継承される

```tsx
<body className={`${bizUDPGothic.className} antialiased`}>
```

#### 5-3. 字間・行間の調整
`globals.css` の `body` に追加:
```css
letter-spacing: 0.05em;
line-height: 1.8;
```

---

### 6. タブバーの追加

4タブ構成の固定フッターナビゲーションを追加:
- **ホーム** (`/dashboard`) - 今日の習慣チェックリスト
- **習慣** (`/dashboard/habits`) - 習慣の管理（追加・削除・曜日設定）
- **カレンダー** (`/dashboard/calendar`) - 月間の達成度を色分け表示
- **設定** (`/dashboard/settings`) - アカウント情報

**実装ポイント**:
- `src/app/dashboard/layout.tsx` を作成し、`<TabBar />` を共通レイアウトに配置
- `pb-20` でタブバー分の余白を確保
- `pb-[env(safe-area-inset-bottom)]` でiPhoneのホームインジケーター対応
- Heroicons ベースのSVGアイコン（アクティブ時はfill、非アクティブ時はstroke）

---

### 7. ホーム画面のシンプル化

#### 7-1. 週間達成状況の削除
`HabitItem` から weeklyCheckIns / weeklyLabels / streak 表示を削除。
ホーム画面は「今日やるべき習慣」のチェックリストに特化。

#### 7-2. チェック時のアニメーション追加
- **紙吹雪（Confetti）**: 20個のカラフルなパーティクルがチェックボタンから放射状に飛び散る
- **チェックマークポップ**: `scale(0) → scale(1.3) → scale(1)` のバウンスアニメーション
- **応援メッセージ**: 「できた！」「最高！」「すごすぎ！」などランダム表示（`cheer-pop` アニメーション）

CSS キーフレーム3種を `globals.css` に追加:
- `confetti-burst` - パーティクルの飛散
- `check-pop` - チェックマークのバウンス
- `cheer-pop` - メッセージのポップアップ→フェードアウト

---

### 8. 習慣の曜日設定

#### 8-1. スキーマ変更
`Habit` モデルに `days` フィールドを追加:
```prisma
days String @default("0,1,2,3,4,5,6") // 曜日: 0=日,1=月,...,6=土
```

```bash
npx prisma migrate dev --name add-habit-days
```

**注意**: マイグレーション後は `npx prisma generate` で再生成し、devサーバーを再起動する必要がある。
古いPrismaクライアントがキャッシュされていると `Unknown argument` エラーが発生する。

#### 8-2. 既存データのnull対策
マイグレーション前に作成された既存の習慣は `days` が `null` になる可能性がある。
`habit.days.split(",")` で `Cannot read properties of undefined (reading 'split')` エラーが発生。

**対策**: すべての参照箇所で `(habit.days ?? "0,1,2,3,4,5,6")` のフォールバックを追加。

#### 8-3. 習慣管理ページ
`/dashboard/habits` に習慣一覧ページを作成:
- 習慣の追加（名前 + 曜日選択）
- 曜日のトグル（即座に保存）
- 削除

ホーム画面からは削除ボタンを除去し、管理は「習慣」タブに集約。

---

### 9. 習慣の目的設定

#### 9-1. スキーマ変更
`Habit` モデルに `purpose` フィールドを追加:
```prisma
purpose String? // この習慣をやる目的
```

```bash
npx prisma migrate dev --name add-habit-purpose
```

#### 9-2. Server Action の変更
`updateHabitDays` を汎用的な `updateHabit` に変更:
```typescript
export async function updateHabit(habitId: string, data: { days?: string; purpose?: string | null })
```

#### 9-3. UI
- **習慣タブ**: 各習慣に「+ 目的を追加」ボタン → クリックでインライン編集 → Enter or 保存ボタンで確定
- **ホーム**: 習慣名の下に目的を小さく表示
- **新規追加フォーム**: 目的入力欄を追加（任意）

---

### 10. 全達成時の偉人名言表示

全ての習慣にチェックが入ると、日替わりの偉人名言を表示:
- 15種類の名言（老子、イチロー、ガンジー、稲盛和夫、相田みつをなど）
- 日付をシードにした決定的な選択（同じ日には同じ名言）
- グラデーション背景（amber → orange）のカードデザイン

---

### 11. 日付ナビゲーション

#### 11-1. DateNav コンポーネント
ホーム画面に前後の日付に移動する `< >` ボタンを追加。
`?date=YYYY-MM-DD` クエリパラメータで日付を指定。

- 未来の日付には進めない（右矢印を非表示）
- 今日の場合は「今日」ラベルを表示

#### 11-2. 過去の日付でのチェック
当初は過去日付を閲覧専用にしていたが、要望によりチェック可能に変更。
`toggleCheckIn` に `date` パラメータを追加して、指定日のチェックインを操作可能にした。

---

## 技術的な学び・注意点

### Prisma + Turso
- `@prisma/adapter-libsql` v7.3.0 のエクスポート名は `PrismaLibSql`（SQL ではなく Sql）
- コンストラクタには `Config` オブジェクトを直接渡す（`createClient` 不要）
- スキーマ変更後は `prisma generate` + devサーバー再起動が必須
- `prisma/schema.prisma` の `provider = "sqlite"` はTursoでもそのまま使える

### Vercel デプロイ
- `src/generated/prisma` が `.gitignore` にある場合、`postinstall: "prisma generate"` が必須
- 環境変数はデプロイ後にRedeployしないと反映されない
- 環境変数のコピペ時に改行が混入しやすい

### Next.js
- `searchParams` は Next.js 16 では `Promise` 型（`await searchParams` が必要）
- `next/font/google` の `className` は直接フォントを適用、`variable` はCSS変数のみセット

### SQLiteマイグレーション
- `@default("...")` があっても、既存レコードには適用されない（NULL のまま）
- 参照箇所すべてにフォールバック (`?? デフォルト値`) を入れるか、マイグレーションSQLで `UPDATE` する
