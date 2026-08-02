require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const seedDatabase = async () => {
    await connectDB();

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const hashedUserPassword = await bcrypt.hash("user123", 10);

    const adminUser = await User.create({
        username: "admin",
        email: "admin@abhishekkirana.com",
        password: hashedAdminPassword,
        role: "admin",
        verified: true,
    });

    const regularUser = await User.create({
        username: "user",
        email: "user@abhishekkirana.com",
        password: hashedUserPassword,
        role: "user",
        verified: true,
    });

    const products = await Product.create([
        {
            name: "Fortune Sunflower Oil",
            description: "1L cooking oil for daily use.",
            price: 140,
            category: "Groceries",
            imageUrl: "https://images.unsplash.com/photo-1586201375761-8386571d8d1f?auto=format&fit=crop&w=800&q=80",
            stock: 50,
            rating: 4.5,
            numReviews: 12,
        },
        {
            name: "Aashirvaad Atta",
            description: "Whole wheat flour for fresh rotis and chapatis.",
            price: 85,
            category: "Groceries",
            imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
            stock: 40,
            rating: 4.2,
            numReviews: 8,
        },
        {
            name: "Dettol Handwash",
            description: "Refreshing handwash for everyday hygiene.",
            price: 65,
            category: "Household",
            imageUrl: "https://images.unsplash.com/photo-1608571424352-9261b9d0e2f8?auto=format&fit=crop&w=800&q=80",
            stock: 30,
            rating: 4.7,
            numReviews: 15,
        },
         {
            name: "Grains",
            description: "everyday usable",
            price: 90,
            category: "Cooking",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Dhaniyangal.jpg/960px-Dhaniyangal.jpg",
            stock: 30,
            rating: 4.7,
            numReviews: 15,
        },
    ]);

    await Order.create({
        user: regularUser._id,
        orderItems: [
            {
                productId: products[0]._id,
                quantity: 2,
                price: products[0].price,
            },
            {
                productId: products[2]._id,
                quantity: 1,
                price: products[2].price,
            },
        ],
        totalPrice: products[0].price * 2 + products[2].price,
        address: {
            fullName: "John Doe",
            street: "12 Main Street",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
        },
        paymentMethod: "Cash on Delivery",
        status: "pending",
    });

    console.log("Database seeded successfully.");
    console.log(`Created admin user: ${adminUser.email}`);
    console.log(`Created regular user: ${regularUser.email}`);
    console.log(`Created ${products.length} products`);
};

seedDatabase()
    .then(() => {
        mongoose.disconnect();
    })
    .catch((error) => {
        console.error("Seed failed:", error);
        mongoose.disconnect();
        process.exit(1);
    });