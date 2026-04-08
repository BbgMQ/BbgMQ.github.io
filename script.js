// Budget Tracker - simplified and fixed pie-chart input handling

// Selectors
const descriptionInput = document.getElementById('descInput');
const amountInput = document.getElementById('amountInput');
const typeSelect = document.getElementById('typeSelect');
const categorySelect = document.getElementById('categorySelect');
const addButton = document.getElementById('addBtn');
const transactionList = document.getElementById('transactionList');

let transactions = [];

// Category color mapping (rendered into the key)
const CATEGORY_COLORS = {
  Food: '#4e79a7',
  Housing: '#f28e2c',
  Transportation: '#e15759',
  Entertainment: '#76b7b2',
  Utilities: '#59a14f',
  Shopping: '#edc949',
  Health: '#af7aa1',
  Other: '#ff9f40'
};

// Starting balance
let startingBalance = 0;
const startingBalanceInput = document.getElementById('startingBalance');
const setBalanceBtn = document.getElementById('setBalanceBtn');

setBalanceBtn.addEventListener('click', () => {
  const value = parseFloat(startingBalanceInput.value);
  if (isNaN(value)) {
    alert('Enter a valid number');
    return;
  }
  startingBalance = value;
  startingBalanceInput.value = '';
  updateUI();
});

// Add transaction
function addTransaction() {
  const description = descriptionInput.value.trim();
  const rawAmount = amountInput.value.trim();
  const amount = parseFloat(rawAmount);
  const type = typeSelect.value;
  const category = categorySelect.value;

  if (!description || isNaN(amount) || !type || category === 'Select a category') {
    alert('Please fill out all fields correctly.');
    return;
  }

  // Normalize sign: Income -> positive, Expense -> negative
  const signedAmount = type === 'Expense' ? -Math.abs(amount) : Math.abs(amount);

  transactions.push({ description, amount: signedAmount, category, type });

  descriptionInput.value = '';
  amountInput.value = '';
  typeSelect.selectedIndex = 0;
  categorySelect.selectedIndex = 0;

  updateUI();
}

addButton.addEventListener('click', addTransaction);
amountInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTransaction(); });
descriptionInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTransaction(); });

// Update UI
function updateUI() {
  let balance = startingBalance;
  let income = 0;
  let expenses = 0;

  transactionList.innerHTML = '';

  transactions.forEach(t => {
    const li = document.createElement('li');
    li.classList.add(t.amount >= 0 ? 'income' : 'expense');
    li.innerHTML = `${t.description} (${t.category}) <span>$${Math.abs(t.amount)}</span>`;
    transactionList.appendChild(li);

    balance += t.amount;
    if (t.amount >= 0) income += t.amount;
    else expenses += Math.abs(t.amount);
  });

  document.getElementById('balanceDisplay').textContent = `Balance: $${balance}`;
  document.getElementById('incomeDisplay').textContent = `Income: $${income}`;
  document.getElementById('expensesDisplay').textContent = `Expenses: $${expenses}`;

  updatePieChart();
}

// CSS-based pie chart update
function updatePieChart() {
  const chart = document.getElementById('spendingPie');
  const legend = document.getElementById('pieLegend');
  const centerMsg = document.getElementById('pieCenter');
  if (!chart) return;

  const totals = {};
  let totalExpenses = 0;

  transactions.forEach(t => {
    if (t.amount < 0) {
      if (!totals[t.category]) totals[t.category] = 0;
      totals[t.category] += Math.abs(t.amount);
      totalExpenses += Math.abs(t.amount);
    }
  });

  if (totalExpenses === 0) {
    chart.style.background = `conic-gradient(#444 0% 100%)`;
    if (legend) legend.innerHTML = '';
    if (centerMsg) { centerMsg.style.display = 'block'; centerMsg.textContent = 'No expenses yet'; }
    return;
  }
  if (centerMsg) centerMsg.style.display = 'none';

  const colors = CATEGORY_COLORS;

  let startPercent = 0;
  let gradientStr = '';
  let legendHTML = '';

  Object.keys(totals).forEach((cat, index, arr) => {
    const percent = (totals[cat] / totalExpenses) * 100;
    const endPercent = startPercent + percent;

    gradientStr += `${colors[cat] || '#ccc'} ${startPercent}% ${endPercent}%`;
    if (index < arr.length - 1) gradientStr += ', ';

    legendHTML += `<span class="legend-item"><span class="legend-swatch" style="background:${colors[cat] || '#ccc'}"></span>${cat} ${Math.round(percent)}%</span>`;
    startPercent = endPercent;
  });

  chart.style.background = `conic-gradient(${gradientStr})`;

  if (legend) legend.innerHTML = legendHTML;
}

// Render the persistent color key (shows what color corresponds to which category)
function renderColorKey() {
  const keyContainer = document.getElementById('pieKey');
  if (!keyContainer) return;
  keyContainer.innerHTML = '';

  Object.keys(CATEGORY_COLORS).forEach(cat => {
    const item = document.createElement('div');
    item.className = 'item';

    const swatch = document.createElement('span');
    swatch.className = 'swatch';
    swatch.style.background = CATEGORY_COLORS[cat];

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = cat;

    item.appendChild(swatch);
    item.appendChild(label);
    keyContainer.appendChild(item);
  });
}

// Interactive cubes (unchanged)
const cubeWrappers = document.querySelectorAll('.cube-wrapper');

cubeWrappers.forEach(wrapper => {
  const cube = wrapper.querySelector('.cube-background');
  let isDragging = false;
  let startX, startY;
  let currentX = 0;
  let currentY = 0;

  const originalAnimation = cube.style.animation;

  wrapper.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    document.body.style.userSelect = 'none';

    cube.style.animation = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;

    let deltaX = e.clientX - startX;
    let deltaY = e.clientY - startY;

    const sensitivity = 0.03;
    currentY += deltaX * sensitivity;
    currentX -= deltaY * sensitivity;

    cube.style.transform = `translate(0, -50%) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = 'auto';

    cube.style.animation = originalAnimation;
  });
});

// Init
window.addEventListener('load', () => {
  renderColorKey();
  updateUI();
});

// Show footer on scroll
const footer = document.querySelector('footer');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    footer.style.opacity = '1';
  } else {
    footer.style.opacity = '0';
  }
});
