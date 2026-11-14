# KNOWLEDGE / LAB v0.7

EDITORIAL v0.6 を保持し、SOFT NEO と LAYERS の改善版を追加しました。

## SOFT NEO
- 白枠や丸装飾なし
- 青みのないニュートラルグレー
- 凸版印刷のような極浅の明暗のみ。影の広がりを縮小
- トラック形ボタン、平面文字のごく弱い光
- 従来の色設定を維持しながら、旧版の強すぎる深さと影設定を一度だけ浅い範囲に移行

## LAYERS
- 色の鮮やかさスライダーを廃止。選んだHEX色をそのまま使用
- 不透明度と混色モードを独立保持
- MULTIPLY：色付き下敷きとしてCSS乗算
- SCREEN：単独面は選択色の通常合成、重なった部分だけスクリーン計算する独自Canvas描画
- NORMAL：通常の半透明合成
- 色付きの浅い影、サブパネルの重なりを維持
- 乗算は白文字、スクリーンは黒文字

## iPhone / GitHub Pages 更新ファイル
neo/index.js、neo/style.css、layers/index.js、layers/style.css、sw.js

ZIPはフルセットで、README記載の5ファイルだけを既存リポジトリの同じ場所へ置換できます。

既存の各UI別ローカルストレージキーを維持しています。Safariで古い画面が残った場合はGitHub Pagesの反映後にアプリを再起動してください。実機Safariの描画検証は未実施です。
