import { AttributeSet } from './Attribute';
  
type Currency = {
  label: string;
  symbol: string;
};

type Price = {
  amount: number;
  currency: Currency;
};
  
export type Product = {
    id: string;
    name: string;
    inStock: boolean;
    gallery: string[];
    description: string;
    category: string;
    attributes: AttributeSet[];
    prices: Price[];
    brand: string;
  };
  
export type Products = Product[];