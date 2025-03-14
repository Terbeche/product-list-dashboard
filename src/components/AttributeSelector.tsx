import { AttributeSet } from '../types/Attribute';
import classes from './AttributeSelector.module.css';

interface AttributeSelectorProps {
  attribute: AttributeSet;
  selectedValue: string;
  onChange: (attributeId: string, itemId: string) => void;
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
          style={isColorAttribute ? { backgroundColor: item.value } : {}}
          onClick={() => onChange(attribute.id, item.id)}
          data-testid={`attribute-${attribute.id.toLowerCase()}-${item.id.toLowerCase()}`}
        >
          {!isColorAttribute && item.value}
        </div>
      ))}
    </div>
  );
}