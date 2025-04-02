import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types/Product';
import { BsCart2 } from "react-icons/bs";

import classes from './ProductListing.module.css';

interface ProductListingProps {
  products: Product[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  addToCart: (product: Product, selectedAttributes: Record<string, string>) => void;
}

export default function ProductListing({ 
  products, 
  activeCategory, 
  setActiveCategory,
  addToCart 
}: ProductListingProps) {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    if (categoryName && categoryName !== activeCategory) {
      setActiveCategory(categoryName);
    }
  }, [categoryName, activeCategory, setActiveCategory]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleQuickShop = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    if (!product.inStock) return;
    
    const defaultAttributes: Record<string, string> = {};
    product.attributes.forEach(attr => {
      if (attr.items.length > 0) {
        defaultAttributes[attr.id] = attr.items[0].id;
      }
    });

    addToCart(product, defaultAttributes);
  };

  const formatPrice = (product: Product) => {
    const price = product.prices[0];
    return price ? `${price.currency.symbol}${price.amount.toFixed(2)}` : '';
  };

  return (
    <div className={classes["product-listing"]}>
      <h1 className={classes["category-title"]}>{activeCategory.toUpperCase()}</h1>
      
      <div className={classes["products-grid"]}>
        {products.map((product) => (
          <div 
            key={product.id}
            className={`${classes["product-card"]} ${!product.inStock ? `${classes["out-of-stock"]}` : ''}`}
            onClick={() => handleProductClick(product.id)}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            data-testid={`product-${product.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className={classes["product-image-container"]}>
              <img 
                src={product.gallery[0]} 
                alt={product.name} 
                className={`${classes["product-image"]} ${!product.inStock ?  `${classes["out-of-stock-image"]}` : ''}`}
              />
              {!product.inStock && (
                <span className={classes["out-of-stock-label"]}>OUT OF STOCK</span>
            )}
            </div>
            {product.inStock && hoveredProduct === product.id && (
              <button 
                className={classes["quick-shop-button"]}
                onClick={(e) => handleQuickShop(e, product)}
                aria-label={`Quick shop for ${product.name}`}
              >
                <BsCart2 className={classes["quick-shop-button-icon"]}/>
              </button>
            )}
            <div className={classes["product-info"]}>
              <p className={classes["product-name"]}>{product.name}</p>
              <p className={classes["product-price"]}>{formatPrice(product)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}