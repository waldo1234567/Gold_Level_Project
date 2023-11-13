const db = require('./dbs');
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require('fs').promises;
const path = require('path');
const { unlink } = require('fs');
const { error } = require('console');
const cloudinary = require('../config/clodinary');
const cartData = require('../controllers/CartControllers');


class ProductControllers {
    static async showProductPage(req, res) {
        try {
            const user = req.session.user || {};
            console.log(user);

            const data = await db('product').select('*');
            const category = await db('category').select('*');
            let cartDataFunction;
            let totals;
            if (user.hasLogin && user.cartId) {
                cartDataFunction = await cartData.getCartData({ body: { cartId: user.cartId } });
                totals = await db('cart').where('id_user', user.id).select('total');
                console.log(totals);
            }
            res.render('product', { dataProduct: data, categories: category, user: user, currentCart: cartDataFunction, totals: totals });
        } catch (error) {
            console.log(error);
            console.error('User or cartId is undefined in the session.');
        }
    }

    static async shwoAddProductPage(req, res) {
        try {
            const category = await db('category').select('*');
            res.render('uploadProduct', { categories: category });
        } catch (error) {
            console.log(error)
        }
    }

    static async showEditProduct(req,res){
        try {
            const productId = req.query.id;
            if (!productId) {
                return res.status(400).json({ error: "Product ID is required." });
            }
            const productData = await db('product').where('id', productId).select('*');
            const category = await db('category').select('*');
            res.render('editProduct', { productId: productId , product:productData,categories:category});
            console.log(productData);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async showAllProducts(req, res) {
        try {
            const allProducts = await db('product').select('*');
            res.status(200).json(allProducts);
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
        res.render('index');
    }

    static async addNewProduct(req, res) {
        const {
            product_name,
            description,
            stock,
            price,
            id_category
        } = req.body
        // console.log(req.body);
        if (!product_name || !stock || !price || !id_category) {
            return res.status(400).json({ error: "Input is invalid!" });
        }
        const checkCategory = await db('category').where('id', id_category).first();
        if (!checkCategory) {
            return res.status(400).json({ message: 'Invalid Category' });
        }
        const tempFilePath = path.join(__dirname, 'temp', 'temp_image.txt');

        try {

            await fs.writeFile(tempFilePath, req.file.buffer);


            const result = await cloudinary.uploader.upload(tempFilePath, {
                resource_type: 'auto',
        
            });

            const userInput = {
                product_name,
                description,
                stock,
                price,
                id_category,
                image_url: result.secure_url,
                cloudinary_id: result.public_id
            }
            console.log(userInput);
            await db('product').insert(userInput).returning('*');

            const updatedDb = await db('product').select('*');
            const category = await db('category').select('*');
            console.log(updatedDb);
            res.redirect('/products/showAllDataPage');
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        } finally {
            const fileExists = await fs.access(tempFilePath).then(() => true).catch(() => false);
            if (fileExists) {
                await fs.unlink(tempFilePath).catch(error => {
                    console.error(`Error deleting file: ${error.message}`);
                });
            }
        }
    }

    static async updateProduct(req, res) {
        const productId = req.params.id;
        console.log(productId);
        const {
            ...updatedData
        } = req.body;

        if (!productId) {
            return res.status(400).json({ error: "Product ID is required." });
        }
        try {
            if ('id_category' in updatedData && updatedData.id_category !== null) {
                const checkCategory = await db('category').where('id', updatedData.id_category).first();
                if (!checkCategory) {
                    return res.status(400).json({ message: 'Invalid Category' });
                }
            }
            const userInput = {};
            for (const data in updatedData) {
                userInput[data] = updatedData[data]
            }
            const newUpdateData = await db('product').where('id', productId).update(userInput).returning('id');
            res.redirect('/products/showAllDataPage');
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    static async removeProduct(req, res) {
        const { idInput } = req.params
        try {
            await db('product').where('id', idInput).del();
            res.status(200).json({ message: 'successfully deleted !' });
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    static async getProductById(req, res) {
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

    static async sortByCategory(req, res) {
        const selectedCategories = req.body.categories;
        console.log(selectedCategories);

        function filterProductsByCategory(selectedCategories) {

            try {
                const categoryIds = db('category')
                    .where('category_name', selectedCategories)
                    .select('id');

                const products = db('product')
                    .whereIn('id_category', categoryIds)
                    .select('*');
                return products;
            } catch (error) {
                throw error
            }
        }

        try {
            const products = await filterProductsByCategory(selectedCategories);
            console.log(products);
            return res.render('filteredProduct', { dataProduct: products });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = ProductControllers;