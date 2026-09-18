import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import HeroSlider from "../components/HeroSlider";
import "../styles/home.css";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data); // keep ALL products, don't slice here
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // Derive each section's list from the full products array
    const readyToCook = products.slice(0, 6);
    const namkeenAndWafers = products.filter(
        (p) => p.category === "Namkeen" || p.category === "Wafers"
    );
    const cleaningEssentials = products.filter(
        (p) => p.category === "Household"
    );
    const featured = products.slice(0, 6);

    return (
        <div className="home-container">

            <HeroSlider />

            <div className="hero-banner">
                <h1>Welcome to Abhishek Kirana Store</h1>
                <p>Descover the best products</p>
            </div>

            <div className="content-section">
                <h2>Ready To Cook</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <ProductCarousel products={readyToCook} />
                )}
            </div>

            <div className="content-section">
                <h2>Namkeen & Wafers</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : namkeenAndWafers.length > 0 ? (
                    <ProductCarousel products={namkeenAndWafers} />
                ) : (
                    <div>No namkeen or wafers products yet.</div>
                )}
            </div>

            {/* Cleaning / Household essentials promo banner */}
            <div className="cleaning-banner">
                <div className="cleaning-banner-text">
                    <h2>Home Cleaning Essentials</h2>
                    <p>
                        Dishwash liquids, Harpic toilet cleaners, handwash & more —
                        everything to keep your home spotless.
                    </p>
                    <Link to="/shop?category=Household" className="btn cleaning-banner-btn">
                        Shop Cleaning Essentials
                    </Link>
                </div>
                <div className="cleaning-banner-icons">
                    <span role="img" aria-label="cleaning">🧴</span>
                    <span role="img" aria-label="cleaning">🧼</span>
                    <span role="img" aria-label="cleaning">🧽</span>
                </div>
            </div>

            <div className="content-section">
                <h2>Household & Cleaning Products</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : cleaningEssentials.length > 0 ? (
                    <ProductCarousel products={cleaningEssentials} />
                ) : (
                    <div>No cleaning products yet.</div>
                )}
            </div>

            <div className="content-section">
                <h2>Featured Products</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <ProductCarousel products={featured} />
                )}
            </div>
        </div>
    )
};

export default Home;