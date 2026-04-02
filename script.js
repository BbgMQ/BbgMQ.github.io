const descriptionInput = document.querySelector('input[type="text"]');
const amountInput = document.querySelector('.form input[type="number"]');
const categorySelect = document.querySelector('select');
const addButton = document.querySelector('.form button');
const transactionList = document.createElement('ul');

document.querySelector('.transactions')?.appendChild(transactionList);

let transactions = [];

// ✅ STARTING BALANCE
let startingBalance = 0;
const startingBalanceInput = document.getElementById("startingBalance");
const setBalanceBtn = document.getElementById("setBalanceBtn");

setBalanceBtn.addEventListener("click", () => {
  const value = parseFloat(startingBalanceInput.value);
  if (isNaN(value)) {
    alert("Enter a valid number");
    return;
  }
  startingBalance = value;
  startingBalanceInput.value = "";
  updateUI();
});

// UPDATE UI
function updateUI() {
  let balance = startingBalance;
  let income = 0;
  let expenses = 0;

  transactionList.innerHTML = '';

  transactions.forEach(t => {
    const li = document.createElement('li');
    li.classList.add(t.amount >= 0 ? 'income' : 'expense');

    li.innerHTML = `
      ${t.description} (${t.category}) 
      <span>$${t.amount}</span>
    `;

    transactionList.appendChild(li);

    balance += t.amount;

    if (t.amount >= 0) income += t.amount;
    else expenses += Math.abs(t.amount);
  });

  document.querySelector('.summary h2').textContent = `Balance: $${balance}`;
  document.querySelectorAll('.totals p')[0].textContent = `Income: $${income}`;
  document.querySelectorAll('.totals p')[1].textContent = `Expenses: $${expenses}`;
}

// ADD TRANSACTION
addButton.addEventListener('click', () => {
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categorySelect.value;

  if (!description || isNaN(amount) || category === "Select a category") {
    alert("Please fill out all fields correctly.");
    return;
  }

  transactions.push({ description, amount, category });

  descriptionInput.value = '';
  amountInput.value = '';
  categorySelect.selectedIndex = 0;

  updateUI();
});

// === INTERACTIVE CUBES WITH FULL MOUSE CONTROL ===
const cubeWrappers = document.querySelectorAll('.cube-wrapper');

cubeWrappers.forEach(wrapper => {
  const cube = wrapper.querySelector('.cube-background');
  let isDragging = false;
  let startX, startY;
  let currentX = 0;
  let currentY = 0;

  // Store initial animation
  const originalAnimation = cube.style.animation;

  wrapper.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    document.body.style.userSelect = 'none';

    // Stop CSS animation completely
    cube.style.animation = 'none';

    // Prevent dollar sign text selection
    cube.querySelectorAll('.face').forEach(face => {
      face.style.userSelect = 'none';
      face.style.webkitUserSelect = 'none';
      face.style.mozUserSelect = 'none';
      face.style.msUserSelect = 'none';
    });
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;

    let deltaX = e.clientX - startX;
    let deltaY = e.clientY - startY;

    // Adjust sensitivity (slower rotation)
    const sensitivity = 0.03; // lower number = slower
    currentY += deltaX * sensitivity;
    currentX -= deltaY * sensitivity;

    // Apply transform
    cube.style.transform = `translate(0, -50%) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = 'auto';

      cube.style.animation = originalAnimation;
    }, 3000); // 3000ms = 3 seconds
  });