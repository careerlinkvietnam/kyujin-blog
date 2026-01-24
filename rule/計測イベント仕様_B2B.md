# B2B計測イベント仕様

## 概要
B2B問い合わせ獲得のためのCVファネル計測仕様。
Google Analytics 4 (GA4) を前提とし、GTM経由で実装。

---

## 1. CTAクリック計測

### イベント名
`cta_click`

### 発火条件
- `.cta-box a` または `a[href*="お問い合わせ"]` のクリック時

### パラメータ

| パラメータ名 | 型 | 値の例 | 説明 |
|-------------|-----|--------|------|
| `article_id` | string | "6992" | 記事ID（WordPressのpost ID） |
| `country` | string | "thailand" / "vietnam" / "general" | 対象国 |
| `article_type` | string | "専門性証明" / "信頼構築" / "集客" / "補助" | 記事タイプ |
| `cta_strength` | string | "light" / "standard" / "strong" | CTA強度 |
| `cta_position` | string | "hero" / "middle" / "bottom" / "sidebar" | CTAの配置位置 |
| `cta_text` | string | "採用のご相談はこちら" | ボタンテキスト |

### GTM設定例
```javascript
// トリガー: Click - All Elements
// 条件: Click Element matches CSS selector ".cta-box a, a[href*='お問い合わせ']"

// タグ: GA4 Event
{
  event_name: "cta_click",
  article_id: {{DL - Article ID}},
  country: {{DL - Country}},
  article_type: {{DL - Article Type}},
  cta_strength: {{DL - CTA Strength}},
  cta_position: {{DL - CTA Position}},
  cta_text: {{Click Text}}
}
```

---

## 2. フォーム到達計測

### イベント名
`form_view`

### 発火条件
- `/お問い合わせ` ページのページビュー時
- `page_location` に `/お問い合わせ` を含む

### パラメータ

| パラメータ名 | 型 | 値の例 | 説明 |
|-------------|-----|--------|------|
| `referrer_article_id` | string | "6992" | 流入元記事ID |
| `referrer_country` | string | "thailand" | 流入元記事の国 |
| `referrer_article_type` | string | "専門性証明" | 流入元記事タイプ |
| `referrer_cta_strength` | string | "strong" | クリックしたCTAの強度 |

### 実装方法
CTAリンクにUTMパラメータまたはカスタムクエリを付与：
```
https://kyujin.careerlink.asia/お問い合わせ?ref_id=6992&ref_country=thailand&ref_type=専門性証明&ref_cta=strong
```

---

## 3. フォーム送信完了計測

### イベント名
`form_submit`

### 発火条件
- お問い合わせフォーム送信成功時
- サンクスページ到達、またはフォームsubmitイベント

### パラメータ

| パラメータ名 | 型 | 値の例 | 説明 |
|-------------|-----|--------|------|
| `referrer_article_id` | string | "6992" | 流入元記事ID |
| `referrer_country` | string | "thailand" | 流入元記事の国 |
| `referrer_article_type` | string | "専門性証明" | 流入元記事タイプ |
| `referrer_cta_strength` | string | "strong" | クリックしたCTAの強度 |
| `inquiry_type` | string | "recruitment" / "other" | 問い合わせ種別（取得可能な場合） |

---

## 4. データレイヤー設計

各記事ページで以下のデータレイヤーを出力：

```html
<script>
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'article_id': '6992',
  'country': 'thailand',
  'article_type': '専門性証明',
  'page_category': 'blog'
});
</script>
```

### WordPress実装例（functions.phpまたはテーマヘッダー）
```php
<?php
// 記事ページでデータレイヤーを出力
if (is_single()) {
    $post_id = get_the_ID();
    $country = get_post_meta($post_id, 'country', true) ?: 'general';
    $article_type = get_post_meta($post_id, 'article_type', true) ?: 'other';
    ?>
    <script>
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'article_id': '<?php echo $post_id; ?>',
        'country': '<?php echo esc_js($country); ?>',
        'article_type': '<?php echo esc_js($article_type); ?>'
    });
    </script>
    <?php
}
?>
```

---

## 5. CTA強度の判定ロジック

CTAのクラス名で強度を判定：

| クラス名 | CTA強度 |
|---------|---------|
| `.cta-light` | light |
| `.cta-standard` | standard |
| `.cta-strong` | strong |

GTM変数（Custom JavaScript）:
```javascript
function() {
  var el = {{Click Element}};
  var ctaBox = el.closest('.cta-box');
  if (!ctaBox) return 'unknown';
  if (ctaBox.classList.contains('cta-light')) return 'light';
  if (ctaBox.classList.contains('cta-standard')) return 'standard';
  if (ctaBox.classList.contains('cta-strong')) return 'strong';
  return 'unknown';
}
```

---

## 6. 主要記事の計測パラメータ一覧

| 記事ID | 国 | 記事タイプ | 備考 |
|--------|-----|-----------|------|
| 6992 | thailand | 専門性証明 | タイ人材紹介会社一覧 |
| 6804 | vietnam | 専門性証明 | ベトナム人材紹介会社一覧 |
| 7721 | thailand | 信頼構築 | タイ転職ハブ（二面） |
| 7726 | vietnam | 信頼構築 | ベトナム転職ハブ（二面） |
| 8563 | thailand | 専門性証明 | タイ人材採用ガイドB2B |
| 8564 | vietnam | 専門性証明 | ベトナム人材採用ガイドB2B |
| 7739 | general | 集客 | 海外エージェントハブ |

---

## 7. レポート・ダッシュボード設計

### 主要KPI
1. **CTA CTR** = cta_click / page_view（記事別）
2. **フォーム到達率** = form_view / cta_click
3. **CV率** = form_submit / form_view
4. **全体CVR** = form_submit / page_view（記事別）

### 推奨セグメント
- 国別（thailand / vietnam / general）
- 記事タイプ別（専門性証明 / 信頼構築 / 集客 / 補助）
- CTA強度別（light / standard / strong）
- 流入経路別（organic / referral / direct）

---

## 8. 実装優先度

| 優先度 | 項目 | 理由 |
|--------|------|------|
| P0 | form_submit | CV直接計測 |
| P0 | form_view | ファネル可視化 |
| P1 | cta_click | 記事効果測定 |
| P2 | データレイヤー | セグメント分析 |

---

最終更新: 2026-01-24
