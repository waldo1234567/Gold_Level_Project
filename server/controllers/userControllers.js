const db = require('./dbs')

class UserControllers {
    static async showAllUserInformation(req, res) {
        try {
            const allUserInfo = await db('user').select('*');
            res.status(200).json(allUserInfo);
        } catch (error) {
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
                res.status(201).json(newData);
            }

        } catch (error) {
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
        console.log('idInput:', idInput);
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

module.exports = UserControllers;