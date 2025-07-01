import './Button.css'

const Button = ({ 
  children, 
  type = 'button', 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  fullWidth = false
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${fullWidth ? 'full-width' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      {loading && <span className="btn-spinner"></span>}
      {children}
    </button>
  );
};


export default Button;