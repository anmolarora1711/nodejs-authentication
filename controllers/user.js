const genPassword = require('../utilities/password').genPassword;
const User = require("../models/user");

module.exports.login = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/dashboard');
    }
    return res.render('login', {
        title: 'Login',
    });
}

module.exports.register = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/dashboard');
    }
    return res.render('register', {
        title: 'Regisiter',
    });
}

module.exports.create = async function(req, res){

    const { name, email, password, password2 } = req.body;

    const errors = [];

    if(!name || !email || !password || !password2){
        errors.push({ message: 'Please fill all the fields' });
    }

    if(password !== password2){
        errors.push({ message: 'Incorrect Password' });
    }

    if(password.length < 6){
        errors.push({ message: 'Password must be of atleast 6 characters' });
    }

    if(errors.length > 0){
        res.render('register', {
            title: 'Register',
            errors,
            name,
            email,
            password,
            password2,
        });
    }else{
        try{
            let user = await User.findOne({
                email,
            });
            if(user){
                errors.push({ message: 'Email already exists' });
                res.render('register', {
                    title: 'Register',
                    errors,
                    name,
                    email,
                    password,
                    password2,
                });
            }else{
                const saltHash = genPassword(password);

                const salt = saltHash.salt;
                const hash = saltHash.hash;

                const newUser = new User({
                    name,
                    email,
                    salt,
                    hash,
                });
                await newUser.save();
                req.flash('success_msg', 'Registered successfully');
                res.redirect('/user/login');
            }
        }catch(err){
            console.log(err);
        }
    }
}

module.exports.createSession = function(req, res){
    req.flash('success_msg', 'Logged in successfully');
    return res.redirect('/dashboard');
}

module.exports.resetPassword = async (req, res) => {
    const { password } = req.body;
    const errors = [];
    if (!password) {
        errors.push({ message: 'Please fill all the fields' });
    }

    if (password.length < 6) {
        errors.push({ message: 'Password must be of atleast 6 characters' });
    }

    if (errors.length > 0) {
        try {
            user = await User.findById(req.params.id);
        } catch(err) {
            console.log(err);
        }
        res.render('dashboard', {
            title: 'Dashboard',
            errors,
            password,
            user,
        });
    } else {
        try {
            user = await User.findById(req.params.id);
            
            // to make password hashed
            const saltHash = genPassword(password);
            const salt = saltHash.salt;
            const hash = saltHash.hash;
            user.salt = salt;
            user.hash = hash;
            await user.save();
            req.flash('success_msg', 'Password reset successfully');
            return res.redirect('/dashboard');
        } catch (err) {
            console.log(err);
            return res.redirect('/dashboard');
        }
    }
}

module.exports.logout = function(req, res){
    req.logout();
    req.flash('success_msg', 'Logged out successfully');
    return res.redirect('/user/login');
}
