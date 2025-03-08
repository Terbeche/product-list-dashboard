import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  CartOverlay from './CartOverlay';
import  classes from './Header.module.css';
import { BsCart2 } from 'react-icons/bs';

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  cartItemsCount: number;
  cartItems: any[];
  updateQuantity: (productId: string, attributes: Record<string, string>, change: number) => void;
  placeOrder: () => void;
}

export default function Header({ 
  activeCategory, 
  setActiveCategory, 
  cartItemsCount,
  cartItems,
  updateQuantity,
  placeOrder
}: HeaderProps) {
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  
  const categories = [
    { name: "all" },
    { name: "tech" },
    { name: "clothes" }
  ];

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    navigate(`/category/${category}`);
  };
  return (
    <header className={classes.header}>
      <nav>
        <div className={classes.categories}>
          {categories.map((category) => (
            <span
              key={category.name}
              className={`${classes.category} ${activeCategory === category.name ? `${classes.active}` : ''}`}
              onClick={() => handleCategoryClick(category.name)}
              data-testid={
                activeCategory === category.name
                  ? 'active-category-link'
                  : 'category-link'
              }
            >
              {category.name.toUpperCase()}
            </span>
          ))}
          <div className={classes["cart-container"]}>
            <BsCart2 
              className={classes["cart-button"]}
              onClick={toggleCart}
              data-testid="cart-btn"
            />
              {cartItemsCount > 0 && (
                <span className={classes["cart-count"]}>{cartItemsCount}</span>
              )}
          </div>
        </div>
      </nav>
      {isCartOpen && (
        <>
          <div onClick={toggleCart}></div>
          <CartOverlay 
            onClose={toggleCart} 
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            placeOrder={placeOrder}
          />
        </>
      )}
    </header>
  );
}