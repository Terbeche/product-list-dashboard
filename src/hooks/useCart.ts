import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CartItem } from '../types/CartItem';
import { Product } from '../types/Product';
import { CREATE_ORDER } from '../graphql/queries';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Retrieve cartItems from localStorage if available
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const [createOrder, { loading: orderLoading, error: orderError }] = useMutation(CREATE_ORDER);

  // Calculate cart items count
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, selectedAttributes: Record<string, string>) => {
    // Check if the product with the same attributes already exists in the cart
    const existingItemIndex = cartItems.findIndex(item => 
      item.product.id === product.id && 
      JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
    );

    if (existingItemIndex !== -1) {
      // If exists, increase the quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // If doesn't exist, add new item
      setCartItems([...cartItems, {
        product,
        selectedAttributes,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (productId: string, attributes: Record<string, string>, change: number) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.product.id === productId && 
          JSON.stringify(item.selectedAttributes) === JSON.stringify(attributes)) {
        return {
          ...item,
          quantity: Math.max(0, item.quantity + change)
        };
      }
      return item;
    }).filter(item => item.quantity > 0); // Remove items with 0 quantity
    
    setCartItems(updatedCartItems);
  };

  const placeOrder = async () => {
    if (isSubmittingOrder) return;
    
    try {
      setIsSubmittingOrder(true);
      
      const orderItems = cartItems.map(item => JSON.stringify({
        product_id: item.product.id,
        quantity: item.quantity,
        selected_attributes: item.selectedAttributes
      }));
      
      await createOrder({
        variables: {
          items: orderItems
        }
      });
      
      console.log("Order placed:", cartItems);
      setCartItems([]);
      
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return {
    cartItems,
    cartItemsCount,
    addToCart,
    updateQuantity,
    placeOrder,
    orderLoading,
    orderError,
    isSubmittingOrder
  };
};
