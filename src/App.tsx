import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import { Product } from './types/Product';

import { productList } from './data';

function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const products = productList.data.products;
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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

  // Handler for placing order
  const placeOrder = () => {
    console.log("Order placed:", cartItems);
    setCartItems([]);
  };

  return (
    <BrowserRouter>
      <Header 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        cartItemsCount={cartItemsCount}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        placeOrder={placeOrder}
      />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to={`/category/${activeCategory}`} />} />
          <Route 
            path="/category/:categoryName" 
            element={
              <ProductListing 
                products={products} 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                addToCart={addToCart}
              />
            } 
          />
          <Route 
            path="/product/:productId" 
            element={
              <ProductDetails 
                products={products}
                addToCart={addToCart}
              />
            } 
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;