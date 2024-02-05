const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();

//GET

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const allProds = await productManager.getProducts();


        if (!isNaN(limit)) {
            const limitedProducts = allProds.slice(0, limit);
            res.json(limitedProducts);
        } else {
            res.json(allProds);
        }

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});


router.get('/game/:pid', async (req, res) => {
    try {
        let pid = req.params.pid;
        const sought = await productManager.getProductsById(pid);
        const error = { Error: "Producto no encontrado" };
        if (sought) {
            res.send(sought)
        } else {
            res.send({ error })
        }

    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
});

// POST
router.post('/', async (req, res) => {
    try {
        const { title, description, price,category, thumbnail, code, stock, status } = req.body;

        const response = await productManager.addProduct({ title, description,category, price, thumbnail, code, stock, status });
        res.json(response);
    } catch (error) {
        console.log(error)
        res.send(`Error al intentar agregar un producto`)
    }
});

  // PUT
router.put('/:pid', async (req, res) => {
    let pid = req.params.pid;
    const prod = await productManager.getProductsById(pid);

    try {
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;
        const response = await productManager.updateProduct(pid, { title, description, code, price, stock, category, thumbnails, status });
        res.json(response);
    } catch (error) {
        console.log(error)
        res.send("Error al editar el producto")
    }
});

  // DELETE
router.delete('/:pid', async (req, res) => {
    let pid = req.params.pid;
    console.log("Valor de pid:", pid);
    try {
        await productManager.deleteProduct(pid)
        res.send("Producto eliminado correctamente")
    } catch (error) {
        console.log(error)
        res.send(`Error al intentar eliminar el producto con id ${pid}`)
    }
});

module.exports = router;