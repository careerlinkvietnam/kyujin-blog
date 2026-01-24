# 内部リンク戦略 - 2026-01-22

## 実施結果サマリー

<div style="background: #e8f5e9; border: 2px solid #2e7d32; border-radius: 8px; padding: 15px; margin: 15px 0;">

**Phase 1+2 完了**: 2026-01-22

| 指標 | Before | After | 改善 |
|------|--------|-------|------|
| 内部リンク0件 | **147件** | **8件** | **-139件（95%削減）** |
| 内部リンク1-2件 | 62件 | 154件 | +92件 |
| 内部リンク3件以上 | **88件** | **135件** | **+47件（53%増加）** |

**処理記事数**: 144記事
**追加リンク数**: 377リンク

</div>

---

## リンク構造設計

### ピラーコンテンツ（ハブ記事）

| 国 | ハブ記事ID | スラッグ | リンク先 |
|----|-----------|---------|---------|
| タイ | 7721 | thailand-job-complete-guide | 都市別、ビザ、労働法、生活費、人材会社 |
| ベトナム | 7726 | vietnam-job-complete-guide | 都市別、ビザ、労働法、生活費、人材会社 |
| 海外全般 | 7739 | overseas-job-agent-comparison | 各国転職ガイド、給与ガイド |
| 海外給与 | 7720 | overseas-salary | 各国転職ガイド |

### タイ関連記事のリンクマップ

```
thailand-job-complete-guide (7721) [ハブ]
├── bangkok-job-guide (7734)
├── thailand-job-japanese-guide (7710)
├── thailand-bangkok-living-cost (7676)
├── thailand-visa-work-permit-guide-2026 (8005)
├── thailand-labor-law-employer-guide-2025 (8008)
├── thailand-minimum-wage-guide-2025 (7997)
└── thailand-recruitment-agencies-2026 (6992)
    └── 生活記事、ホテル記事 → ハブ(7721)と生活費(7676)へ
```

### ベトナム関連記事のリンクマップ

```
vietnam-job-complete-guide (7726) [ハブ]
├── hanoi-job-guide (7737)
├── hochiminh-job-guide (7735)
├── vietnam-japanese-company-guide (7702)
├── vietnam-living-cost-guide (7715)
├── vietnam-labor-law-employer-guide-2026 (7998)
├── vietnam-minimum-wage-2026 (7995)
└── vietnam-recruitment-agencies-2026 (6804)
    └── 生活記事、ホテル記事 → ハブ(7726)と生活費(7715)へ
```

### 他国記事のリンク先

| 記事タイプ | リンク先 |
|-----------|---------|
| フィリピン、インドネシア、シンガポール、マレーシア記事 | overseas-job-agent-comparison (7739)、overseas-salary (7720) |
| 他国ホテルガイド | overseas-job-agent-comparison (7739)、overseas-salary (7720) |

---

## 実装完了記事一覧

### Phase 1: 主要転職記事（16記事、72リンク）

| # | ID | スラッグ | 追加リンク数 |
|---|-----|---------|------------|
| 1 | 7721 | thailand-job-complete-guide | 7件 |
| 2 | 7726 | vietnam-job-complete-guide | 7件 |
| 3 | 7734 | bangkok-job-guide | 5件 |
| 4 | 7737 | hanoi-job-guide | 5件 |
| 5 | 7735 | hochiminh-job-guide | 5件 |
| 6 | 6992 | thailand-recruitment-agencies-2026 | 4件 |
| 7 | 6804 | vietnam-recruitment-agencies-2026 | 4件 |
| 8 | 7739 | overseas-job-agent-comparison | 4件 |
| 他8件 | ビザ・労働法・生活費等 | 各3-4件 |

### Phase 2 Batch 1: Job/Career + B2B記事（51記事、151リンク）

- overseas-job-sales-guide, overseas-job-merit-demerit 等のJob/Career記事
- thailand/vietnam-personal-income-tax-guide 等のB2B記事
- thailand/vietnam生活記事（VPN、SIM、郵便番号、交通ガイド等）

### Phase 2 Batch 2: 残り記事（77記事、154リンク）

- ベトナムお土産・フード記事
- ハノイ・ホーチミン生活記事
- 各国ホテルガイド（アフィリエイト記事）
- 他国VPNガイド

---

## 関連記事セクションのHTML形式

```html
<h2>&#x95A2;&#x9023;&#x8A18;&#x4E8B;</h2>
<ul>
<li><a href="https://kyujin.careerlink.asia/blog/[slug]/">[タイトル]</a></li>
...
</ul>
```

**注意**: PowerShellスクリプトで日本語を使う場合、エンコード問題を避けるため「関連記事」は `&#x95A2;&#x9023;&#x8A18;&#x4E8B;` としてHTML Entityで記述する。

---

## 未対応記事（8件、対応不要）

個人ブログ記事のため、ビジネス関連性が低くリンク追加不要：

- intern-introduction-makie
- summer-in-closed-eyes
- intern-introduction-basic
- curry-lovers
- company-trip-malaysia
- my-best-friends
- intern-introduction-seita
- blog-introduction

---

*最終更新: 2026-01-22（Phase 1+2完了）*
