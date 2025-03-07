import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';

import { productList } from './data';

function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const products = productList.data.products;


  return (
    <BrowserRouter>
      <Header 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
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
              />
            } 
          />
          <Route 
            path="/product/:productId" 
            element={
              <ProductDetails 
                products={products}
              />
            } 
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;