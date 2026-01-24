# ID 6992: URL検証結果

**記事**: タイ人材紹介会社一覧
**検証日**: 2026-01-24
**対象**: v2026_draft.md（20社）

---

## 重要事項

- 本資料は**掲載前の実在性チェック結果**である
- 最終的な掲載可否は**人間が決定する**
- NG判定の企業は掲載不可、要注記は注記付きで掲載可

---

## 検証サマリー

| 分類 | 件数 |
|------|------|
| OK（掲載可） | 15社 |
| 要注記（注記すれば可） | 4社 |
| 要確認（追加調査推奨） | 1社 |
| NG（掲載不可） | 0社 |

---

## 検証結果一覧

### 日系企業（10社）

| No | 企業名 | URL | 判定 | 備考 |
|----|--------|-----|------|------|
| 1 | CareerLink Thailand | https://kyujin.careerlink.asia/thailand | OK | 会社名・事業確認済 |
| 2 | RGF HR Agent Thailand | https://www.rgf-hragent.asia/thailand | OK | 会社名・事業確認済 |
| 3 | JAC Recruitment Thailand | https://www.jac-recruitment.co.th/ja | 要確認 | CSS/JSのみ取得、実コンテンツ未確認 |
| 4 | Reeracoen Thailand | https://www.reeracoen.co.th/ja | OK | 会社名・事業確認済 |
| 5 | Pasona Thailand | https://pasona.co.th/ja/ | OK | 会社名・事業確認済 |
| 6 | PERSONNEL CONSULTANT | https://www.personnelconsultant.co.th/ | OK | 会社名・事業確認済 |
| 7 | QHR / クイック | https://www.qhr.co.th/ja/ | OK | 会社名・事業確認済 |
| 8 | echoas recruitment | https://echoas.asia/ | OK | 会社名確認済 |
| 9 | ICHIJIN RECRUITMENT | http://www.maruichi-thailand.com/ichijin/ | 要注記 | SSL証明書エラー（sakura.ne.jp証明書） |
| 10 | A-Link Recruitment | https://www.alink.co.th/jp/ | 要注記 | 403 Forbidden（アクセス制限） |

### 非日系企業（10社）

| No | 企業名 | URL | 判定 | 備考 |
|----|--------|-----|------|------|
| 11 | Adecco Thailand | https://adeccojapanese.asia/ | OK | 会社名・事業確認済 |
| 12 | ManpowerGroup Thailand | https://www.manpowerthailand.com/ | OK | 会社名・事業確認済 |
| 13 | PERSOL KELLY | https://www.persolkelly.co.th/ | OK | persolthailand.comへリダイレクト、確認済 |
| 14 | Robert Walters | https://www.robertwalters.co.th/ | 要注記 | 403 Forbidden（アクセス制限） |
| 15 | Boyden Thailand | https://www.boyden.com/ | OK | 会社名・事業確認済 |
| 16 | K.P.W. International | https://www.kpwmanpowerservices.com/ | OK | 会社名・事業確認済 |
| 17 | Monroe Consulting | https://www.monroeconsulting.com/ | OK | 会社名・事業確認済 |
| 18 | KTI Consultants | https://www.kticonsultants.com/ | OK | 会社名確認済 |
| 19 | PRTR | https://www.prtr.com/ | 要注記 | 接続タイムアウト |
| 20 | Smart Search Recruitment | https://www.ssrecruitment.com/ | OK | 会社名・事業確認済 |

---

## 要対応事項

### 要注記（4社）

以下の企業は、URLアクセスに問題があるが会社自体は存在する可能性が高い。注記付きで掲載可。

1. **ICHIJIN RECRUITMENT**: SSL証明書の設定不備。サイト自体は存在
2. **A-Link Recruitment**: 403エラー。アクセス制限または一時的障害
3. **Robert Walters**: 403エラー。アクセス制限または一時的障害
4. **PRTR**: 接続タイムアウト。一時的なサーバー負荷の可能性

### 要確認（1社）

1. **JAC Recruitment Thailand**: Webサイトは存在するが、コンテンツ取得が不完全。手動確認推奨

---

## 検証方法

1. 各企業の公式サイトURLにアクセス
2. HTTPレスポンス（200系、リダイレクト、エラー）を確認
3. 会社名と人材紹介事業の記載を確認
4. DNS解決・SSL証明書の有効性を確認

---

**注意**: 本資料は技術的なURL検証結果であり、企業の信頼性や品質を評価するものではない。
