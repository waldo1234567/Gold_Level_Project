const db = require('./dbs');

class ProductControllers {
    static async showAllProducts(req, res) {
        try {
            const allProducts = await db('product').select('*');
            res.status(200).json(allProducts);
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }

    }

    static async addNewProduct(req, res) {
        const {
            product_name,
            description,
            stock,
            price,
            id_category
        } = req.body
        if (!product_name || !stock || !price || !id_category) {
            return res.status(400).json({ error: "Input is invalid!" });
        }
        const checkCategory = await db('category').where('id', id_category).first();
        if (!checkCategory) {
            return res.status(400).json({ message: 'Invalid Category' });
        }
        try {
            const userInput = {
                product_name,
                description,
                stock,
                price,
                id_category
            }
            await db('product').insert(userInput).returning('*');
            res.status(201).json({ message: 'product successfully added!' });
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }

    static async updateProduct(req, res) {
        const {
            idInput,
            ...updatedData
        } = req.body;
        if (!idInput) {
            return res.status(400).json({ error: "Product ID is required." });
        }
        try {
            if ('id_category' in updatedData && updatedData.id_category !== null) {
                const checkCategory = await db('category').where('id', updatedData.id_category).first();
                if(!checkCategory){
                    return res.status(400).json({ message: 'Invalid Category' });
                }
            }
            const userInput = {};
            for (const data in updatedData) {
                userInput[data] = updatedData[data]
            }
            const newUpdateData = await db('product').where('id', idInput).update(userInput).returning('id');
            res.status(201).json({ message: 'successfully updated your product!', newUpdateData });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    static async removeProduct(req,res){
        const { idInput } = req.params
        try {
            await db('product').where('id', idInput).del();
            res.status(200).json({ message: 'successfully deleted !' });
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    static async getProductById(req,res){
        const { idInput } = req.params;
        if (!idInput) {
            return res.status(400).json({ error: "Product ID is required." });
        }
        try {
            const getData = await db('product').where('id', idInput).select('*')
            res.status(200).json(getData);
        } catch (error) {
            res.status(500).json(error)
        }
    }

}

module.exports = ProductControllers;