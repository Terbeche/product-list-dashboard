import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { CartProvider } from './context/CartContext';

function App() {
  const { 
    categories, 
    products, 
    activeCategory, 
    setActiveCategory 
  } = useProducts();

  const { 
    cartItems, 
    cartItemsCount, 
    addToCart, 
    updateQuantity, 
    placeOrder 
  } = useCart();

  return (
    <BrowserRouter>
      <CartProvider>
        <Header
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory} 
          cartItemsCount={cartItemsCount}
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          placeOrder={placeOrder}
        />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to={`/${activeCategory}`} />} />
            <Route 
              path="/:categoryName"
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
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;