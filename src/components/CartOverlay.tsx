import { Product } from '../types/Product';
import classes from './CartOverlay.module.css';
import AttributeSelector from './AttributeSelector';
import { AttributeSet } from '../types/Attribute';

interface CartItem {
  product: Product;
  quantity: number;
  selectedAttributes: Record<string, string>;
}

interface CartOverlayProps {
  cartItems?: CartItem[];
  updateQuantity?: (productId: string, attributes: Record<string, string>, change: number) => void;
  placeOrder?: () => void;
  currency?: { label: string; symbol: string };
  updateAttributes?: (productId: string, currentAttributes: Record<string, string>, attributeId: string, newValue: string) => void;
  cartState?: string;
}

export default function CartOverlay({ 
  cartItems = [],
  updateQuantity = () => {}, 
  placeOrder = () => {},
  cartState = '',
  currency = { label: "USD", symbol: "$" },
  updateAttributes = () => {}
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
    <div className={`${classes["cart-overlay"]} ${classes[cartState]}`}>
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
                
                {item.product.attributes.map((attribute: AttributeSet) => (
                  <div 
                    key={attribute.id} 
                    className={classes["attribute-container"]}
                    data-testid={`cart-item-attribute-${attribute.id.toLowerCase()}`}
                  >
                    <p className={classes["attribute-name"]}>{attribute.name}:</p>
                    <AttributeSelector
                      attribute={attribute}
                      selectedValue={item.selectedAttributes[attribute.id] || ''}
                      onChange={(attributeId, newValue) => 
                        updateAttributes(item.product.id, item.selectedAttributes, attributeId, newValue)
                      }
                    />
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