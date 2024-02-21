const fs = require("fs");

class ProductManager {

    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
        this.productId = 0;
    }

    async addProduct(newObject) {
        let {title, description, price, thumbnail,code, stock, category = [], status = true} = newObject;
        let existingProducts = await this.readFile();

        if(!title || !description || !code || !category)
        {
            console.log("Todos los campos son requeridos, compltalos o hasta la vista beibi");
            return { status: 400, msg: "Error: Te faltó uno de los campos de texto, recordá que todos son obligatorios (title, description, code, category)" };
        }

        if (typeof price !== 'number' || typeof stock !== 'number') {
            console.log("Poner el precio y el stock en valores numerico por favor");
            return { status: 400, msg: "Error: Recuerda que precio y stock son valores numericos." };
        }

        if(existingProducts.some(item => item.code === code)){
            console.log("Que sea un codigo unico por favor");
            return;
        }

        const newProduct = {
            id: existingProducts.length > 0 ? Math.max(...existingProducts.map(p => p.id)) + 1 : 1,
            title,
            description,
            price: Number(price),
            thumbnail,
            code,
            stock: Number(stock),
            status,
            category
        }

        this.products.push(newProduct);
        const updatedProducts = [...existingProducts, newProduct];


        await this.saveFile(updatedProducts);
        console.log("El producto se agregó con éxito.");
        return newProduct;

    }

    async getProducts() {
        if (!this.products || this.products.length === 0) {
            return this.readFile()
        }
        return this.products;
    }

    async getProductsById(id) {
        try {
            const arrayProducts = await this.readFile();
            const searching = arrayProducts.find(item => item.id === id);

            if(!searching) {
                console.log("Producto no encontrado");
                return null;
            }else {
                console.log("Yes, lo encontramos!");
                return searching;
            }

        } catch (error) {
            console.log("Error al leer el archivo", error);
        }

    }

    async readFile() {
        try{
            const answer = await fs.readFileSync(this.path, "utf-8");
            const arrayProducts = JSON.parse(answer);
            return arrayProducts;

        } catch (error) {
            console.log("Error al leer un archivo", error);
            return [];
        }
    }

    async saveFile(arrayProduct) {
        try {
            await fs.writeFileSync(this.path, JSON.stringify(arrayProduct, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    }

    async updateProduct(id,productUpdated) {
        try {
            const arrayGame = await this.readFile();

            const index = arrayGame.findIndex(item => item.id === id);

            if(index !== -1) {

                const gameReplaced = { ...arrayGame[index], ...productUpdated }
                arrayGame.splice(index, 1, gameReplaced);
                await this.saveFile(arrayGame);
                console.log("Juego Actualizado Correctamente")
                return gameReplaced;
            } else {
                console.log("no se encuentra producto");
            }

        } catch (error){
            console.log("Error al actualizar el producto", error);
        }
    }

    async deleteProduct(id) {
        try {
            const productsArray = await this.readFile();

            const index = productsArray.findIndex(item => item.id === id);
            console.log("ID a eliminar:", id);
            console.log("ID de productos en el array:", productsArray.map(item => item.id));

            if(index !== -1) {
                productsArray.splice(index, 1);
                await this.saveFile(productsArray);
                console.log("Producto eliminado correctamente")
            } else {
                console.log("no se encuentra producto");
            }

        } catch (error){
            console.log("Error en la eliminacion del producto", error);
        }
    }

}

module.exports = ProductManager;