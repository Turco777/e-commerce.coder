const express = require("express");
const router = express.Router();
const fs = require("fs/promises"); // Importamos fs/promises para trabajar con el sistema de archivos de Node.js de forma asíncrona

// Ruta para listar todos los productos
router.get("/", async (req, res) => {
  try {
    const productsData = await fs.readFile(
      "./src/data/products.json",
      "utf-8"
    ); // Leemos el archivo productos.json
    const products = JSON.parse(productsData); // Convertimos los datos del archivo a un objeto JavaScript
    res.json(products); // Respondemos con la lista de productos en formato JSON
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la lista de productos" });
  }
});

// Ruta para obtener un producto por su ID
router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid; // Obtenemos el ID del producto desde los parámetros de la URL
    const productsData = await fs.readFile(
      "./src/data/productss.json",
      "utf-8"
    );
    const products = JSON.parse(productsData);
    const product = products.find((p) => p.id === productId); // Buscamos el producto por su ID
    if (product) {
      res.json(product); // Respondemos con el producto encontrado en formato JSON
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// Ruta para agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const newProduct = req.body; // Obtenemos el nuevo producto desde el cuerpo de la solicitud (request)
    const productsData = await fs.readFile(
      "./src/data/products.json",
      "utf-8"
    );
    const products = JSON.parse(productsData);
    // Generamos un nuevo ID para el producto (este paso puede variar según la implementación)
    const newProductId = generateNewProductId();
    newProduct.id = newProductId;
    products.push(newProduct); // Agregamos el nuevo producto a la lista de productos
    await fs.writeFile(
      "./src/data/products.json",
      JSON.stringify(products, null, 2),
      "utf-8"
    ); // Actualizamos el archivo productos.json
    res.status(201).json(newProduct); // Respondemos con el nuevo producto en formato JSON
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

// Ruta para actualizar un producto por su ID
router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid; // Obtenemos el ID del producto desde los parámetros de la URL
    const updatedProduct = req.body; // Obtenemos los datos actualizados del producto desde el cuerpo de la solicitud (request)
    const productsData = await fs.readFile(
      "./src/data/products.json",
      "utf-8"
    );
    const products = JSON.parse(productsData);
    const existingProductIndex = products.findIndex((p) => p.id === productId); // Buscamos el índice del producto existente
    if (existingProductIndex !== -1) {
      // Actualizamos el producto en la lista de productos
      products[existingProductIndex] = {
        ...products[existingProductIndex],
        ...updatedProduct,
      };
      await fs.writeFile(
        "./src/data/products.json",
        JSON.stringify(products, null, 2),
        "utf-8"
      ); // Actualizamos el archivo productos.json
      res.json(products[existingProductIndex]); // Respondemos con el producto actualizado en formato JSON
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// Ruta para eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid; // Obtenemos el ID del producto desde los parámetros de la URL
    const productsData = await fs.readFile(
      "./src/data/products.json",
      "utf-8"
    );
    const products = JSON.parse(productsData);
    const updatedProducts = products.filter((p) => p.id !== productId); // Filtramos los productos para excluir el producto a eliminar
    if (updatedProducts.length < products.length) {
      await fs.writeFile(
        "./src/data/products.json",
        JSON.stringify(updatedProducts, null, 2),
        "utf-8"
      ); // Actualizamos el archivo productos.json
      res.json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

// Función para generar un nuevo ID para un producto (puede variar según la implementación)
function generateNewProductId() {
  // Implementación para generar un nuevo ID único (puede variar según la implementación)
  return Date.now().toString();
}

module.exports = router;
