const incomeDisplay = document.getElementById('income-display');
const incomeInput = document.getElementById('income');
const addIncomeButton = document.getElementById('add-income');
const expensesList = document.getElementById('expenses-list');
const expenseDescriptionInput = document.getElementById('expense-description');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseButton = document.getElementById('add-expense');
const remainingBalance = document.getElementById('remaining-balance');
const showGraphButton = document.getElementById('show-graph');

let currentIncome = 0;
let totalExpenses = 0;
let expenseItems = [];
const darkModeButton = document.getElementById('dark-mode-button');
const resetButton = document.getElementById('reset-button');

darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

resetButton.addEventListener('click', () => {
    currentIncome = 0;
    totalExpenses = 0;
    expenseItems = [];
    updateIncomeDisplay();
    updateExpenseList();
    updateRemainingBalance();
    saveDataToLocalStorage();
});

if (localStorage.getItem('expenseTrackerData')) {
    const data = JSON.parse(localStorage.getItem('expenseTrackerData'));
    currentIncome = data.currentIncome;
    totalExpenses = data.totalExpenses;
    expenseItems = data.expenseItems;
    updateExpenseList();
    updateIncomeDisplay();
    updateRemainingBalance();
}

addIncomeButton.addEventListener('click', () => {
    const income = parseFloat(incomeInput.value);
    if (!isNaN(income) && income > 0) {
        currentIncome += income;
        incomeInput.value = '';
        updateIncomeDisplay();
        updateRemainingBalance();
        saveDataToLocalStorage();
    } else {
        alert("Please enter a valid income greater than 0.");
    }
});

addExpenseButton.addEventListener('click', () => {
    const description = expenseDescriptionInput.value;
    const amount = parseFloat(expenseAmountInput.value);

    if (!isNaN(amount) && amount > 0) {
        totalExpenses += amount;
        expenseItems.push({ description, amount });
        expenseDescriptionInput.value = '';
        expenseAmountInput.value = '';
        updateExpenseList();
        updateRemainingBalance();
        saveDataToLocalStorage();
    } else {
        alert("Please enter a valid expense amount greater than 0.");
    }
});

showGraphButton.addEventListener('click', () => {
    openExpenseChartInNewTab();
});

function openExpenseChartInNewTab() {
    const newTab = window.open('graph.html', '_blank');
    newTab.focus();
}

function updateIncomeDisplay() {
    incomeDisplay.textContent = `₹${currentIncome.toFixed(2)}`;
}

function updateExpenseList() {
    expensesList.innerHTML = '';
    expenseItems.forEach((expense, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${expense.description}: ₹${expense.amount.toFixed(2)} <button class="edit-expense" data-index="${index}">Edit</button> <button class="delete-expense" data-index="${index}">Delete</button>`;
        expensesList.appendChild(listItem);
    });

    const editButtons = document.querySelectorAll('.edit-expense');
    const deleteButtons = document.querySelectorAll('.delete-expense');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            editExpense(index);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            deleteExpense(index);
        });
    });
}

function editExpense(index) {
    const editedAmount = parseFloat(prompt("Edit the expense amount:", expenseItems[index].amount));
    if (!isNaN(editedAmount)) {
        totalExpenses = totalExpenses - expenseItems[index].amount + editedAmount;
        expenseItems[index].amount = editedAmount;
        updateExpenseList();
        updateRemainingBalance();
        saveDataToLocalStorage();
    }
}

function deleteExpense(index) {
    totalExpenses -= expenseItems[index].amount;
    expenseItems.splice(index, 1);
    updateExpenseList();
    updateRemainingBalance();
    saveDataToLocalStorage();
}

function updateRemainingBalance() {
    const remaining = currentIncome - totalExpenses;
    remainingBalance.textContent = `₹${remaining.toFixed(2)}`;
}

function saveDataToLocalStorage() {
    const data = {
        currentIncome,
        totalExpenses,
        expenseItems,
    };
    localStorage.setItem('expenseTrackerData', JSON.stringify(data));
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}
function updateExpenseChart() {
    const categories = expenseItems.map(item => item.description);
   
    const expenseAmounts = expenseItems.map(item => item.amount);

    const chartCanvas = document.getElementById('expense-chart');

    if (chartCanvas) {
        const chartContext = chartCanvas.getContext('2d');

        if (window.expenseChart) {
            window.expenseChart.destroy();
        }

        window.expenseChart = new Chart(chartContext, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Expenses',
                    data: expenseAmounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
if (localStorage.getItem('expenseTrackerData')) {
    const data = JSON.parse(localStorage.getItem('expenseTrackerData'));
    currentIncome = data.currentIncome;
    totalExpenses = data.totalExpenses;
    expenseItems = data.expenseItems;
    updateExpenseChart();
}
function checkRemainingBalance() {
    const remaining = currentIncome - totalExpenses;
    if (remaining < 0) {
        alert("Your remaining balance is negative. Please add more income or reduce expenses.");
    }
}
checkRemainingBalance();