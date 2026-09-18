import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/product.css";

// Controls which categories show first and their display titles.
// Any category not listed here still shows, grouped under its own name, at the end.
const CATEGORY_ORDER = [
  { key: "Namkeen", title: "Namkeen" },
  { key: "Wafers", title: "Wafers & Chips" },
  { key: "Household", title: "Cleaning & Household Essentials" },
  { key: "Groceries", title: "Groceries" },
  { key: "Cooking", title: "Cooking Essentials" },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load products");
        }

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const selectedCategory = searchParams.get("category");
  const visibleProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  // Group visible products by category
  const grouped = visibleProducts.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  // Known categories first (in CATEGORY_ORDER), then any leftover categories
  const knownKeys = CATEGORY_ORDER.map((c) => c.key);
  const extraCategories = Object.keys(grouped).filter(
    (key) => !knownKeys.includes(key)
  );

  const sections = [
    ...CATEGORY_ORDER.filter((c) => grouped[c.key]?.length),
    ...extraCategories.map((key) => ({ key, title: key })),
  ];

  return (
    <div className="product-detail-page">
      <h1>{selectedCategory === "Household" ? "Cleaning Essentials" : "Shop"}</h1>
      <p>
        {selectedCategory === "Household"
          ? "Keep your home fresh and spotless with our cleaning essentials."
          : "Explore the latest essentials from Abhishek Kirana Store."}
      </p>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="product-error">{error}</p>
      ) : sections.length === 0 ? (
        <p>
          {selectedCategory
            ? "No products available in this category right now."
            : "No products available right now."}
        </p>
      ) : (
        sections.map((section) => (
          <div className="products-container" key={section.key}>
            <h2>{section.title}</h2>
            <div className="products-list">
              {grouped[section.key].map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Shop;