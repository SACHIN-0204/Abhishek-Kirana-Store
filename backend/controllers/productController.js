const Product = require("../models/Product.js");
const cloudinary = require("../config/cloudinary.js");

// @desc    Get all products
const getProducts = async (req, res) => {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get a single product by ID
const getProductById = async (req, res) => {
    try {
       const product = await Product.findById(req.params.id);
       if (!product) {
         return res.status(404).json({ message: "Product not found" });
       }
       res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};

// @desc    Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        let imageUrl = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update a product
const updateProduct = async (req, res) => {
    try {
      const { name, description, price, category, stock } = req.body;
      const product = await Product.findById(req.params.id);
      if (product) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path);
          product.imageUrl = result.secure_url;
        }
        await product.save();
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};

// @desc    Delete a product
const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      await product.deleteOne();
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
      console.log(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};