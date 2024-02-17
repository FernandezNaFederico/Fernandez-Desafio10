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

    const result = await cartManager.addToCart(cartId, productId, quantity);
    
    try {
        res.json(result);
    } catch (error) {
        res.send('Error al intentar guardar producto en el carrito');
    }
});

// DELETE

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid
    try {
        await cartManager.clearCart(cartId)
        res.status(200).json({ message: 'Se han eliminado todos los productos satisfactoriamente.' })
    } catch (error) {
        console.error("Error al intentar borrar los productos en el carrito", error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
});


router.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const prodId = req.params.pid

    try {
        const cart = await cartManager.getCartById(cartId)
        if (!cart) {
            return res.status(404).json({ error: `Cart with id ${cartId} not found` })
        }

        await cartManager.deleteFromCart(cartId, prodId)
        res.json({ message: `El producto con el id ${prodId} se ha eliminado del carrito ${cartId}` })
    } catch (error) {
        console.error("Error borrando el producto del carrito", error)
        res.status(500).json({ error: 'Internal Server Error' })
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
    const newProds = req.body.products;

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