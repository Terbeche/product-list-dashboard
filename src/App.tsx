import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';

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
    updateCartItemAttributes, 
    placeOrder 
  } = useCart();

  return (
    <BrowserRouter>
      <Header
        categories={categories}
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        cartItemsCount={cartItemsCount}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        placeOrder={placeOrder}
        updateAttributes={updateCartItemAttributes}
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