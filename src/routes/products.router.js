const express = require("express");
const router = express.Router();
const ProductModel = require("../dao/models/products.model.js")
const ProductManager = require("../dao/db/product-manager-db.js");
const prodManager  = new ProductManager();

//GET
router.get('/', async (req, res) => {
    try {
        let { limit, page, sort, query: filterQuery } = req.query
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;


        let sortProd = {};

        if (sort) {
            sortProd.price = (sort === 'asc') ? 1 : -1;
        }


        const filter = {}
        if (filterQuery) {
            filter.category = filterQuery;
        }


        const allProds = await ProductModel.paginate(filterOptions, { limit, page, sort: sortOptions });


        const prodsResult = allProds.docs.map(prod => {
            const { id, ...rest } = prod.toObject()
            return rest
        })


        const prev = allProds.hasPrevPage ? `/api/products?limit=${limit}&page=${allProds.prevPage}&sort=${sort}&query=${filterQuery}` : null
        const next = allProds.hasNextPage ? `/api/products?limit=${limit}&page=${allProds.nextPage}&sort=${sort}&query=${filterQuery}` : null


        const response = {
            status: 'success',
            payload: prodsResult,
            totalDocs: allProds.totalDocs,
            totalPages: allProds.totalPages,
            prevPage: allProds.prevPage,
            nextPage: allProds.nextPage,
            page: allProds.page,
            hasPrevPage: allProds.hasPrevPage,
            hasNextPage: allProds.hasNextPage,
            prev,
            next
        }
        
        res.json(response)

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// GET
router.get('/:pid', async (req, res) => {
    try {
        let pid = req.params.pid;
        const prod = await prodManager.getProductById(pid);
        const error = { Error: 'Lo sentimos! no se ha encontrado el producto que andas buscando.' };
        if (prod) {
            res.json(prod)
        } else {
            res.json({ error })
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
        res.json(response)
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