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
  }

  exports.getCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.id })
        .populate("items.product");
  
      //  no cart
      if (!cart) {
        return res.json({
          success: true,
          cart: { items: [] },
          message: "Cart is empty"
        });
      }
  
      // ✅ empty items
      if (!cart.items || cart.items.length === 0) {
        return res.json({
          success: true,
          cart: { items: [] },
          message: "Cart is empty"
        });
      }
  
      res.json({
        success: true,
        cart
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

exports.updateQuantity = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;
  
      // validation
      if (!productId || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid data"
        });
      }
  
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found"
        });
      }
  
      const item = cart.items.find(
        item => item.product.toString() === productId
      );
  
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Product not in cart"
        });
      }
  
      // update quantity
      item.quantity = quantity;
  
      await cart.save();
  
      res.json({
        success: true,
        message: "Quantity updated",
        cart
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
}

exports.removeItem = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.body;
  
      // ✅ FIX 1: validate
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required"
        });
      }
  
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart || !cart.items) {
        return res.status(404).json({
          success: false,
          message: "Cart is empty"
        });
      }
  
      const initialLength = cart.items.length;
  
      cart.items = cart.items.filter(item => {
        if (!item.product) return false;
  
        return item.product.toString() !== String(productId);
      });
  
      if (cart.items.length === initialLength) {
        return res.status(404).json({
          success: false,
          message: "Product not found in cart"
        });
      }
  
      await cart.save();
  
      res.json({
        success: true,
        message: "Item removed",
        cart
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };