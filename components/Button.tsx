import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'outline' | 'ghost'
  className?: string
  children?: React.ReactNode
}

const Button = ({ asChild, variant, className, children, ...props }: ButtonProps) => {
  const baseClasses = 'rounded-full text-lg inline-flex items-center justify-center gap-4'
  let classes = baseClasses

  if (variant === 'outline') {
    classes +=
      ' px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white/90 border-white/10 shadow-lg hover:from-purple-500/30 hover:to-blue-500/30 hover:scale-105 transition-all duration-300'
  } else if (variant === 'ghost') {
    classes += ' px-3 py-3'
  }

  classes = `${classes} ${className}`

  if (asChild) {
    const child = React.Children.only(children)
    return React.cloneElement(child, { className: classes, ...props })
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
