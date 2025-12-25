const GAS_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbyap21ds-moXNc7tPS3XGTKauq-nACEBeFtVK1AeQjV2r_mI7tWF7iCgc_wkI1H5fDJ/exec";

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

/* ===== 共通保存 ===== */
function saveAndRender() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}

/* ===== 表示 ===== */
function render() {
  list.innerHTML = "";
  expenses.forEach((e, index) => {
    const li = document.createElement("li");
    li.textContent = `${e.date} / ${e.category} / ¥${e.amount} / ${e.memo}`;

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

/* ===== 初期表示 ===== */
render();

/* ===== 追加処理（ここが重要） ===== */
form.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const data = {
    date: form.date.value,
    category: form.category.value,
    amount: form.amount.value,
    memo: form.memo.value,
  };

  // 画面用（localStorage）
  expenses.push(data);
  saveAndRender();
  form.reset();

  // ★ GASへ送信（これが今まで無かった）
  try {
    await fetch(GAS_WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error("GAS送信失敗", err);
  }
});
