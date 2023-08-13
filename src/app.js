const express = require("express");
const morgan = require("morgan");
const app = express();
const productsRouter = require("./routes/products.js");
const cartsRouter = require("./routes/carts.js");

const PORT = 8080;

app.use(express.json());
app.use(morgan("dev"));

// Conectar las rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
