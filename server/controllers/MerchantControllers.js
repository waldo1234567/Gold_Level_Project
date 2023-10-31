const db = require('./dbs');

class MerchantControllers {
    static async showAllMerchantInformation(req, res) {
        try {
            const allMerchantInfo = await db('merchant').select('*');
            res.status(200).json(allMerchantInfo);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    static async registerMerchant(req, res) {
        const {
            shop_name,
            first_name,
            last_name,
            email,
            password,
            shop_address,
            shop_phone_number,
            id_category
        } = req.body;
        if (!shop_name || !email || !password || !id_category) {
            return res.status(400).json({ error: "Username, email, password, category are required." });
        }
        const checkCategory = await db('category').where('id', id_category).first();
        if (!checkCategory) {
            return res.status(400).json({ message: 'Invalid Category' });
        }
        try {
            console.log(checkCategory);
            const newInput = {
                shop_name,
                first_name,
                last_name,
                email,
                password,
                shop_address,
                shop_phone_number,
                id_category
            };
            const newMerchant = await db('merchant').insert(newInput).returning('*');
            console.log(id_category);
            res.status(201).json(newMerchant); 1
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }

    static async deleteMerchantAccount(req, res) {
        const { idInput } = req.params
        try {
            await db('merchant').where('id', idInput).del();
            res.status(200).json({ message: 'successfully deleted !' });
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async updateMerchantInfo(req, res) {
        const {
            idInput,
            ...updatedData
        } = req.body;
        console.log('idInput:', idInput);
        if (!idInput) {
            return res.status(400).json({ error: "Merchant ID is required." });
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
            console.log(userInput);
            const newUpdateData = await db('merchant').where('id', idInput).update(userInput).returning('id');
            res.status(201).json({ message: 'successfully updated your data!', newUpdateData });
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }

    static async searchMerchantById(req, res) {
        const { idInput } = req.params;
        if (!idInput) {
            return res.status(400).json({ error: "User ID is required." });
        }
        try {
            const getData = await db('merchant').where('id', idInput).select('*')
            res.status(200).json(getData);
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async loginMerchant(req, res) {
        const { email, password } = req.body;
        try {
            const user = await db('merchant').where('email', email).first();
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            if (user.password !== password || password === null || undefined) {
                return res.status(400).json({ message: 'username or password is wrong!' })
            }
            else if(!user && user.password !== password || password === null || undefined){
                return res.status(400).json({message : 'please type in your username and password!'})
            }
            res.status(201).json({ message: 'succesfully login!' });

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

}

module.exports = MerchantControllers;