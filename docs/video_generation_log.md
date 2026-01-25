# SNS動画自動生成 - 開発ログ

## プロジェクト概要

ブログ記事からSNS用動画（YouTube Shorts、TikTok、Facebook Reels）を自動生成するシステムの開発。

**開始日**: 2026年1月
**作業フォルダ**: `C:\Users\siank\AppData\Local\Temp\video_gen\`

---

## 対象記事

### 1. ベトナム生活費ガイド
- URL: https://kyujin.careerlink.asia/blog/vietnam-living-cost-guide/
- 動画: `vietnam_final_hq.mp4`

### 2. タイ採用チェックリスト（メイン開発対象）
- URL: https://kyujin.careerlink.asia/blog/thailand-recruitment-checklist-b2b/
- 複数バージョン作成

---

## 技術スタック

### 音声生成: VoiceVox
- **選定理由**: 日本語に特化した高品質TTS、無料、ローカル実行
- **インストール**: `winget install --id HiroshibaKazuyuki.VOICEVOX.CPU`
- **API**: REST API on `localhost:50021`
- **採用ボイス**: No.7 アナウンス (speaker id: 30)
- **速度**: 1.3倍速 (speedScale: 1.3)

#### 音声生成スクリプト
```
voicevox_generate.js - VoiceVox API呼び出し
voicevox_no7_1.3x.js - No.7ボイス、1.3倍速版
```

### 動画生成: Puppeteer + FFmpeg
- **選定理由**:
  - Remotionは Windows ARM64 で Chrome Headless Shell 非対応
  - Creatomate は無料枠で解像度制限 (270x480)
  - Puppeteer + 既存Edge ブラウザで高解像度レンダリング可能

- **ブラウザ**: Microsoft Edge (Chromium)
  - パス: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

- **FFmpeg**: winget経由でインストール
  - パス: `C:\Users\siank\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe`

### 動画仕様
- **解像度**: 1080 x 1920 (縦型、9:16)
- **フレームレート**: 30fps
- **コーデック**: H.264 (libx264)
- **音声**: AAC 128kbps
- **長さ**: 38秒

---

## バージョン履歴

### ベースライン版

| ファイル | サイズ | 特徴 |
|---------|-------|------|
| thailand_recruitment_hq.mp4 | 1.88 MB | 最初の高品質版、グラデーション背景 |

### Level 2 改善

#### v2: ストック画像背景
- **ファイル**: `thailand_v2_stockimages.mp4`
- **サイズ**: 1.82 MB
- **スクリプト**: `thailand_slides_v2.js`, `download_stock.js`
- **内容**: Pexelsから無料ストック画像をダウンロードし背景に使用
- **画像一覧**:
  - thailand_city.jpg - バンコク都市風景
  - business_meeting.jpg - ビジネスミーティング
  - office.jpg - オフィス
  - money.jpg - お金/金融
  - calendar.jpg - カレンダー
  - passport.jpg - パスポート/ビザ
  - warning.jpg - 警告
  - idea.jpg - アイデア/電球
  - phone.jpg - スマホ/CTA

#### v3: テキストアニメーション
- **ファイル**: `thailand_v3_animated.mp4`
- **サイズ**: 2.1 MB
- **スクリプト**: `thailand_animated.js`
- **内容**:
  - タイトル: フェードイン + スケールアップ
  - テキスト行: 順番にスライドアップ + フェードイン（0.15秒遅延）
  - イージング: ease-out `1 - Math.pow(1 - t, 3)`
- **フレーム数**: 1140フレーム (38秒 × 30fps)

#### v4: データビジュアライゼーション
- **ファイル**: `thailand_v4_dataviz.mp4`
- **サイズ**: 1.7 MB
- **スクリプト**: `thailand_dataviz.js`
- **内容**:
  - バーチャート: 給与比較 (100% vs 150%)
  - 折れ線グラフ: 給与上昇率 (2020-2024)
  - 円グラフ: 外国人雇用比率 (4:1)
  - プログレスバー: 試用期間、採用長期化
- **ユーザー評価**: 「今のところ一番いい」

#### v5: アイコンアニメーション
- **ファイル**: `thailand_v5_icons.mp4`
- **サイズ**: 2.1 MB
- **スクリプト**: `thailand_icons.js`
- **内容**: 各スライドにアニメーション付き絵文字アイコン
- **アニメーション種類**:
  - float: ふわふわ浮遊
  - bounce: バウンド
  - pulse: 拡大縮小パルス
  - glow: 発光エフェクト
  - spin: 回転
  - shake: 振動
  - flash: 点滅
  - heartbeat: ハートビート
  - ring: ベル振動
  - point: 上下指差し

#### v6: 強化版（v4ベース改良）
- **ファイル**: `thailand_v6_enhanced.mp4`
- **サイズ**: 2.7 MB
- **スクリプト**: `thailand_enhanced.js`
- **改良点**:
  1. スライドトランジション（フェード + スケールイン）
  2. 数字カウントアップアニメーション
  3. 折れ線グラフのダッシュ描画アニメーション
  4. カレンダースライド（ピーク時期カード形式）
  5. CTAスライド（パルスするボタン）
  6. 画面下部にプログレスインジケーター
  7. 控えめなアイコンアニメーション
  8. バーチャートに+50%比較表示
  9. 警告スライドのパルス効果

---

## スライド構成（タイ採用チェックリスト）

| # | タイトル | タイプ | 長さ |
|---|---------|-------|------|
| 1 | タイで人材採用 失敗していませんか？ | text | 4秒 |
| 2 | 採用前チェック 10項目を解説 | text | 4秒 |
| 3 | 日本語人材の給与 1.3〜1.5倍 | bar_chart | 5秒 |
| 4 | 給与上昇率 毎年5〜7%上昇 | line_chart | 4秒 |
| 5 | 転職ピーク時期 4月/12月〜1月 | calendar | 5秒 |
| 6 | 外国人雇用ルール タイ人4名:外国人1名 | pie_chart | 5秒 |
| 7 | 注意点 試用期間119日/採用長期化6ヶ月 | progress_bar | 5秒 |
| 8 | ポイント わからない項目＝相談すべき | text | 3秒 |
| 9 | 詳しくは概要欄！フォローで情報お届け | cta | 3秒 |

**合計**: 38秒

---

## ファイル一覧

### スクリプト
```
thailand_slides.js        - 基本版（グラデーション背景）
download_stock.js         - ストック画像ダウンローダー
thailand_slides_v2.js     - v2: ストック画像背景
thailand_animated.js      - v3: テキストアニメーション
thailand_dataviz.js       - v4: データビジュアライゼーション
thailand_icons.js         - v5: アイコンアニメーション
thailand_enhanced.js      - v6: 強化版
voicevox_generate.js      - VoiceVox音声生成
```

### 出力フォルダ
```
thailand_slides/          - 基本版フレーム
thailand_slides_v2/       - v2フレーム
thailand_animated/        - v3フレーム (1140枚)
thailand_dataviz/         - v4フレーム (1140枚)
thailand_icons/           - v5フレーム (1140枚)
thailand_enhanced/        - v6フレーム (1140枚)
stock_images/             - ストック画像
output/                   - 音声ファイル
```

### 最終動画
```
thailand_v4_dataviz.mp4   - 1.7 MB (推奨: シンプル版)
thailand_v6_enhanced.mp4  - 2.7 MB (推奨: フル機能版)
```

---

## 技術的な問題と解決策

### 1. Remotion Chrome Headless Shell エラー
- **問題**: "Chrome Headless Shell is not available for Windows for arm64 architecture"
- **解決**: Puppeteer-core + 既存Edge ブラウザを使用

### 2. Google Fonts タイムアウト
- **問題**: NavigationTimeout of 30000ms exceeded
- **解決**: ローカルシステムフォント使用 ('Yu Gothic UI', 'Meiryo')

### 3. PowerShell エンコーディング
- **問題**: 日本語テキストのhere-stringsがパースエラー
- **解決**: Node.jsスクリプトに移行

### 4. FFmpeg パス
- **問題**: wingetインストール後、PATHに追加されない
- **解決**: フルパス指定で実行

---

## FFmpeg コマンド例

```bash
ffmpeg -y \
  -framerate 30 \
  -i 'frame_%05d.png' \
  -i 'narration.wav' \
  -c:v libx264 \
  -preset medium \
  -crf 22 \
  -pix_fmt yuv420p \
  -c:a aac \
  -b:a 128k \
  -shortest \
  'output.mp4'
```

---

## 今後の改善案（Level 3）

1. **AIナレーター映像**: HeyGen、D-ID等でアバター動画生成
2. **自動字幕**: Whisperで音声認識 → 字幕オーバーレイ
3. **BGM追加**: フリー音源の自動選定・ミキシング
4. **サムネイル生成**: 各動画のサムネイル自動生成
5. **多言語対応**: 英語・ベトナム語・タイ語版の自動生成

---

## 参考リンク

- VoiceVox: https://voicevox.hiroshiba.jp/
- Puppeteer: https://pptr.dev/
- FFmpeg: https://ffmpeg.org/
- Pexels (ストック画像): https://www.pexels.com/

---

*最終更新: 2026年1月25日*
