import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES, GET_PRODUCTS } from '../graphql/queries';
import { Category } from '../types/Category';
import { Product } from '../types/Product';

export const useProducts = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const { 
    data: catData 
  } = useQuery(GET_CATEGORIES);
  
  const {
    data: prodData 
  } = useQuery(GET_PRODUCTS, {
    variables: { category: activeCategory }
  });

  const categories: Category[] = catData?.categories || [];
  const products: Product[] = prodData?.products || [];

  return {
    categories,
    products,
    activeCategory,
    setActiveCategory
  };
};
