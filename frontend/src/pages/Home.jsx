import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
// import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data.slice(0, 4)); //Featured products
            } catch (error){
                console.error(error)
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);
      
    return (
        <div className="home-container">
           <div className="hero-banner">
            <h1>Welcome to Abhishek Kirana Store</h1>
            <p>Descover the best products</p>
           </div>
        
           <h2>Featured Products</h2>
          {loading ? (
            <div>Loading...</div>
           ) : (
             <div className="product-grid">
                  {products.map((product) => (
                    <ProductCard  key={product._id} product={product}/>
                  ))}
             </div>
           )}
        </div>
    )
};

export default Home;