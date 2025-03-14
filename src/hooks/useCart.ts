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

  const updateCartItemAttributes = (
    productId: string, 
    currentAttributes: Record<string, string>, 
    attributeId: string, 
    newValue: string
  ) => {
    const updatedCartItems = cartItems.map(item => {
      // Find the specific item by product ID and current attributes
      if (
        item.product.id === productId && 
        JSON.stringify(item.selectedAttributes) === JSON.stringify(currentAttributes)
      ) {
        // Create new attributes with the updated value
        const updatedAttributes = {
          ...item.selectedAttributes,
          [attributeId]: newValue
        };
        
        // Check if an item with these new attributes already exists
        const existingItemWithNewAttributes = cartItems.find(existingItem => 
          existingItem.product.id === productId && 
          JSON.stringify(existingItem.selectedAttributes) === JSON.stringify(updatedAttributes)
        );
        
        if (existingItemWithNewAttributes) {
          // If exists, don't modify this item
          return item;
        } else {
          // If doesn't exist with new attributes, update this item
          return {
            ...item,
            selectedAttributes: updatedAttributes
          };
        }
      }
      return item;
    });
    
    // Look for duplicate items (same product with same attributes) and merge them
    const mergedItems: CartItem[] = [];
    const processedIndices = new Set<number>();
    
    updatedCartItems.forEach((item, index) => {
      if (processedIndices.has(index)) return;
      
      const duplicates = updatedCartItems.filter((otherItem, otherIndex) => 
        index !== otherIndex &&
        item.product.id === otherItem.product.id &&
        JSON.stringify(item.selectedAttributes) === JSON.stringify(otherItem.selectedAttributes)
      );
      
      if (duplicates.length > 0) {
        // Merge quantities of duplicates
        const totalQuantity = duplicates.reduce(
          (sum, dup) => sum + dup.quantity, 
          item.quantity
        );
        
        mergedItems.push({
          ...item,
          quantity: totalQuantity
        });
        
        // Mark all duplicates as processed
        duplicates.forEach(dup => {
          const dupIndex = updatedCartItems.findIndex(cartItem => cartItem === dup);
          if (dupIndex !== -1) {
            processedIndices.add(dupIndex);
          }
        });
      } else if (!processedIndices.has(index)) {
        // No duplicates, add as is
        mergedItems.push(item);
      }
      
      processedIndices.add(index);
    });
    
    setCartItems(mergedItems);
  };

  const placeOrder = () => {
    const orderItems = cartItems.map(item => JSON.stringify({
      product_id: item.product.id,
      quantity: item.quantity,
      selected_attributes: item.selectedAttributes
    }));
    
    return createOrder({
      variables: {
        items: orderItems
      }
    }).then(() => {
      console.log("Order placed:", cartItems);
      setCartItems([]);
    }).catch(err => {
      console.error('Error creating order:', err);
      throw err;
    });
  };

  return {
    cartItems,
    cartItemsCount,
    addToCart,
    updateQuantity,
    updateCartItemAttributes,
    placeOrder,
    orderLoading,
    orderError
  };
};
