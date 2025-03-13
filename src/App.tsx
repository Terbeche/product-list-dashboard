import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import { Product } from './types/Product';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Category } from './types/Category';
import { CartItem } from './types/CartItem';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

const GET_PRODUCTS = gql`
  query GetProducts($category: String) {
    products(category: $category) {
      id
      name
      inStock
      gallery
      description
      brand
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($items: [String!]!) {
    createOrder(items: $items) {
      id
      total
    }
  }
`;


function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const { loading: catLoading, error: catError, data: catData } = useQuery(GET_CATEGORIES);
  const { loading: prodLoading, error: prodError, data: prodData } = useQuery(GET_PRODUCTS, {
    variables: { category: activeCategory }
  });
  
  const [createOrder, { loading, error }] = useMutation(CREATE_ORDER);

  const categories: Category[] = catData?.categories || [];
  const products: Product[] = prodData?.products || [];
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

  const placeOrder = () => {
    const orderItems = cartItems.map(item => JSON.stringify({
      product_id: item.product.id,
      quantity: item.quantity,
      selected_attributes: item.selectedAttributes
    }));
    console.log('Order items:', orderItems);
    createOrder({
      variables: {
        items: orderItems
      }
    }).then (() => {
      console.log("Order placed:", cartItems);
      setCartItems([]);
    }).catch(err => {
      console.error('Error creating order:', err);
    });
  };


  // Update the loading and error logic => TODO
  if (catLoading || prodLoading) return <p>Loading...</p>;
  if (catError || prodError) return <p>Error :</p>;
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