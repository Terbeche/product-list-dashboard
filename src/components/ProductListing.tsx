import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types/Product';

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

  useEffect(() => {
    if (categoryName && categoryName !== activeCategory) {
      setActiveCategory(categoryName);
    }
  }, [categoryName, activeCategory, setActiveCategory]);

  const categoryProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const formatPrice = (product: Product) => {
    const price = product.prices[0];
    return price ? `${price.currency.symbol}${price.amount.toFixed(2)}` : '';
  };

  return (
    <div className="product-listing">
      <h1 className="category-title">{activeCategory.toUpperCase()}</h1>
      
      <div className="products-grid">
        {categoryProducts.map((product) => (
          <div 
            key={product.id}
            className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}
            data-testid={`product-${product.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="product-image-container">
              <img 
                src={product.gallery[0]} 
                alt={product.name} 
                className={`product-image ${!product.inStock ? 'out-of-stock-image' : ''}`}
              />
              {!product.inStock && (
                <span className="out-of-stock-label">OUT OF STOCK</span>
              )}
            </div>
            
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <p className="product-price">{formatPrice(product)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}