import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const initialData = [
  { date: "2025-11-01", name: "Alice", amount: 50 },
  { date: "2025-11-02", name: "Bob", amount: 100 },
  { date: "2025-11-03", name: "Charlie", amount: 75 },
  { date: "2025-11-04", name: "Diana", amount: 150 },
  { date: "2025-11-05", name: "Ethan", amount: 200 },
];

export default function App() {
  const [donations, setDonations] = useState(() => {
    try {
      const raw = localStorage.getItem("donations");
      return raw ? JSON.parse(raw) : initialData;
    } catch {
      return initialData;
    }
  });

  const [form, setForm] = useState({
    date: "",
    name: "",
    amount: "",
  });

  useEffect(() => {
    localStorage.setItem("donations", JSON.stringify(donations));
  }, [donations]);

  const totalDonations = donations.reduce((s, d) => s + Number(d.amount), 0);
  const uniqueDonors = new Set(donations.map((d) => d.name)).size;
  const averageDonation = (totalDonations / donations.length).toFixed(2);

  const donorTotals = donations.reduce((acc, d) => {
    acc[d.name] = (acc[d.name] || 0) + Number(d.amount);
    return acc;
  }, {});
  const topDonor = Object.entries(donorTotals).sort((a, b) => b[1] - a[1])[0] || ["-", 0];

  const chartData = {
    labels: donations.map((d) => d.date),
    datasets: [
      {
        label: "Donation Amount ($)",
        data: donations.map((d) => Number(d.amount)),
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Donation Trends Over Time" },
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (!form.date || !form.name || !form.amount) {
      alert("Please enter date, name and amount.");
      return;
    }
    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    const newDonation = {
      date: form.date,
      name: form.name.trim(),
      amount: Number(form.amount),
    };

    const updated = [...donations, newDonation].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    setDonations(updated);
    setForm({ date: "", name: "", amount: "" });
  };

  const handleReset = () => {
    if (confirm("Reset all donations to the default sample data?")) {
      setDonations(initialData);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Donation Tracking Dashboard</h1>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Total Donations</h2>
          <p style={styles.amount}>${totalDonations}</p>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Number of Donors</h2>
          <p style={styles.amount}>{uniqueDonors}</p>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Average Donation</h2>
          <p style={styles.amount}>${averageDonation}</p>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Top Donor</h2>
          <p style={styles.amount}>{topDonor[0]}</p>
          <p>(${topDonor[1]})</p>
        </div>
      </div>

      <section style={styles.formSection}>
        <h2>Add a Donation</h2>
        <form onSubmit={handleAdd} style={styles.form}>
          <div style={styles.formRow}>
            <label style={styles.label}>
              Date:
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Donor Name:
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Rahul"
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Amount:
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 100"
                style={styles.input}
                min="1"
              />
            </label>
          </div>

          <div style={{ marginTop: 10 }}>
            <button type="submit" style={styles.button}>
              Add Donation
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{ ...styles.button, marginLeft: 10, background: "#f44336" }}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      <h2 style={{ marginTop: "30px" }}>Donation Table</h2>
      <div style={{ overflowX: "auto", background: "white", padding: 10 }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Donor Name</th>
              <th>Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d, index) => (
              <tr key={index}>
                <td>{d.date}</td>
                <td>{d.name}</td>
                <td>{d.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f7f9fc",
    minHeight: "100vh",
    padding: "20px",
  },
  title: { textAlign: "center", color: "#333", marginBottom: "30px" },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#e9f3ff",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    width: "220px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    color: "#000000",
    margin: 0,
    fontSize: 18,
    fontWeight: 600
  },
    blackHeading: {
    color: "black",
  },
  amount: { fontSize: "24px", color: "#007bff", fontWeight: "bold" },
    blackAmount: {
    fontSize: "24px",
    color: "black",
    fontWeight: "bold",
  },
  formSection: { marginTop: 20, background: "white", padding: 12, borderRadius: 8 },
  formRow: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" },
  label: { display: "flex", flexDirection: "column", fontSize: 14, minWidth: 160 },
  input: { padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 6 },
  button: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "center" },
};