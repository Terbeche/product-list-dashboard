import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export const GET_PRODUCTS = gql`
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

export const CREATE_ORDER = gql`
  mutation CreateOrder($items: [String!]!) {
    createOrder(items: $items) {
      id
      total
    }
  }
`;
