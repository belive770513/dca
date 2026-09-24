// 依照「設定說明.md」把下面的空白填好。這些值不是密碼，放在網頁裡是正常的；
// 資料安全靠的是 Firestore 規則（只有登入的本人能讀寫自己的資料）。
window.APP_CONFIG = {
  firebase: {
    apiKey: "AIzaSyCbhC6-s0P5WNiNzJ7jgwZUKWe4hGvPSwM",
    authDomain: "dca-ledger-7c603.firebaseapp.com",
    projectId: "dca-ledger-7c603",
    appId: "1:512056189384:web:460ac2b4cdb097c1d620fd"
  },
  // Cloudflare 報價轉接程式的網址，例如 "https://dca-quote.你的名稱.workers.dev"
  workerUrl: "https://dca-quote.belive770513.workers.dev"
};
