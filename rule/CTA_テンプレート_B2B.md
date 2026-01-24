# B2B CTAテンプレートライブラリ

**作成日**: 2026-01-24
**目的**: 企業人事担当者からの求人依頼を自然に誘導するためのCTA標準化

---

## CTAテンプレート一覧

### 1. Light（軽めのCTA）
**用途**: 集客記事・補助記事向け。押し売り感を避け、相談"可能"を伝える。

```html
<div class="cta-box cta-light" style="background: #f8f9fa; border-left: 4px solid #0066cc; padding: 20px; margin: 30px 0;">
<h3 style="margin-top: 0; color: #0066cc;">タイ・ベトナムでの採用についてご相談いただけます</h3>
<p>CareerLink Asiaでは、東南アジアでの人材採用に関するご相談を承っております。</p>
<ul>
<li>現地の採用市場・給与相場について知りたい</li>
<li>採用プロセスや必要書類を確認したい</li>
<li>まずは情報収集から始めたい</li>
</ul>
<p><a href="https://kyujin.careerlink.asia/お問い合わせ" style="display: inline-block; background: #0066cc; color: #fff; padding: 10px 24px; text-decoration: none; border-radius: 4px;">お問い合わせはこちら</a></p>
<p style="font-size: 0.9em; color: #666; margin-bottom: 0;">※ご相談は無料です。お気軽にお問い合わせください。</p>
</div>
```

---

### 2. Standard（標準CTA）
**用途**: 信頼構築記事・専門性証明記事向け。相談を"推奨"するレベル。

```html
<div class="cta-box cta-standard" style="background: #e8f4f8; border: 2px solid #0066cc; padding: 24px; margin: 30px 0; border-radius: 8px;">
<h3 style="margin-top: 0; color: #004d99;">【企業の人事・採用担当者様へ】タイ・ベトナムの人材採用をサポートします</h3>
<p>CareerLink Asiaは、タイ・ベトナムを中心とした東南アジアの日系企業向け人材紹介サービスを提供しています。</p>
<ul>
<li>現地採用の求人票作成・掲載</li>
<li>候補者のスクリーニング・面接調整</li>
<li>給与相場・労務に関するアドバイス</li>
<li>入社後のビザ・労働許可証取得サポート</li>
</ul>
<p><strong>まずはお気軽にご相談ください。</strong></p>
<p><a href="https://kyujin.careerlink.asia/お問い合わせ" style="display: inline-block; background: #004d99; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: bold;">採用のご相談・お問い合わせ</a></p>
<p style="font-size: 0.9em; color: #666; margin-bottom: 0;">※初回ご相談無料。通常1〜2営業日以内にご返信いたします。</p>
</div>
```

---

### 3. Strong（強めのCTA）
**用途**: 問い合わせ直前記事向け。明確に相談を促す。

```html
<div class="cta-box cta-strong" style="background: linear-gradient(135deg, #004d99 0%, #0066cc 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px;">
<h3 style="margin-top: 0; color: #fff;">タイ・ベトナムでの人材採用、今すぐご相談ください</h3>
<p>CareerLink Asiaは、東南アジア専門の人材紹介会社として15年以上の実績があります。</p>
<ul style="color: #fff;">
<li>✓ タイ・ベトナム現地法人での即戦力採用</li>
<li>✓ 日本語人材・バイリンガル人材の紹介</li>
<li>✓ 採用から入社後フォローまで一貫サポート</li>
<li>✓ 現地の労務・給与相場に精通したコンサルタント</li>
</ul>
<p style="font-size: 1.1em;"><strong>採用課題をお聞かせください。最適な人材をご紹介します。</strong></p>
<p><a href="https://kyujin.careerlink.asia/お問い合わせ" style="display: inline-block; background: #fff; color: #004d99; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">無料相談を申し込む</a></p>
<p style="font-size: 0.85em; opacity: 0.9; margin-bottom: 0;">※秘密厳守。採用が決定するまで費用は発生しません。</p>
</div>
```

---

## 配置ルール

| 記事タイプ | 中段CTA | 末尾CTA | 備考 |
|-----------|--------|--------|------|
| 信頼構築（労務/給与/採用実務） | Light | Standard | 中段は控えめに |
| 専門性証明（一次情報/比較/深掘り） | Standard | Standard | 両方しっかり |
| 問い合わせ直前（人材紹介一覧等） | Standard | Strong | 末尾で強く |
| 補助（生活/文化/観光） | なし | Light | 押し売り禁止 |
| 集客（ロングテール） | なし | Light | 回遊優先 |

---

## 求職者CTAとの共存ルール

B2B記事に求職者CTAが既存する場合：

1. **B2B CTAを上に配置**（優先）
2. **求職者CTAは下に降格**
3. 見出しで明確に分離：「企業の採用担当者様へ」「転職をお考えの方へ」

```html
<!-- B2B CTA（上） -->
<div class="cta-box cta-standard">
  ...（B2B向け内容）...
</div>

<!-- 求職者CTA（下） -->
<div class="cta-box cta-jobseeker" style="background: #fff8e6; border-left: 4px solid #ff9900; padding: 20px; margin: 30px 0;">
<h3 style="margin-top: 0; color: #cc7700;">タイ・ベトナムへの転職をお考えの方へ</h3>
<p>CareerLink Asiaでは、東南アジアでの転職をサポートしています。</p>
<p><a href="https://kyujin.careerlink.asia/jobseeker/register" style="display: inline-block; background: #ff9900; color: #fff; padding: 10px 24px; text-decoration: none; border-radius: 4px;">無料会員登録はこちら</a></p>
</div>
```

---

## 信頼補強ブロック（記事末尾用）

```html
<div class="article-meta" style="background: #f5f5f5; padding: 16px; margin: 30px 0; border-radius: 4px; font-size: 0.9em;">
<p style="margin: 0 0 8px 0;"><strong>最終確認日</strong>: 2026-01-24</p>
<p style="margin: 0 0 8px 0;"><strong>参照情報</strong>:</p>
<ul style="margin: 0 0 8px 0; padding-left: 20px;">
<li>タイ労働省公式サイト</li>
<li>タイ社会保険事務所</li>
<li>在タイ日本国大使館</li>
</ul>
<p style="margin: 0;"><strong>更新履歴</strong>: 2026年1月の法改正情報を反映。CTA・内部リンクを追加。</p>
</div>
```

---

## 使用上の注意

1. **認証情報の露出禁止**: API認証情報はログ・コミットに含めない
2. **URL出力制限**: 変更対象URLは本ファイル外に出力しない
3. **一次情報未確認の記事**: 強CTAは避け、Lightに留める
4. **押し売り禁止**: 補助記事では回遊を優先し、CTAは控えめに
