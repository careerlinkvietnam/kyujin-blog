# CTAテンプレートライブラリ

**作成日**: 2026-01-25
**目的**: 記事へのCTA追加を標準化し、一貫したデザインと文言を維持する

---

## 目次

1. [求職者案内用CTA](#1-求職者案内用cta)（6パターン）
2. [人事担当者案内用CTA](#2-人事担当者案内用cta)（2パターン）
3. [人事担当者LP誘導用CTA](#3-人事担当者lp誘導用cta)（3パターン）
4. [配置ルール](#配置ルール)

---

## 1. 求職者案内用CTA

### 1-1. タイ用（jobseeker-thailand）

```html
<div class="cta-box cta-jobseeker-thailand" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">タイ転職への第一歩</h3>
<p style="margin: 16px 0;">タイの日系企業求人を多数掲載中。キャリアアドバイザーが転職をサポートします。</p>
<p><a href="https://kyujin.careerlink.asia/thailand/job/list" style="display: inline-block; background: #fff; color: #e85a1c; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">タイの求人を見る</a></p>
</div>
```

---

### 1-2. ベトナム用（jobseeker-vietnam）

```html
<div class="cta-box cta-jobseeker-vietnam" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">ベトナム転職への第一歩</h3>
<p style="margin: 16px 0;">ベトナムの日系企業求人を多数掲載中。キャリアアドバイザーが転職をサポートします。</p>
<p><a href="https://kyujin.careerlink.asia/vietnam/job/list" style="display: inline-block; background: #fff; color: #e85a1c; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">ベトナムの求人を見る</a></p>
</div>
```

---

### 1-3. インドネシア用（jobseeker-indonesia）

```html
<div class="cta-box cta-jobseeker-indonesia" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">インドネシア転職への第一歩</h3>
<p style="margin: 16px 0;">インドネシアの日系企業求人を掲載中。キャリアアドバイザーが転職をサポートします。</p>
<p><a href="https://kyujin.careerlink.asia/indonesia/job/list" style="display: inline-block; background: #fff; color: #e85a1c; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">インドネシアの求人を見る</a></p>
</div>
```

---

### 1-4. 東南アジア全体用（jobseeker-sea）

```html
<div class="cta-box cta-jobseeker-sea" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">東南アジア転職への第一歩</h3>
<p style="margin: 16px 0;">タイ・ベトナムを中心に東南アジアの日系企業求人を掲載中。キャリアアドバイザーが転職をサポートします。</p>
<p><a href="https://kyujin.careerlink.asia/job/list" style="display: inline-block; background: #fff; color: #e85a1c; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">求人を見る</a></p>
</div>
```

---

### 1-5. タイ用フル版（jobseeker-thailand-full）

求人一覧と会員登録の2つのボタンを持つ詳細版CTA。

```html
<div class="cta-box cta-jobseeker-thailand-full" style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
<h3 style="color: #fef08a; margin: 0 0 15px 0;">キャリアリンクリクルートメントタイランドでタイ転職を実現</h3>
<p style="margin: 0 0 20px 0; line-height: 1.8;">当社はバンコクに拠点を持ち、タイの日系企業求人を多数取り扱っています。現地在住の日本人コンサルタントが、求人紹介から入社後のフォローまでトータルでサポートいたします。</p>
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 20px;">
<a href="https://kyujin.careerlink.asia/thailand/job/list" style="display: inline-block; background: #fef08a; color: #1e40af; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">タイの求人一覧を見る</a>
<a href="https://kyujin.careerlink.asia/register" style="display: inline-block; background: white; color: #1e40af; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">無料会員登録はこちら</a>
</div>
</div>
```

---

### 1-6. ベトナム用フル版（jobseeker-vietnam-full）

求人一覧と会員登録の2つのボタンを持つ詳細版CTA。

```html
<div class="cta-box cta-jobseeker-vietnam-full" style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
<h3 style="color: #fef08a; margin: 0 0 15px 0;">キャリアリンクベトナムでベトナム転職を実現</h3>
<p style="margin: 0 0 20px 0; line-height: 1.8;">当社はホーチミン・ハノイに拠点を持ち、ベトナムの日系企業求人を多数取り扱っています。現地在住の日本人コンサルタントが、求人紹介から入社後のフォローまでトータルでサポートいたします。</p>
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 20px;">
<a href="https://kyujin.careerlink.asia/vietnam/job/list" style="display: inline-block; background: #fef08a; color: #1e40af; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">ベトナムの求人一覧を見る</a>
<a href="https://kyujin.careerlink.asia/register" style="display: inline-block; background: white; color: #1e40af; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">無料会員登録はこちら</a>
</div>
</div>
```

---

## 2. 人事担当者案内用CTA

### 2-1. タイ用（hr-thailand）

```html
<div class="cta-box cta-hr-thailand" style="background: #e8f4f8; border: 2px solid #0066cc; padding: 24px; margin: 30px 0; border-radius: 8px;">
<h3 style="margin-top: 0; margin-bottom: 12px; color: #004d99;">【企業の人事・採用担当者様へ】タイでの人材採用をサポートします</h3>
<p style="margin: 0 0 12px 0;">キャリアリンクリクルートメントタイランドは、タイの日系企業向け人材紹介サービスを提供しています。</p>
<ul style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.6;">
<li style="margin-bottom: 2px;">タイ人スタッフ・日本語人材の紹介</li>
<li style="margin-bottom: 2px;">タイで働きたい日本人の紹介</li>
<li style="margin-bottom: 2px;">現地の給与相場・採用市場のご案内</li>
</ul>
<p style="margin: 0 0 12px 0;"><strong>まずはお気軽にご相談ください。</strong></p>
<p style="margin: 0 0 8px 0;"><a href="https://kyujin.careerlink.asia/お問い合わせ" style="display: inline-block; background: #004d99; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: bold;">採用のご相談・お問い合わせ</a></p>
<p style="font-size: 0.9em; color: #666; margin: 0;">※初回相談無料・1〜2営業日以内に返信</p>
</div>
```

---

### 2-2. ベトナム用（hr-vietnam）

```html
<div class="cta-box cta-hr-vietnam" style="background: #e8f4f8; border: 2px solid #0066cc; padding: 24px; margin: 30px 0; border-radius: 8px;">
<h3 style="margin-top: 0; margin-bottom: 12px; color: #004d99;">【企業の人事・採用担当者様へ】ベトナムでの人材採用をサポートします</h3>
<p style="margin: 0 0 12px 0;">キャリアリンクベトナムは、ベトナムの日系企業向け人材紹介サービスを提供しています。</p>
<ul style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.6;">
<li style="margin-bottom: 2px;">ベトナム人スタッフ・日本語人材の紹介</li>
<li style="margin-bottom: 2px;">ベトナムで働きたい日本人の紹介</li>
<li style="margin-bottom: 2px;">現地の給与相場・採用市場のご案内</li>
</ul>
<p style="margin: 0 0 12px 0;"><strong>まずはお気軽にご相談ください。</strong></p>
<p style="margin: 0 0 8px 0;"><a href="https://kyujin.careerlink.asia/お問い合わせ" style="display: inline-block; background: #004d99; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: bold;">採用のご相談・お問い合わせ</a></p>
<p style="font-size: 0.9em; color: #666; margin: 0;">※初回相談無料・1〜2営業日以内に返信</p>
</div>
```

---

## 3. 人事担当者LP誘導用CTA

### 3-1. タイLP誘導用（lp-thailand）

```html
<div class="cta-box cta-lp-thailand" style="background: linear-gradient(135deg, #004d99 0%, #0066cc 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">タイでの採用、判断材料が足りていますか？</h3>
<p style="margin: 16px 0;">採用難易度・給与相場・採用期間の目安を<strong>無料</strong>でお伝えします。</p>
<p><a href="https://kyujin.careerlink.asia/blog/thailand-recruitment-consulting/" style="display: inline-block; background: #fff; color: #004d99; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">タイ採用の無料相談ページへ</a></p>
<p style="font-size: 0.85em; opacity: 0.9; margin-bottom: 0;">※相談無料・秘密厳守・1〜2営業日以内に返信</p>
</div>
```

---

### 3-2. ベトナムLP誘導用（lp-vietnam）

```html
<div class="cta-box cta-lp-vietnam" style="background: linear-gradient(135deg, #004d99 0%, #0066cc 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">ベトナムでの採用、判断材料が足りていますか？</h3>
<p style="margin: 16px 0;">採用難易度・給与相場・採用期間の目安を<strong>無料</strong>でお伝えします。</p>
<p><a href="https://kyujin.careerlink.asia/blog/vietnam-recruitment-consulting/" style="display: inline-block; background: #fff; color: #004d99; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">ベトナム採用の無料相談ページへ</a></p>
<p style="font-size: 0.85em; opacity: 0.9; margin-bottom: 0;">※相談無料・秘密厳守・1〜2営業日以内に返信</p>
</div>
```

---

### 3-3. 東南アジア全体LP誘導用（lp-sea）

```html
<div class="cta-box cta-lp-sea" style="background: linear-gradient(135deg, #004d99 0%, #0066cc 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">東南アジアでの採用、判断材料が足りていますか？</h3>
<p style="margin: 16px 0;">採用難易度・給与相場・採用期間の目安を<strong>無料</strong>でお伝えします。</p>
<p><a href="https://kyujin.careerlink.asia/blog/b2b-recruitment-consulting/" style="display: inline-block; background: #fff; color: #004d99; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">採用の無料相談ページへ</a></p>
<p style="font-size: 0.85em; opacity: 0.9; margin-bottom: 0;">※相談無料・秘密厳守・1〜2営業日以内に返信</p>
</div>
```

---

## 配置ルール

### CTA数（記事の長さ別）

| 記事の長さ | CTA数 | 配置位置 |
|-----------|-------|----------|
| 長い（1万字以上） | **3個** | 10-20%地点、50%地点、末尾（関連記事・出典の前） |
| 中規模 | **2個** | 中段、末尾（関連記事・出典の前） |
| 短い | **1個** | 末尾（関連記事・出典の前） |

### 配置の原則

| 項目 | ルール |
|------|--------|
| 連続配置 | **禁止**（2つのCTAが連続で並ばない） |
| 配置位置 | 判断完了地点の直後、またはセクションの切れ目 |
| 末尾CTA | 必ず**関連記事・出典の前**に配置 |

### 長い記事（1万字以上）の配置目安

| 位置 | 配置場所 |
|------|----------|
| 1つ目（10-20%） | 導入・概要セクション終了後の切りのいいところ |
| 2つ目（50%） | 本文中盤、主要セクション終了後の切りのいいところ |
| 3つ目（末尾） | 関連記事・出典の直前 |

### 記事タイプ別の推奨CTA

| 記事タイプ | 推奨CTA | 配置 |
|-----------|---------|------|
| タイ関連B2B記事 | lp-thailand | 末尾 |
| ベトナム関連B2B記事 | lp-vietnam | 末尾 |
| タイ関連求職者記事 | jobseeker-thailand | 末尾 |
| ベトナム関連求職者記事 | jobseeker-vietnam | 末尾 |
| 東南アジア全般記事（B2B） | hr-thailand または hr-vietnam | 末尾 |
| 東南アジア全般記事（求職者） | jobseeker-sea | 末尾 |

### B2Bと求職者CTAの共存

同一記事にB2B CTAと求職者CTAを配置する場合：

1. **B2B CTAを上に配置**（優先）
2. **求職者CTAを下に配置**
3. 両方合わせて最大2個

---

## クラス名一覧

| # | カテゴリ | クラス名 | 用途 |
|---|----------|----------|------|
| 1 | 求職者 | `cta-jobseeker-thailand` | タイ求職者向け（シンプル版） |
| 2 | 求職者 | `cta-jobseeker-vietnam` | ベトナム求職者向け（シンプル版） |
| 3 | 求職者 | `cta-jobseeker-indonesia` | インドネシア求職者向け |
| 4 | 求職者 | `cta-jobseeker-sea` | 東南アジア全体求職者向け |
| 5 | 求職者 | `cta-jobseeker-thailand-full` | タイ求職者向け（2ボタン版） |
| 6 | 求職者 | `cta-jobseeker-vietnam-full` | ベトナム求職者向け（2ボタン版） |
| 7 | 人事案内 | `cta-hr-thailand` | タイ人事担当者向け |
| 8 | 人事案内 | `cta-hr-vietnam` | ベトナム人事担当者向け |
| 9 | LP誘導 | `cta-lp-thailand` | タイLP誘導 |
| 10 | LP誘導 | `cta-lp-vietnam` | ベトナムLP誘導 |
| 11 | LP誘導 | `cta-lp-sea` | 東南アジア全体LP誘導 |

---

## デザイン仕様

### 求職者CTA シンプル版（オレンジ系）
- 背景: `linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)`
- テキスト: 白
- ボタン: 白背景、オレンジ文字（#e85a1c）

### 求職者CTA フル版（明るい青系）
- 背景: `linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)`
- テキスト: 白
- 見出し: 明るい黄色（#fef08a）
- ボタン1: 黄色背景、青文字（#1e40af）- 求人一覧
- ボタン2: 白背景、青文字（#1e40af）- 会員登録

### 人事担当者案内CTA（薄い青）
- 背景: `#e8f4f8`
- 枠線: `2px solid #0066cc`
- テキスト: 紺（#004d99）
- ボタン: 紺背景、白文字

### LP誘導CTA（青グラデーション）
- 背景: `linear-gradient(135deg, #004d99 0%, #0066cc 100%)`
- テキスト: 白
- ボタン: 白背景、紺文字（#004d99）

---

## レガシーCTA（置換対象）

以下は古い形式のCTAパターンです。見つけた場合は新しい標準CTAに置換してください。

### レガシーパターン1: ベトナム赤ボックス

**識別キーワード**: `ベトナムで働くことに興味はありませんか`, `#da251d`, `#fff5f5`

```html
<h2>ベトナムの求人を探すなら</h2>
<p>キャリアリンクアジアでは、ホーチミン・ハノイを中心にベトナム全土の日本人向け求人を多数掲載しています。</p>
<div style="background-color: #fff5f5; border: 2px solid #da251d; border-radius: 10px; padding: 20px; margin: 30px 0;">
<h3 style="color: #da251d; margin-top: 0;">ベトナムで働くことに興味はありませんか？</h3>
<p>IT、製造業、営業、通訳など、様々な職種の求人を掲載しています。まずは求人情報をチェックしてみてください。</p>
<p style="margin-bottom: 0;"><strong><a href="https://kyujin.careerlink.asia/vietnam/job/list" style="color: #da251d;">▶ ベトナムの求人一覧を見る</a></strong></p>
<p style="margin-bottom: 0;"><strong><a href="https://kyujin.careerlink.asia/register" style="color: #da251d;">▶ 無料会員登録はこちら</a></strong></p>
</div>
```

**置換先**: `cta-jobseeker-vietnam-full`（1-6）

---

### レガシーパターン2: タイ青ボックス（要確認）

**識別キーワード**: `タイで働くことに興味はありませんか`, `#1e3a5f`, `#ffd700`

**置換先**: `cta-jobseeker-thailand-full`（1-5）

---

### レガシーパターン3: 東南アジア進出B2B

**識別キーワード**: `東南アジア進出・人材採用のご相談`, `キャリアリンクアジアでは、東南アジアへの進出・投資`

```html
<h3>東南アジア進出・人材採用のご相談</h3>
<p>キャリアリンクアジアでは、東南アジアへの進出・投資をご検討の企業様をサポートしています。</p>
<ul>
<li>20年以上の東南アジアでの事業実績</li>
<li>ベトナム・タイに現地オフィス</li>
<li>人材採用のフルサポート</li>
<li>現地の最新情報のご提供</li>
</ul>
<p><a href="...">お問い合わせはこちら</a></p>
```

**置換先**: `cta-lp-sea`（3-3）または国別LP誘導CTA

---

### レガシーパターン4: ベトナム人事担当者向け（CareerLink Asia名義）

**識別キーワード**: `ベトナムで採用をお考えの人事担当者様へ`, `CareerLink Asiaでは、ベトナムでの人材採用をサポート`

```html
<h3>ベトナムで採用をお考えの人事担当者様へ</h3>
<p>CareerLink Asiaでは、ベトナムでの人材採用をサポートしています。日本人・ベトナム人の採用、労務管理のご相談はお気軽にどうぞ。</p>
<a href="...">採用のご相談</a>
<a href="...">ベトナムの求人を見る</a>
```

**置換先**: `cta-hr-vietnam`（2-2）または `cta-lp-vietnam`（3-2）

---

### レガシーパターン5: 専門家にご相談ください（東南アジアB2B）

**識別キーワード**: `専門家にご相談ください`, `キャリアリンクアジアでは、東南アジアでのビジネス展開をサポート`

```html
<h3>専門家にご相談ください</h3>
<p>キャリアリンクアジアでは、東南アジアでのビジネス展開をサポートしています。人材採用についてお気軽にお問い合わせください。</p>
<a href="...">お問い合わせはこちら</a>
```

**置換先**: `cta-lp-sea`（3-3）または国別LP誘導CTA

---

### レガシーパターン6: cta-light（タイ・ベトナム相談）

**識別キーワード**: `cta-box cta-light`, `タイ・ベトナムでの採用についてご相談いただけます`

```html
<div class="cta-box cta-light" style="background: #f8f9fa; border-left: 4px solid #0066cc; ...">
<h3>タイ・ベトナムでの採用についてご相談いただけます</h3>
...
</div>
```

**置換先**: `cta-lp-vietnam`（3-2）または `cta-lp-thailand`（3-1）

---

### レガシーパターン7: cta-standard（タイ・ベトナム人事向け）

**識別キーワード**: `cta-box cta-standard`, `【企業の人事・採用担当者様へ】タイ・ベトナムの人材採用をサポート`

```html
<div class="cta-box cta-standard" style="background: #e8f4f8; border: 2px solid #0066cc; ...">
<h3>【企業の人事・採用担当者様へ】タイ・ベトナムの人材採用をサポートします</h3>
...
</div>
```

**置換先**: `cta-hr-vietnam`（2-2）または `cta-hr-thailand`（2-1）

---

## レガシーCTA検索コマンド

```bash
# ベトナムレガシーCTAを含む記事を検索
node -e "const posts = JSON.parse(require('fs').readFileSync('backup_2026-01-25/all_posts_backup.json')); posts.filter(p => (p.content.raw||'').includes('ベトナムで働くことに興味はありませんか')).forEach(p => console.log(p.id, p.title.rendered));"

# タイレガシーCTAを含む記事を検索
node -e "const posts = JSON.parse(require('fs').readFileSync('backup_2026-01-25/all_posts_backup.json')); posts.filter(p => (p.content.raw||'').includes('タイで働くことに興味はありませんか')).forEach(p => console.log(p.id, p.title.rendered));"
```

---

**最終更新**: 2026-01-25（レガシーCTAパターン追加）
