const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyap21ds-moXNc7tPS3XGTKauq-nACEBeFtVK1AeQjV2r_mI7tWF7iCgc_wkI1H5fDJ/exec";

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveAndRender() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}

function render() {
  list.innerHTML = "";
  expenses.forEach((e, index) => {
    const li = document.createElement("li");
    li.textContent = `${e.date} ${e.category} ¥${e.amount} ${e.memo}`;

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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  expenses.push({
    date: date.value,
    category: category.value,
    amount: amount.value,
    memo: memo.value
  });

  saveAndRender();
  form.reset();
});

render();
