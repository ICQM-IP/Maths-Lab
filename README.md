# 叻豬研究所 · Smart Pig Maths Lab

完整網站，第 10 版（2026-10-19）。包括首頁、小學／中學研究室、黑板選擇題、角色互動、投影模式、中英文切換及所有素材。

## 上載 GitHub 並發佈

1. 在 GitHub 建立新儲存庫，建議名稱 `smart-pig-maths-lab`。若要免費公開網站，可選 Public。
2. 解壓本 ZIP，打開 `Smart-Pig-Maths-Lab` 資料夾。
3. 在儲存庫選 Upload files（或 Add file → Upload files）。
4. 把資料夾內的檔案及 `assets`、`tests` 資料夾拖入上載區，然後 Commit changes。
   **不要上載 ZIP 本身；index.html 必須直接位於儲存庫最外層。保留 assets 內的圖片及資料夾結構。**
5. 打開 Settings → Pages；Source 選 Deploy from a branch；選 main 及 / (root)，按 Save。
6. 等待 GitHub Pages 部署完成，使用該頁顯示的網址。

這是獨立的網站副本。原有網站仍保留：
https://smart-pig-maths-lab.yummymoss64.chatgpt.site/
兩邊不會自動同步更新。

## 本機預覽

在此資料夾執行：

```sh
python3 -m http.server 8000
```

瀏覽 http://localhost:8000。

## 日後修改

- 頁面文字及結構：修改 build_pages.py，再執行 python3 build_pages.py。
- 外觀：style.css。
- 互動：app.js。
- 隨機數學題：math.js。
- 圖片：assets/。

直接修改 HTML 也可以，但下次執行 build_pages.py 會覆寫 HTML。

## 驗證

```sh
node --check app.js
node tests/math.test.cjs
```

## 遊戲

本包包含完整入口網站及素材。Math Down!、Math Volley、Math Bomb Battle 的遊戲程式仍在各自原有的 GitHub 儲存庫，網站保留連到它們的網址。
