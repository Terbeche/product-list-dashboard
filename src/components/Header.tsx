import { useNavigate } from 'react-router-dom';
import  classes from './Header.module.css';

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function Header({ 
  activeCategory, 
  setActiveCategory, 
}: HeaderProps) {
  
  const navigate = useNavigate();
  
  const categories = [
    { name: "all" },
    { name: "tech" },
    { name: "clothes" }
  ];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    navigate(`/category/${category}`);
  };
  return (
    <header className={classes.header}>
      <nav>
        <div className={classes.categories}>
          {categories.map((category) => (
            <span
              key={category.name}
              className={`${classes.category} ${activeCategory === category.name ? `${classes.active}` : ''}`}
              onClick={() => handleCategoryClick(category.name)}
              data-testid={
                activeCategory === category.name
                  ? 'active-category-link'
                  : 'category-link'
              }
            >
              {category.name.toUpperCase()}
            </span>
          ))}
        </div>
      </nav>
    </header>
  );
}