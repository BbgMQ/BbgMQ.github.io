const descriptionInput = document.querySelector('input[type="text"]');
const amountInput = document.querySelector('input[type="number"]');
const categorySelect = document.querySelector('select');
const addButton = document.querySelector('button');
const transactionList = document.createElement('ul');

document.querySelector('.transactions')?.appendChild(transactionList);

let transactions = [];

// Update UI
function updateUI() {
  let balance = 0;
  let income = 0;
  let expenses = 0;

  transactionList.innerHTML = '';

  transactions.forEach((t, index) => {
    const li = document.createElement('li');
    li.classList.add(t.amount >= 0 ? 'income' : 'expense');

    li.innerHTML = `
      ${t.description} (${t.category}) 
      <span>$${t.amount}</span>
    `;

    transactionList.appendChild(li);

    balance += t.amount;

    if (t.amount >= 0) {
      income += t.amount;
    } else {
      expenses += Math.abs(t.amount);
    }
  });

  document.querySelector('.summary h2').textContent = `Balance: $${balance}`;
  document.querySelectorAll('.totals p')[0].textContent = `Income: $${income}`;
  document.querySelectorAll('.totals p')[1].textContent = `Expenses: $${expenses}`;
}

// Add transaction
addButton.addEventListener('click', () => {
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categorySelect.value;

  if (!description || isNaN(amount) || category === "Select a category") {
    alert("Please fill out all fields correctly.");
    return;
  }

  transactions.push({
    description,
    amount,
    category
  });

  descriptionInput.value = '';
  amountInput.value = '';
  categorySelect.selectedIndex = 0;

  updateUI();
});