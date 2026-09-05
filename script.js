let entries = [];
let currentType = 'expense';

const entryForm = document.getElementById('entryForm');
const descInput = document.getElementById('descInput');
const amountInput = document.getElementById('amountInput');
const typeButtons = document.querySelectorAll('.type-btn');
const formError = document.getElementById('formError');

const entryList = document.getElementById('entryList');
const emptyState = document.getElementById('emptyState');
const clearBtn = document.getElementById('clearBtn');

const balanceFigure = document.getElementById('balanceFigure');
const totalInEl = document.getElementById('totalIn');
const totalOutEl = document.getElementById('totalOut');

function formatCurrency(value) {
  const sign = value < 0 ? '-' : '';
  return `${sign}₹${Math.abs(value).toFixed(2)}`;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

typeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    typeButtons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    currentType = btn.dataset.type;
  });
});

entryForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!description || !amount || amount <= 0) {
    formError.hidden = false;
    return;
  }
  formError.hidden = true;

  entries.unshift({
    id: Date.now(),
    description,
    amount,
    type: currentType,
    date: new Date(),
  });

  descInput.value = '';
  amountInput.value = '';
  descInput.focus();

  render();
});

entryList.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('.entry-remove');
  if (!removeBtn) return;

  const id = Number(removeBtn.dataset.id);
  entries = entries.filter((entry) => entry.id !== id);
  render();
});

clearBtn.addEventListener('click', () => {
  entries = [];
  render();
});

function render() {
  // Totals
  const totalIn = entries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOut = entries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  balanceFigure.textContent = formatCurrency(totalIn - totalOut);
  totalInEl.textContent = formatCurrency(totalIn);
  totalOutEl.textContent = formatCurrency(totalOut);

  // List
  entryList.innerHTML = '';

  if (entries.length === 0) {
    emptyState.hidden = false;
    clearBtn.hidden = true;
    return;
  }

  emptyState.hidden = true;
  clearBtn.hidden = false;

  entries.forEach((entry) => {
    const li = document.createElement('li');
    li.className = 'entry-row';
    li.innerHTML = `
      <span class="entry-date">${formatDate(entry.date)}</span>
      <span class="entry-desc">${escapeHtml(entry.description)}</span>
      <span class="entry-amount ${entry.type}">
        ${entry.type === 'income' ? '+' : '-'}${formatCurrency(entry.amount).replace('-', '')}
      </span>
      <button class="entry-remove" data-id="${entry.id}" aria-label="Remove entry">&times;</button>
    `;
    entryList.appendChild(li);
  });
}


function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

render();
