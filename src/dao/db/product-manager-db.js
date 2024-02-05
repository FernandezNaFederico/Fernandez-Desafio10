const ProductModel = require("../models/product.model.js");

class ProductManager {
    async addProduct(newObject) {
        let {title, description, price, thumbnail,code, stock, category = [], status = true} = newObject;
        //let existingProducts = await this.readFile();

        if(!title || !description || !code || !category)
        {
            console.log("Todos los campos son requeridos, compltalos o hasta la vista beibi");
            return { status: 400, msg: "Error: Te faltó uno de los campos de texto, recordá que todos son obligatorios (title, description, code, category)" };
        }

        if (typeof price !== 'number' || typeof stock !== 'number') {
            console.log("Poner el precio y el stock en valores numerico por favor");
            return { status: 400, msg: "Error: Recuerda que precio y stock son valores numericos." };
        }

        /*if(existingProducts.some(item => item.code === code)){
            console.log("Que sea un codigo unico por favor");
            return;
        }*/

        const existingProducts = await ProductModel.findOne({code: code});

        if(existingProducts) {
            console.log("Que sea un codigo unico por favor");
            return;
        }

        const newProduct = new ProductModel({
            //id: existingProducts.length > 0 ? Math.max(...existingProducts.map(p => p.id)) + 1 : 1,
            title,
            description,
            price: Number(price),
            thumbnail,
            code,
            stock: Number(stock),
            status,
            category
        });

        await newProduct.save();

        //this.products.push(newProduct);
        //const updatedProducts = [...existingProducts, newProduct];

        //await this.saveFile(updatedProducts);
        //console.log("El producto se agregó con éxito.");
        //return newProduct;

    }

    async getProducts() {
        try {
            const productos = await ProductModel.find();
            return productos;
        } catch (error) {
            console.log("Error al obtener los productos", error);
        }
    }

    async getProductsById(id) {
        try {
            const producto = await ProductModel.findById(id);

            if (!producto) {
                console.log("Producto no encontrado");
                return null;
            }

            console.log("Producto encontrado");
            return producto;
        } catch (error) {
            console.log("Error al traer un producto por id");
        }
    }

    async updateProduct(id, productUpdated) {
        try {

            const updateado = await ProductModel.findByIdAndUpdate(id, productUpdated);

            if (!updateado) {
                console.log("No se encuentra che el producto");
                return null;
            }

            console.log("Producto actualizado con exito, como todo en mi vidaa!");
            return updateado;
        } catch (error) {
            console.log("Error al actualizar el producto", error);

        }
    }

    async deleteProduct(id) {
        try {

            const deleteado = await ProductModel.findByIdAndDelete(id);

            if (!deleteado) {
                console.log("No se encuentraaaa, busca bien!");
                return null;
            }

            console.log("Producto eliminado correctamente!");
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }

}

module.exports = ProductManager;