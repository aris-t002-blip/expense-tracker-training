const GAS_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbyap21ds-moXNc7tPS3XGTKauq-nACEBeFtVK1AeQjV2r_mI7tWF7iCgc_wkI1H5fDJ/exec";

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");

const dateEl = document.getElementById("date");
const categoryEl = document.getElementById("category");
const amountEl = document.getElementById("amount");
const memoEl = document.getElementById("memo");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// ====== スプレッドシートへ同期（全件上書き）======
// CORS回避のため payload を URLSearchParams で送る
function syncToSheet() {
  const body = new URLSearchParams();
  body.set("payload", JSON.stringify(expenses));

  fetch(GAS_WEBAPP_URL, {
    method: "POST",
    body,
  }).catch((err) => {
    console.error("GAS送信失敗", err);
  });
}

// ====== 保存＆表示 ======
function saveAndRender() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  syncToSheet(); // ← 追加/削除のたびに同期
  render();
}

// ====== 一覧表示 ======
function render() {
  list.innerHTML = "";

  expenses.forEach((e, index) => {
    const li = document.createElement("li");
    li.textContent = `${e.date} / ${e.category} / ¥${e.amount} / ${e.memo || ""} `;

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.onclick = () => {
      expenses.splice(index, 1);
      saveAndRender();
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// ====== 追加 ======
form.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const item = {
    id: Date.now(),
    date: dateEl.value,
    category: categoryEl.value,
    amount: Number(amountEl.value),
    memo: memoEl.value,
  };

  expenses.push(item);
  saveAndRender();
  form.reset();
});

// 初期表示
render();
