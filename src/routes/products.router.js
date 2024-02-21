const express = require("express");
const router = express.Router();
const ProductModel = require("../dao/models/product.model.js");
const ProductManager = require("../dao/db/product-manager-db.js");
const prodManager  = new ProductManager();

//GET
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await prodManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});


// GET
router.get('/:pid', async (req, res) => {
    try {
        let pid = req.params.pid;
        const prod = await prodManager.getProductById(pid);
        if (prod) {
            res.json(prod)
        } else {
            res.status(404).json({msg: "Not Found"})
        }

    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});

// POST
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;

        const response = await prodManager.addProduct({ title, description, code, price, stock, category, thumbnails, status });
        res.status(400).json(response,{msg: "Producto agregado correctamente"})

    } catch (error) {
        console.log(error)
        res.send(`Error al intentar agregar un producto`)
    }
});

// PUT
router.put('/:pid', async (req, res) => {

    let pid = req.params.pid;
    const prod = await prodManager.getProductById(pid);

    try {
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;
        const response = await prodManager.updateProduct(pid, { title, description, code, price, stock, category, thumbnails, status });
        if (prod !== null) {
            res.send('Producto actualizado con exito!');
        } else {
            res.send(`Parece que el producto con id ${pid} no existe.`)
        }
    } catch (error) {
        console.log(error)
        res.send(`Error al intentar editar el producto con id ${pid}`)
    }
});


// DELETE
router.delete('/:pid', async (req, res) => {
    let pid = req.params.pid;
    console.log('Valor de pid:', pid);
    try {
        await prodManager.deleteProduct(pid)
        res.send(`Producto ${pid} eliminado correctamente`)
    } catch (error) {
        console.log(error)
        res.send(`Error al intentar eliminar el producto con id ${pid}`)
    }
});


module.exports = router;


