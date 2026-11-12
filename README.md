# KNOWLEDGE / LAB — EDITORIAL v0.1

iPhone Safari向けの個人用学習・UI実験アプリ。現在動作するUIはEDITORIALのみです。SOFT NEOとLAYERSは切替一覧内に将来追加用の枠を表示します。

## 試し方
1. ZIPを展開し、中のファイル・フォルダを同じ階層でGitHubリポジトリにアップロードします（ZIPの中身をリポジトリのルートに置く）。
2. Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save。
3. GitHub PagesのURLをiPhone Safariで開き、「共有」→「ホーム画面に追加」。

ローカルで動作確認する場合はHTTPサーバーで配信してください。`file://` 直開きではES ModulesやService Workerが動きません。

## 実装
- 共通データ: data.js
- UI 01: editorial/index.js, editorial/style.css
- オフライン対応: sw.js（公開後一度オンラインで開く必要あり）
- UI別設定の保存: localStorage（現在はEDITORIALのみ）
- 設定JSONの出力・入力（基本的な検証あり）

## 制限
- 初期収録内容は学習用の概説で、出典付きの詳細な専門DBではありません。
- 物性値は代表的な目安で、同一測定条件の比較値ではありません。
- 内容液との適合性や容器設計上の判断には利用できません。
- 外部サーバーやログイン、実測データの登録はありません。
