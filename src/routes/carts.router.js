const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cartManager.js");
const cartManager = new CartManager("./src/models/carrito.json");

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
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);

    try {
        res.json(cart);
    } catch (error) {
        res.send('Error al intentar enviar los productos del carrito');
    }
});

// POST

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;

    const result = await cartManager.addToCart(cartId, productId, quantity);
    
    try {
        res.json(result);
    } catch (error) {
        res.send('Error al intentar guardar producto en el carrito');
    }
});

module.exports = router;