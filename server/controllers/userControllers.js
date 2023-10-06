class UserControllers {
    static regis(req, res) {
        res.render("formPage");
    }
    static getDataRegis(req, res) {
        let { username, password } = req.body;
        let dataNow = {
            nama: username,
            kataSandi: password
        }

        res.render("dataPribadi", { dataNow });
    }
}

module.exports = UserControllers;