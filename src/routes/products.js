const express   =   require('express');
const router    =   express.Router();
const User      =   require('../models/User');
const Product   =   require('../models/Product');
const Cart      =   require('../models/Cart');
const Purchase      =   require('../models/Purchase');
const passport  =   require('passport');
const { isAuthenticated }    = require('../helpers/auth');
const { isSuperAuthenticated }    = require('../helpers/auth');
var mongoose = require('mongoose');



router.get('/products', isAuthenticated, async (req, res) => {
    const products = await Product.find().sort({date: 'desc'}).lean();
    res.render('products/all-products-cart', { products });
});

router.get('/new-product', isSuperAuthenticated, (req, res) => {
    res.render('products/new-product')
});

router.post('/new-product', isSuperAuthenticated, async (req, res) => {
    const { title, description, price } = req.body

    const errors = [];

    if(!title) {
        errors.push({text: 'Por favor escriba un titulo.'})

    }

    if(!description) {
        errors.push({text: 'Por favor escriba una descripcion.'})
    }

    if(!price) {
        errors.push({text: 'Por favor escriba un precio.'})
    }

    if(errors.length > 0){
        res.render('/new-product', { 
            errors,
            title,
            description
        });
    }
    else{
        const newProduct = new Product({title, description, price});
        await newProduct.save();
        req.flash('success_msg', 'Producto añadido exitosamente.');
        res.redirect('/crud_products');
    }

});

router.get('/crud_products', isSuperAuthenticated,  async (req, res) => {
    const products = await Product.find().sort({date: 'desc'}).lean();
    res.render('products/all-products-crud', { products });
});

router.delete('/delete-product/:id', isSuperAuthenticated, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Succcesfully');
    res.redirect('/crud_products');

});

router.get('/edit-product/:id', isSuperAuthenticated, async (req, res) => {
    const product = await Product.findById(req.params.id).lean();
    res.render('products/edit-product', { product });
});

router.put('/edit-product/:id', isSuperAuthenticated, async (req, res) => {
    const {title, description, price} = req.body;
    await Product.findByIdAndUpdate(req.params.id, {title, description, price}).lean();
    req.flash('success_msg', 'Note Updated Succcesfully');
    res.redirect('/crud_products');
});

router.post('/add-cart/:id', isAuthenticated, async (req, res) => {

    const product = await Product.findById(req.params.id).lean();
    const p_id = product._id.toString();
    const u_id = req.user._id.toString();
    const cart = new Cart({u_id, p_id});
    cart.product_id = p_id.toString();
    cart.user_id    = u_id.toString();
    await cart.save();

    /*
    res.send("Si se hizo")
    */
    
    res.redirect('/products')
    
});

router.get('/view-cart/', isAuthenticated, async (req, res) => {

    const u_id = req.user._id.toString();
    const cart_collection_ids = await Cart.find({user_id: u_id}, {_id: 0, product_id: 1}).lean();



    const cross_reference = []
    for (var i=0; i < cart_collection_ids.length; i++) {
        cross_reference.push(mongoose.Types.ObjectId(cart_collection_ids[i].product_id))
     }

    const products = []
    for (var i=0; i < cross_reference.length; i++) {
        const product = await Product.findById(cross_reference[i]).lean();
        products.push(product)
    }

    res.render("products/cart-products", { products });

});

router.delete('/delete-cart-product/:id', isAuthenticated, async (req, res) => {

    const u_id = req.user._id.toString();
    const p_id = req.params.id.toString();

    await Cart.deleteOne({ product_id : p_id, user_id : u_id});
    req.flash('success_msg', 'Note Deleted Succcesfully');
    res.redirect('/view-cart');

});

router.post('/purchase', isAuthenticated, async (req, res) => {

    const u_id = req.user._id.toString();
    const cart_collection_ids = await Cart.find({user_id: u_id}, {_id: 0, product_id: 1}).lean();

    const cross_reference = []
    for (var i=0; i < cart_collection_ids.length; i++) {
        cross_reference.push(mongoose.Types.ObjectId(cart_collection_ids[i].product_id))
     }

     const products = []
     for (var i=0; i < cross_reference.length; i++) {
         const product = await Product.findById(cross_reference[i]).lean();
         products.push(product)
     }

     var string_chida = ""
     var number_chido = 0

     for (var i=0; i < products.length; i++) {
        string_chida = string_chida + products[i].title + " " + products[i].price.toString() + "\n"
        number_chido = number_chido + products[i].price
      }

      const newPurchase = new Purchase();
      newPurchase.list = string_chida;
      newPurchase.price = number_chido;
      newPurchase.user_id = u_id;
      await newPurchase.save();

      await Cart.deleteMany({user_id : u_id});
      res.redirect("/view-purchase")
});

router.get('/view-purchase', isAuthenticated, async (req, res) => {
    const purchases = await Purchase.find().sort({date: 'desc'}).lean();
    res.render('products/view-purchases', { purchases });
});

module.exports = router;