// 📚 LESSON: Card Component
// A card is a box with shadow that contains content
// We'll use this to display statistics, forms, and lists

const Card = ({ 
  children,           // Content inside the card
  title,              // Optional title at the top
  className = '',     // Extra CSS classes
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
