// 📚 LESSON: Reusable Button Component
// Instead of writing button styles everywhere, we create one button
// that we can reuse with different props (properties)

const Button = ({ 
  children,      // The text inside the button
  onClick,       // What happens when clicked
  type = 'button',  // HTML button type (button, submit)
  variant = 'primary',  // Color style (primary, danger, success)
  disabled = false,     // Is button disabled?
  className = '',       // Extra CSS classes
  fullWidth = false,    // Should button take full width?
}) => {
  // Define color styles for different variants
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  };

  // Build the final className
  const buttonClasses = `
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    px-4 py-2 rounded-lg font-medium transition duration-200
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};

export default Button;
