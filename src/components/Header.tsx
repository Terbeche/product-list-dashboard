import { useNavigate } from 'react-router-dom';

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
    <header className="header">
      <nav className="navigation">
        <div className="categories">
          {categories.map((category) => (
            <span
              key={category.name}
              className={`category ${activeCategory === category.name ? 'active' : ''}`}
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