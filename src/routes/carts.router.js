const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();

// POST 

router.post('/', async (req, res) => {
    const cart = await cartManager.createCart();

    try {
        res.json(cart);
    } catch (error) {
        res.send("Error: No se pudo crear el carrito");

    }
});

// GET 
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    try {
        res.json(cart);
    } catch (error) {
        res.send('Error al intentar enviar los productos del carrito');
    }
});

// POST

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    const result = await cartManager.addProductToCart(cartId, productId, quantity);
    
    try {
        res.json(result);
    } catch (error) {
        res.send('Error al intentar guardar producto en el carrito');
    }
});

// DELETE

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.clearCart(cartId, productId);

        res.json({
            status: 'success',
            message: 'Producto eliminado del carrito correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});


router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        const updatedCart = await cartManager.emptyCart(cartId);

        res.json({
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

//PUT

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const prodId = req.params.pid
        const { quantity } = req.body

        const updatedCart = await cartManager.updateQuantity(cartId, prodId, quantity)
        res.json(updatedCart)
    } catch (error) {
        console.error("Error actualizando la cantidad de productos del carrito", error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
});


router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const newProds = req.body;

    try {

        const cart = await cartManager.getCartById(cartId)
        if (!cart) {
            return res.status(404).json({ error: `No se ha encontrado el carrito con ID: ${cartId}.` })
        }


        const updatedCart = await cartManager.updateCart(cartId, newProds)

        res.json(updatedCart)
    } catch (error) {
        console.error("Error actualizando el carrito", error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

module.exports = router;