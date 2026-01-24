# CTA注入プレビュー（ユーザー承認用）
## 作成日: 2026-01-16

---

## 1. 現状分析結果

### 発見事項

調査の結果、対象10記事すべてに**既存のCTAが存在**していることが判明しました。

| 項目 | 状況 |
|------|------|
| 既存CTA | あり（サイドバー/テンプレート） |
| CTAタイプ | 汎用的（「求職者登録で最新求人情報をゲット」） |
| 国別カスタマイズ | なし |
| 記事本文内CTA | なし |

### 既存CTAの特徴

現在のCTAは以下のような**汎用的なテンプレート型**です：

```
「求職者登録（無料）をして最新求人情報をゲットしよう！」
- 定期的（隔週）に東南アジアの最新求人情報を配信
- 希望者には無料で就職相談を実施
```

**問題点**:
- 記事の内容（ベトナム観光・マレーシア生活情報等）と直接関連していない
- サイドバー/フッターにあるため、本文を読んだ後の自然な導線になっていない
- 国や読者層に合わせたカスタマイズがない

---

## 2. 改善提案

### 提案内容

**記事本文内に、文脈に沿った国別CTAを追加**

| 現状 | 提案後 |
|------|--------|
| サイドバーに汎用CTA | サイドバーCTA + 本文内CTA |
| 記事との関連性なし | 記事の国・テーマに合わせたCTA |
| 1種類のCTA | 3パターンのCTA（中盤・末尾・関連記事） |

### 期待効果

```
現状（推定）:
- サイドバーCTA クリック率: 0.3-0.5%
- 月間CTAクリック: 28-47件（9,374クリック × 0.3-0.5%）

改善後（試算）:
- 本文内CTA クリック率: 1-3%（文脈に沿っているため高い）
- 月間CTAクリック: 94-281件
- 追加登録数: 9-28件/月
```

---

## 3. 具体的な変更内容

### 対象記事 1: ハノイ・ロッテマート（月間1,557クリック）

**追加するCTA（パターンA: 記事中盤）**

2番目のH2タグ「「ランファーム」製品」の直前に挿入：

```html
<div style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 20px; margin: 30px 0;">
  <p style="font-weight: bold; margin-bottom: 10px;">ベトナムで働くことに興味はありますか？</p>
  <p style="margin-bottom: 15px;">現地の生活情報を調べているあなたへ。「働く」という選択肢も検討してみませんか？</p>
  <p><a href="https://kyujin.careerlink.asia/vietnam/job/list" style="color: #007bff; text-decoration: underline;">→ ベトナムの最新求人を見る</a></p>
</div>
```

**追加するCTA（パターンB: 記事末尾）**

記事最後に挿入：

```html
<div style="background: #e8f4fd; padding: 25px; margin-top: 40px; border-radius: 8px;">
  <h3 style="margin-top: 0;">ベトナムでの就職・転職をお考えの方へ</h3>
  <p>キャリアリンクアジアでは、ベトナムの日系企業求人を多数ご紹介しています。</p>
  <ul>
    <li>20年以上の実績</li>
    <li>現地スタッフによるサポート</li>
    <li>非公開求人多数</li>
  </ul>
  <p style="margin-bottom: 0;">
    <a href="https://kyujin.careerlink.asia/jobseeker/register" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">無料会員登録はこちら</a>
  </p>
</div>
```

**追加する関連記事リンク（パターンC）**

```html
<div style="border: 1px solid #ddd; padding: 20px; margin-top: 30px;">
  <h4 style="margin-top: 0;">あわせて読みたい</h4>
  <ul style="margin-bottom: 0;">
    <li><a href="https://kyujin.careerlink.asia/blog/vietnam-japanese-company-guide/">【完全ガイド】ベトナムの日系企業で働く方法</a></li>
    <li><a href="https://kyujin.careerlink.asia/blog/overseas-job-40s-guide/">40代からの海外転職ガイド</a></li>
    <li><a href="https://kyujin.careerlink.asia/vietnam/job/list">ベトナムの最新求人一覧</a></li>
  </ul>
</div>
```

---

### 対象記事 2: マレーシアの郵便番号（月間1,404クリック）

**追加するCTA（パターンA: 記事中盤）**

2番目のH2タグ「マレーシア・16行政地区の郵便番号リスト」の直前に挿入：

```html
<div style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 20px; margin: 30px 0;">
  <p style="font-weight: bold; margin-bottom: 10px;">マレーシアで働くことに興味はありますか？</p>
  <p style="margin-bottom: 15px;">現地の生活情報を調べているあなたへ。「働く」という選択肢も検討してみませんか？</p>
  <p><a href="https://kyujin.careerlink.asia/malaysia/job/list" style="color: #007bff; text-decoration: underline;">→ マレーシアの最新求人を見る</a></p>
</div>
```

**追加するCTA（パターンB: 記事末尾）**

```html
<div style="background: #e8f4fd; padding: 25px; margin-top: 40px; border-radius: 8px;">
  <h3 style="margin-top: 0;">マレーシアでの就職・転職をお考えの方へ</h3>
  <p>キャリアリンクアジアでは、マレーシアの日系企業求人を多数ご紹介しています。</p>
  <ul>
    <li>20年以上の実績</li>
    <li>現地スタッフによるサポート</li>
    <li>非公開求人多数</li>
  </ul>
  <p style="margin-bottom: 0;">
    <a href="https://kyujin.careerlink.asia/jobseeker/register" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">無料会員登録はこちら</a>
  </p>
</div>
```

---

### 対象記事 3: ベトナムの郵便番号（月間1,294クリック）

**国判定**: ベトナム
**求人ページURL**: https://kyujin.careerlink.asia/vietnam/job/list

CTAパターンはハノイ・ロッテマートと同様（ベトナム用）

---

### 残り7記事の対応

| 記事 | クリック | 国判定 | 求人ページURL |
|------|---------|--------|--------------|
| ハノイイオンモール | 895 | ベトナム | /vietnam/job/list |
| パソコンでベトナム語入力 | 859 | ベトナム | /vietnam/job/list |
| ブンチャーハノイ | 737 | ベトナム | /vietnam/job/list |
| ハノイのお土産 | 679 | ベトナム | /vietnam/job/list |
| ホーチミンイオンモール | 667 | ベトナム | /vietnam/job/list |
| Grabの使い方 | 666 | 東南アジア | /job/list |
| ベトナムのお土産 | 616 | ベトナム | /vietnam/job/list |

上記7記事についても、同様のパターンでCTAを注入します。

---

## 4. 実行計画

### Step 1: テスト実行（1記事）
最初にハノイ・ロッテマート記事のみを更新し、効果を検証

### Step 2: 効果測定（1週間）
- CTAクリック数をGA/GTMで計測
- 問題がないことを確認

### Step 3: 残り9記事への展開
テスト結果を踏まえて残りの記事を更新

---

## 5. 安全対策

- [x] バックアップ取得（更新前の記事内容を保存）
- [x] リンク先URL検証済み
- [ ] ユーザー承認（本ファイルによる確認）
- [ ] WordPress API認証テスト

---

## 6. 承認確認

以下の変更を実行してよろしいですか？

**実行内容**:
1. ハノイ・ロッテマート記事にCTAを3箇所追加（中盤、末尾、関連記事）
2. 効果測定後、残り9記事にも同様のCTAを追加

**期待効果**:
- 月間9-28件の追加会員登録（保守的試算）

---

*プレビュー作成日: 2026年1月16日*
*作成者: Claude Code*
