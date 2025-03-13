import { useState, useEffect } from 'react';
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
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Retrieve cartItems from localStorage if available
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const { loading: catLoading, error: catError, data: catData } = useQuery(GET_CATEGORIES);
  const { loading: prodLoading, error: prodError, data: prodData } = useQuery(GET_PRODUCTS, {
    variables: { category: activeCategory }
  });
  
  const [createOrder, { loading, error }] = useMutation(CREATE_ORDER);

  const categories: Category[] = catData?.categories || [];
  const products: Product[] = prodData?.products || [];
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