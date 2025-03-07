import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types/Product';
import classes from './ProductListing.module.css';

interface ProductListingProps {
  products: Product[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function ProductListing({ 
  products, 
  activeCategory, 
  setActiveCategory 
}: ProductListingProps) {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryName && categoryName !== activeCategory) {
      setActiveCategory(categoryName);
    }
  }, [categoryName, activeCategory, setActiveCategory]);

  const categoryProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const formatPrice = (product: Product) => {
    const price = product.prices[0];
    return price ? `${price.currency.symbol}${price.amount.toFixed(2)}` : '';
  };

  return (
    <div className={classes["product-listing"]}>
      <h1 className={classes["category-title"]}>{activeCategory.toUpperCase()}</h1>
      
      <div className={classes["products-grid"]}>
        {categoryProducts.map((product) => (
          <div 
            key={product.id}
            className={`${classes["product-card"]} ${!product.inStock ? `${classes["out-of-stock"]}` : ''}`}
            onClick={() => handleProductClick(product.id)}
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