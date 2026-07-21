\# 和韓食堂｜日韓料理訂購平台



和韓食堂是一個以 Vue 3 製作的日韓料理訂購網站，提供料理瀏覽、商品詳情、我的最愛、購物車、優惠券套用、訂單建立、付款確認與後台管理等功能。

本專案作為前端作品集展示，模擬實際餐飲訂購平台的使用流程。



\## Demo



\### 前台網站



前台首頁：

https://andyare123.github.io/japan-korea-food-demo/



前台功能包含料理瀏覽、商品詳情、我的最愛、購物車、結帳流程、付款確認與訂單查詢。



\### 後台管理



後台登入：

https://andyare123.github.io/japan-korea-food-demo/#/login



登入後可進入以下管理頁面：



\- 商品管理：

&#x20; https://andyare123.github.io/japan-korea-food-demo/#/admin/products



\- 優惠券管理：

&#x20; https://andyare123.github.io/japan-korea-food-demo/#/admin/coupons



\- 訂單檢視：

&#x20; https://andyare123.github.io/japan-korea-food-demo/#/admin/orders



\## 專案功能



\### 前台功能



\- 首頁品牌形象與推薦料理展示

\- 日韓料理列表瀏覽

\- 商品詳情頁

\- 加入購物車

\- 購物車數量調整與移除餐點

\- 優惠券套用

\- 我的最愛收藏功能

\- 結帳流程

\- 建立訂單

\- 付款確認

\- 訂單查詢



\### 後台功能



\- 料理商品管理

\- 新增、編輯、刪除商品

\- 商品啟用 / 停用

\- 優惠券管理

\- 訂單查詢

\- 付款狀態檢視



\## 使用技術



\- Vue 3

\- Vue CLI

\- Vue Router

\- Axios

\- Bootstrap 5

\- Bootstrap Icons

\- VeeValidate

\- Vue Loading Overlay

\- localStorage

\- HexSchool Vue Course API



\## 專案安裝



請先確認已安裝 Node.js 與 npm。



```bash

npm install



\\## 專案變數

請在專案根目錄建立 .env 檔案，可參考 .env.example：



VUE\\\_APP\\\_API=你的APP\\\_API

VUE\\\_APP\\\_PATH=你的\\\_API\\\_PATH





\\##啟動開發環境

npm run serve



\\##建立正式版檔案

npm run build



\\##專案結構

src/

├── assets/

├── components/

├── layouts/

├── methods/

├── mixins/

├── router/

├── views/

├── App.vue

└── main.js



備註



本專案使用 HexSchool Vue Course API 作為資料來源，主要用於前端作品集展示與練習。

\\---



\\## 用 VS Code 新增方式



在左側檔案總管對著專案根目錄按右鍵：



```txt

New File




