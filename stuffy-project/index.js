const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
app.use(cors());
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const transactionRoute = require("./routes/transaction");
const confirmationRoute = require("./routes/confirmation");
const categoryRoute = require("./routes/category");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL) //connect to online mongoDB
  .then(() => console.log("DB Success Connected!"))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/confirmations", confirmationRoute);
app.use("/api/categories", categoryRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running!");
});