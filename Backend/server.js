const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();
const transactionRoutes =require('./routes/transactions');
// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);




mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

  app.get('/', (req, res) => res.send('Expense Tracker API running'));
  // ✅ Mount your route
app.use('/api/transactions', transactionRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
