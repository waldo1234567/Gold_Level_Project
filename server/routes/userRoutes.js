const routes = require('express').Router();
const UserControllers = require('../controllers/userControllers');

routes.get('/allUserInfo', UserControllers.showAllUserInformation);
routes.post('/registerUser', UserControllers.registerUser);
routes.delete('/deleteUser/:idInput', UserControllers.deleteUser);
routes.patch('/updateUser', UserControllers.updateInfoUser);
routes.get('/getUserById/:idInput', UserControllers.searchUserById);
routes.post('/login',UserControllers.loginUser);
routes.get('/login', (req, res) => {
    res.render('login');
});
routes.post('/logout', UserControllers.logoutUser);
routes.get('/logout', UserControllers.logoutUser);

routes.get('/showRegisterUser', (req,res)=>{
    res.render('register');
})
routes.post('/userRegister', UserControllers.registerUser);

module.exports = routes;
