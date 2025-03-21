import { AttributeSet } from '../types/Attribute';
import classes from './AttributeSelector.module.css';

interface AttributeSelectorProps {
  attribute: AttributeSet;
  selectedValue: string;
  onChange?: (attributeId: string, itemId: string) => void;
}

export default function AttributeSelector({ 
  attribute, 
  selectedValue, 
  onChange,
}: AttributeSelectorProps) {
  const isColorAttribute = attribute.name.toLowerCase() === 'color';
  
  return (
    <div className={classes["attribute-boxes"]}>
      {attribute.items.map(item => (
        <div 
          key={item.id}
          className={`
            ${classes["attribute-box"]} 
            ${selectedValue === item.id ? classes["selected"] : ''}
            ${isColorAttribute ? classes["color-box"] : ''}
          `}
          data-testid={selectedValue === item.id 
            ? `product-attribute-${attribute.name.toLowerCase()}-${item.id}-selected` 
            : `product-attribute-${attribute.name.toLowerCase()}-${item.id}`
          }
          style={{
            ...(isColorAttribute ? { backgroundColor: item.value } : {}),
            ...(onChange ? { cursor: 'pointer' } : {})
          }}
          onClick={() => onChange && onChange(attribute.id, item.id)}
        >
          {!isColorAttribute && item.value}
        </div>
      ))}
    </div>
  );
}