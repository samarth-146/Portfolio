let isPieChart = true;

function toggleChartType() {
    isPieChart = !isPieChart; 

    if (isPieChart) {
        document.getElementById('toggle-graph-button').textContent = 'Show Bar Graph';
        updatePieChart();
    } else {
        document.getElementById('toggle-graph-button').textContent = 'Show Pie Chart';
        updateBarGraph();
    }
}

document.getElementById('toggle-graph-button').addEventListener('click', toggleChartType);

function updateBarGraph() {
    const categories = expenseItems.map(item => item.description);
    const expenseAmounts = expenseItems.map(item => item.amount);

    const chartCanvas = document.getElementById('expense-chart');

    if (chartCanvas) {
        const chartContext = chartCanvas.getContext('2d');

        if (window.expenseChart) {
            window.expenseChart.destroy();
        }

        window.expenseChart = new Chart(chartContext, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Expenses',
                    data: expenseAmounts,
                    backgroundColor: ['rgba(255, 0, 0, 0.5)', 'rgba(0, 128, 255, 0.7)', 'green', 'red', 'blue', 'cyan', 'pink'],
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

function updatePieChart() {
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
                    backgroundColor: ['rgba(255, 0, 0, 0.5)', 'rgba(0, 128, 255, 0.7)', 'green', 'red', 'blue', 'cyan', 'pink'],
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
    if (isPieChart) {
        updatePieChart();
    } else {
        updateBarGraph();
    }
}
