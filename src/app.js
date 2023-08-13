const express = require("express");
const app = express();
const productsRouter = require("./routes/products.js");
const cartsRouter = require("./routes/carts.js");

const PORT = 8080;

app.use(express.json());

// Conectar las rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
