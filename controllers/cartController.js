const Cart = require('../models/cart')

exports.addToCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.body;
  
      let cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        cart = await Cart.create({
          user: userId,
          items: [{ product: productId, quantity: 1 }]
        });
      } else {
  
        // safety check
        if (!cart.items) {
          cart.items = [];
        }
  
        const itemIndex = cart.items.findIndex(
          item => item.product.toString() === productId
        );
  
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += 1;
        } else {
          cart.items.push({ product: productId, quantity: 1 });
        }
  
        await cart.save();
      }
  
      res.status(200).json({
        success: true,
        cart
      });
  
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };
exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

      if (cart.items.length === 0) {
        return res.json({
          success: true,
          cart,
          message: "Cart is empty"
        })
      }
  
    res.json({
      success: true,
      cart
    });
  };