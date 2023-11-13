const db = require('./dbs')

class UserControllers {
    static async showAllUserInformation(req, res) {
        try {
            const allUserInfo = await db('user').select('*');
            res.status(200).json(allUserInfo);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    static async registerUser(req, res) {
        const {
            username,
            first_name,
            last_name,
            email,
            password,
            address,
            phone_number
        } = req.body;

        try {
            const userInput = {
                username,
                first_name,
                last_name,
                email,
                password,
                address,
                phone_number
            };
            const newData = await db('user').insert(userInput).returning('id');
            if (!username || !email || !password) {
                return res.status(400).json({ error: "Username, email, and password are required." });
            } else {
                console.log('username:', username);
                res.redirect('/products/showAllDataPage');
            }

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    static async deleteUser(req, res) {
        const { idInput } = req.params;

        try {
            await db('user').where('id', idInput).del();
            res.status(200).json({ message: 'successfully deleted !' });
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async updateInfoUser(req, res) {
        const {
            idInput,
            ...updatedData
        } = req.body;
        // console.log('idInput:', idInput);
        if (!idInput) {
            return res.status(400).json({ error: "User ID is required." });
        }
        try {
            const userInput = {};
            for (const data in updatedData) {
                userInput[data] = updatedData[data]
            }
            const newUpdateData = await db('user').where('id', idInput).update(userInput).returning('id');
            res.status(201).json({ message: 'successfully updated your data!', newUpdateData });
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }

    static async searchUserById(req, res) {
        const { idInput } = req.params;
        if (!idInput) {
            return res.status(400).json({ error: "User ID is required." });
        }
        try {
            const getData = await db('user').where('id', idInput).select('*')
            res.status(200).json(getData);
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async loginUser(req, res) {
        const { username, password } = req.body;

        try {
            const user = await db('user').where('username', username).first();
            if (!user || user.password !== password || password === null || password === undefined) {
                return res.status(400).json({ message: 'Username or password is wrong!' });
            }

            if (req.session.user && req.session.user.hasLogin) {
                return res.status(400).json({ message: 'User is already logged in' });
            }
            await db('user').where('username', username).update({ hasLogin: true });
            if (!user.hasCart) {
                const newCartId = await db('cart').insert({
                    id_user: user.id,
                    total: 0
                }).returning('*');
                if (newCartId && newCartId.length > 0) {
                    req.session.cartId = parseInt(newCartId[0].id);
                    console.log('this is for cart ', req.session.cartId);
                    await db('user').where('id', user.id).update({ hasCart: true });
                }
                else{
                    console.error('Error creating cart for user:', user.id);
                }
                

            }

            req.session.user = {
                id: user.id,
                username: user.username,
                hasLogin: true,
                cartId: req.session.cartId
            };

            res.redirect('/products/showAllDataPage');

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    static async logoutUser(req, res) {
        try {
            const username = req.session.user.username;
            const user = await db('user').where('username', username).first();
            // console.log(req.session.user);
            // console.log(req.session.user.hasLogin);
            if (!req.session.user || !req.session.user.hasLogin) {
                return res.status(400).json({ message: 'User not logged in 1' });
            }

            // console.log(username);

            // console.log(user);
            if (!user || !user.hasLogin) {
                return res.status(400).json({ message: 'User not logged in 2' });
            }
            await db('cart').where('id_user', user.id).del();
            await db('user').where('username', username).update({ hasLogin: false, hasCart: false });

            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal server error 1' });
                }
            });
            res.redirect('/products/showAllDataPage');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error 2' });
        }
    }

}

module.exports = UserControllers;