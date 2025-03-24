
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'light';
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 'md', 
  variant = 'primary',
  className = ''
}) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const variants = {
    primary: 'text-blue-accent',
    light: 'text-white'
  };

  const pathVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: { 
      opacity: 1, 
      pathLength: 1,
      transition: { 
        duration: 1.2, 
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <motion.svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 42 42" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={variants[variant]}
        initial="hidden"
        animate="visible"
      >
        <motion.path 
          variants={pathVariants}
          d="M21 3C11.0589 3 3 11.0589 3 21C3 30.9411 11.0589 39 21 39C30.9411 39 39 30.9411 39 21C39 11.0589 30.9411 3 21 3Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
        <motion.path 
          variants={pathVariants}
          d="M21 11V21L27 27" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <motion.path 
          variants={pathVariants}
          d="M32 14L35 17" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
        />
        <motion.path 
          variants={pathVariants}
          d="M10 14L7 17" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
        />
      </motion.svg>
    </div>
  );
};

export default AnimatedLogo;
