const express   =   require('express');
const router    =   express.Router();
const User      =   require('../models/User');
const passport  =   require('passport');

router.get('/', (req, res) => {
    res.render('users/login')
});

router.post('/users/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.get('/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

router.get('/users/signup', (req, res) => {
    res.render('users/signup')
});

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password} = req.body;
    const errors = [];

    if(password != confirm_password) {
        errors.push({ text: 'Pasword do not match.'})

    }

    if(name.length < 1){
        errors.push({ text: 'Name must be at least 1 characters.'})
    }

    if(password.length < 4){
        errors.push({ text: 'Pasword must be at least 4 characters.'})
    }

    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});

    }else {
        const emailUser = await User.findOne({email: email}).lean();

        if(emailUser){
            errors.push({ text: 'Este email ya existe.'})
            res.render('users/signup', {errors, name, email, password, confirm_password});
        }
        else {
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('succes_msg', 'Registro exitoso.');
            res.redirect('/');
        }
    }
});

module.exports = router;