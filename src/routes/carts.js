const express = require("express");
const router = express.Router();
const fs = require("fs/promises"); // Importamos fs/promises para trabajar con el sistema de archivos de Node.js de forma asíncrona

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = { id: generateNewCartId(), products: [] }; // Creamos un nuevo carrito con un ID único y una lista de productos inicialmente vacía
    const cartsData = await fs.readFile("./src/data/carts.json", "utf-8");
    const carts = JSON.parse(cartsData);
    carts.push(newCart); // Agregamos el nuevo carrito a la lista de carritos
    await fs.writeFile(
      "./src/data/carts.json",
      JSON.stringify(carts, null, 2),
      "utf-8"
    ); // Actualizamos el archivo carrito.json
    res.status(201).json(newCart); // Respondemos con el nuevo carrito en formato JSON
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// Ruta para obtener los productos de un carrito por su ID
router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid; // Obtenemos el ID del carrito desde los parámetros de la URL
    const cartsData = await fs.readFile("./src/data/carts.json", "utf-8");
    const carts = JSON.parse(cartsData);
    const cart = carts.find((c) => c.id === cartId); // Buscamos el carrito por su ID
    if (cart) {
      res.json(cart.products); // Respondemos con la lista de productos del carrito en formato JSON
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los productos del carrito" });
  }
});

// Ruta para agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid; // Obtenemos el ID del carrito desde los parámetros de la URL
    const productId = req.params.pid; // Obtenemos el ID del producto desde los parámetros de la URL
    const quantity = req.body.quantity; // Obtenemos la cantidad del producto desde el cuerpo de la solicitud (request)
    const cartsData = await fs.readFile("./src/data/carts.json", "utf-8");
    const carts = JSON.parse(cartsData);
    const cartIndex = carts.findIndex((c) => c.id === cartId); // Buscamos el índice del carrito
    const productIndex = carts[cartIndex].products.findIndex(
      (p) => p.product === productId
    ); // Buscamos el índice del producto en el carrito
    if (cartIndex !== -1) {
      if (productIndex !== -1) {
        // Si el producto ya existe en el carrito, incrementamos la cantidad
        carts[cartIndex].products[productIndex].quantity += quantity;
      } else {
        // Si el producto no existe en el carrito, lo agregamos
        carts[cartIndex].products.push({
          product: productId,
          quantity: quantity,
        });
      }
      await fs.writeFile(
        "./src/data/carts.json",
        JSON.stringify(carts, null, 2),
        "utf-8"
      ); // Actualizamos el archivo carrito.json
      res.json({ message: "Producto agregado al carrito correctamente" });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

// Función para generar un nuevo ID para un carrito (puede variar según la implementación)
function generateNewCartId() {
  // Implementación para generar un nuevo ID único (puede variar según la implementación)
  return Date.now().toString();
}

module.exports = router;
