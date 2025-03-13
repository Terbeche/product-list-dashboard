import { Product } from '../types/Product';
import classes from './CartOverlay.module.css';

interface CartItem {
  product: Product;
  quantity: number;
  selectedAttributes: Record<string, string>;
}

interface CartOverlayProps {
  onClose: () => void;
  cartItems?: CartItem[];
  updateQuantity?: (productId: string, attributes: Record<string, string>, change: number) => void;
  placeOrder?: () => void;
  currency?: { label: string; symbol: string };
}

export default function CartOverlay({ 
  onClose, 
  cartItems = [], 
  updateQuantity = () => {}, 
  placeOrder = () => {},
  currency = { label: "USD", symbol: "$" }
}: CartOverlayProps) {
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.prices.find(p => p.currency.label === currency.label);
      return total + (price ? price.amount * item.quantity : 0);
    }, 0).toFixed(2);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const itemText = totalItems === 1 ? '1 Item' : `${totalItems} Items`;

  return (
    <div className={classes["cart-overlay"]}>
      <div className={classes["cart-header"]}>
        <span className={classes["cart-title"]}>My Bag: {itemText}</span>
      </div>
      
      <div className={classes["cart-items"]}>
        {cartItems.map((item, index) => {
          const price = item.product.prices.find(p => p.currency.label === currency.label);
          return (
            <div key={`${item.product.id}-${index}`} className={classes["cart-item"]}>
              <div className={classes["item-details"]}>
                <p className={classes["item-name"]}>{item.product.name}</p>
                <p className={classes["item-price"]}>
                  {price ? `${price.currency.symbol}${price.amount.toFixed(2)}` : ''}
                </p>
                
                {item.product.attributes.map(attr => (
                  <div 
                    key={attr.id} 
                    className={classes["attribute-container"]}
                    data-testid={`cart-item-attribute-${attr.id.toLowerCase()}`}
                  >
                    <p className={classes["attribute-name"]}>{attr.name}:</p>
                    <div className={classes["attribute-options"]}>
                      {attr.items.map(option => {
                        const isSelected = item.selectedAttributes[attr.id] === option.id;
                        const testId = isSelected
                          ? `cart-item-attribute-${attr.id.toLowerCase()}-${option.id.toLowerCase()}-selected`
                          : `cart-item-attribute-${attr.id.toLowerCase()}-${option.id.toLowerCase()}`;
                        
                        return attr.type === 'swatch' ? (
                          <div
                            key={option.id}
                            className={`${classes["swatch-option"]} ${isSelected ? `${classes.selected}` : ''}`}
                            style={{ backgroundColor: option.value }}
                            data-testid={testId}
                          />
                        ) : (
                          <div
                            key={option.id}
                            className={`${classes["text-option"]} ${isSelected ? `${classes.selected}` : ''}`}
                            data-testid={testId}
                          >
                            {option.value}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={classes["quantity-controls"]}>
                <button 
                  className={classes["quantity-button"]} 
                  onClick={() => updateQuantity(item.product.id, item.selectedAttributes, 1)}
                  data-testid="cart-item-amount-increase"
                >
                  +
                </button>
                <span 
                  className={classes["quantity"]}
                  data-testid="cart-item-amount"
                >
                  {item.quantity}
                </span>
                <button 
                  className={classes["quantity-button"]} 
                  onClick={() => updateQuantity(item.product.id, item.selectedAttributes, -1)}
                  data-testid="cart-item-amount-decrease"
                >
                  -
                </button>
              </div>
              
              <div className={classes["item-image"]}>
                <img src={item.product.gallery[0]} alt={item.product.name} />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={classes["cart-footer"]}>
        <div className={classes["cart-total"]}>
          <span>Total</span>
          <span data-testid="cart-total">{currency.symbol}{getTotalPrice()}</span>
        </div>
        
        <div className={classes["cart-actions"]}>
          <button 
            className={classes["place-order-button"]} 
            onClick={placeOrder}
            disabled={cartItems.length === 0}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}