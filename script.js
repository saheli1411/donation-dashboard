// Dummy donation data
const donations = [
  { date: "2025-11-01", name: "Alice", amount: 50 },
  { date: "2025-11-02", name: "Bob", amount: 100 },
  { date: "2025-11-03", name: "Charlie", amount: 75 },
  { date: "2025-11-04", name: "Diana", amount: 150 },
  { date: "2025-11-05", name: "Ethan", amount: 200 },
];

// Calculate total donations
const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
document.getElementById('totalDonations').textContent = `$${totalDonations}`;

// Count unique donors
const uniqueDonors = new Set(donations.map(d => d.name)).size;
document.getElementById('totalDonors').textContent = uniqueDonors;

// Populate table
const tableBody = document.getElementById('donationTable');
donations.forEach(d => {
  const row = `<tr><td>${d.date}</td><td>${d.name}</td><td>${d.amount}</td></tr>`;
  tableBody.innerHTML += row;
});

// Chart.js for trends
const ctx = document.getElementById('donationChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: donations.map(d => d.date),
    datasets: [{
      label: 'Donation Amount ($)',
      data: donations.map(d => d.amount),
      borderColor: '#007bff',
      backgroundColor: 'rgba(0,123,255,0.2)',
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Donation Trends Over Time' }
    }
  }
});
