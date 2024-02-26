const CartModel = require("../models/cart.model.js");


class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log('No se pudo crear el nuevo carrito', error)
        }
    }

    async getCartById(CartId) {
        try {

            const cart = CartModel.findById(CartId);
            if (!cart) {
                console.log('No existe ese carrito con id:' + CartId)
                return { status: 400, msg: "Not Found, no existe ese carrito." };
            }
            return cart;

        } catch (error) {

            console.log('No se pudo traer el carrito', error)
        }
    }

    async addProductToCart(cartId, prodId, quantity = 1) {
        try {

            const carts = await this.getCartById(cartId);
            const cartExist = carts.product.find(item => item.product.toString() === prodId);

            if (cartExist) {
                cartExist.quantity += quantity;
            } else {
                carts.product.push({ product: prodId, quantity });
            }

            carts.markModified("products");

            await carts.save();
            return carts;

        } catch (error) {

            console.log('No se pudo agregar el producto al carrito', error)

        }
    }
    async clearCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.product = cart.product.filter(item => item.product._id.toString() !== productId);

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito en el gestor', error);
            throw error;
        }
    }
    // Vaciar Carrito
    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito en el gestor', error);
            throw error;
        }
    }


    async updateQuantity(cartId, prodId, newQuantity) {
        try {
            //Verifica si existe el carrito
            const cart = await this.getCartById(cartId)
            if (!cart) {
                console.error(`No existe ningun carrito con ID: ${cartId}`)
                return null
            }

            //Verifica si existe el producto en el carrito
            const prodToUpdate = cart.product.find(p => p.product.equals(prodId))
            if (!prodToUpdate) {
                console.error(`El producto con ID ${prodId} no se encontró en el carrito.`)
                return null
            }

            prodToUpdate.quantity = newQuantity;

            await cart.save()
            return cart
        } catch (error) {
            console.error("Error actualizando cantidad en el carrito", error)
            throw error
        }
        
    }
    async updateCart(cartId, newProds) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(cartId, { products: newProds }, { new: true })
            return updatedCart
        } catch (error) {
            console.error("Error actualizando el carrito:", error)
            throw error;
        }
    }
}


module.exports = CartManager;