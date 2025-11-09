import { cn } from '../utils/cn'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled,
  type = 'button',
  onClick,
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-90 shadow-md hover:shadow-lg dark:shadow-gray-900/50',
    secondary: 'bg-secondary text-white hover:bg-opacity-90 shadow-md hover:shadow-lg dark:shadow-gray-900/50',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary',
    ghost: 'text-primary hover:bg-primary hover:bg-opacity-10 dark:text-secondary dark:hover:bg-secondary dark:hover:bg-opacity-10'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
