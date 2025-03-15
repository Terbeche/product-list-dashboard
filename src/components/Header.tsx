import { useNavigate } from 'react-router-dom';
import CartOverlay from './CartOverlay';
import classes from './Header.module.css';
import { BsCart2 } from 'react-icons/bs';
import { CartItem } from '../types/CartItem';
import { Category } from '../types/Category';
import { useCartContext } from '../context/CartContext';
interface HeaderProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  cartItemsCount: number;
  cartItems: CartItem[];
  updateQuantity: (productId: string, attributes: Record<string, string>, change: number) => void;
  placeOrder: () => void;
}

export default function Header({
  categories,
  activeCategory, 
  setActiveCategory, 
  cartItemsCount,
  cartItems,
  updateQuantity,
  placeOrder
}: HeaderProps) {
  
  const { isCartOpen, toggleCart } = useCartContext();
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    navigate(`/category/${category}`);
  };
  return (
    <header className={classes.header}>
      <nav className={classes.navbar}>
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
        </div>
        <button data-testid="cart-btn" className={classes["cart-container"]} onClick={toggleCart}>
            <BsCart2 
              className={classes["cart-button"]}
            />
              {cartItemsCount > 0 && (
                <span className={classes["cart-count"]}>{cartItemsCount}</span>
              )}
        </button>
      </nav>
      <CartOverlay 
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        placeOrder={placeOrder}
        cartState={isCartOpen ? "open" : "close"}
      />
      {isCartOpen && <div className={classes["overlay-backdrop"]} onClick={toggleCart}></div>}
    </header>
  );
}