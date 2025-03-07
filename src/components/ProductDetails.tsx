import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types/Product';

interface ProductDetailsProps {
  products: Product[];
}

export default function ProductDetails({ products }: ProductDetailsProps) {
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
    return <div className="product-not-found">Product not found</div>;
  }

  return (
    <div className="product-details">
      <div className="product-gallery" data-testid="product-gallery">
        <div className="gallery-thumbnails">
          {product.gallery.map((image, index) => (
            <img 
              key={index}
              src={image}
              alt={`${product.name} - view ${index + 1}`}
              className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
        <div className="main-image-container">
          <button className="gallery-nav prev" onClick={handlePrevImage}>&#10094;</button>
          <img 
            src={product.gallery[currentImageIndex]} 
            alt={product.name} 
            className="main-image"
          />
          <button className="gallery-nav next" onClick={handleNextImage}>&#10095;</button>
        </div>
      </div>
      
      <div className="product-info">
        <h1 className="product-brand">{product.brand}</h1>
        <h2 className="product-name">{product.name}</h2>
        
        {product.attributes.map(attribute => (
          <div 
            key={attribute.id} 
            className="attribute-container"
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

        <div className="product-price">{formatPrice()}</div>
        <div className="product-description">{product.description}</div>
      </div>
    </div>
  );
}
