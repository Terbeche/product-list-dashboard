import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types/Product';
import classes from './ProductDetails.module.css';
import parse from 'html-react-parser';
interface ProductDetailsProps {
  products: Product[];
  addToCart: (product: Product, selectedAttributes: Record<string, string>) => void;
}

export default function ProductDetails({ products, addToCart }: ProductDetailsProps) {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      
      const defaultAttributes: Record<string, string> = {};
      foundProduct.attributes.forEach(attr => {
        if (attr.items.length > 0) {
          defaultAttributes[attr.id] = attr.items[0].id;
        }
      });
      setSelectedAttributes(defaultAttributes);
    }
  }, [productId, products]);

  const handleAttributeChange = (attributeId: string, itemId: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeId]: itemId
    }));
  };

  const handleAddToCart = () => {
    if (product && isAllAttributesSelected()) {
      addToCart(product, selectedAttributes);
    }
  };

  const isAllAttributesSelected = () => {
    if (!product) return false;
    return product.attributes.every(attr => selectedAttributes[attr.id]);
  };

  const formatPrice = () => {
    if (!product) return '';
    const price = product.prices[0];
    return price ? `${price.currency.symbol}${price.amount.toFixed(2)}` : '';
  };

  const handlePrevImage = () => {
    if (!product) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? product.gallery.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product) return;
    setCurrentImageIndex(prev => 
      prev === product.gallery.length - 1 ? 0 : prev + 1
    );
  };

  if (!product) {
    return <div className={classes["product-not-found"]}>Product not found</div>;
  }

  return (
    <div className={classes["product-details"]}>
      <div className={classes["product-gallery"]} data-testid="product-gallery">
        <div className={classes["gallery-thumbnails"]}>
          {product.gallery.map((image, index) => (
            <img 
              key={index}
              src={image}
              alt={`${product.name} - view ${index + 1}`}
              className={`${classes.thumbnail} ${index === currentImageIndex ? `${classes.active}` : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
        <div className={classes["main-image-container"]}>
          <button className={classes["gallery-nav prev"]} onClick={handlePrevImage}>&#10094;</button>
          <img 
            src={product.gallery[currentImageIndex]} 
            alt={product.name} 
            className={classes["main-image"]}
          />
          <button className={classes["gallery-nav next"]} onClick={handleNextImage}>&#10095;</button>
        </div>
      </div>
      
      <div className={classes["product-info"]}>
        <h1 className={classes["product-brand"]}>{product.brand}</h1>
        <h2 className={classes["product-name"]}>{product.name}</h2>
        
        {product.attributes.map(attribute => (
          <div 
            key={attribute.id} 
            className={classes["attribute-container"]}
          >
            <label>{attribute.name}</label>
            <select 
              value={selectedAttributes[attribute.id]}
              onChange={e => handleAttributeChange(attribute.id, e.target.value)}
            >
              {attribute.items.map(item => (
                <option key={item.id} value={item.id}>{item.displayValue}</option>
              ))}
            </select>
          </div>
        ))}
        <div><b>PRICE:</b></div>
        <div className={classes["product-price"]}>{formatPrice()}</div>
        <button 
          className={classes["add-to-cart"]} 
          onClick={handleAddToCart}
          disabled={!isAllAttributesSelected()}
        >
          ADD TO CART
        </button>
        <div className={classes["product-description"]}>{parse(product.description)}</div>
      </div>
    </div>
  );
}
