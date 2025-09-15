
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: boolean;
}

const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({ children, className, staggerChildren = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  const containerClasses = cn(
    !staggerChildren && 'transition-all duration-[600ms] ease-out',
    !staggerChildren && (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[25px]'),
    staggerChildren && (isVisible ? 'is-visible' : ''),
    className
  );
  
  const childClasses = cn(
    'transition-all duration-[600ms] ease-out',
    'opacity-0 translate-y-[25px]',
    'group-[.is-visible]:opacity-100 group-[.is-visible]:translate-y-0'
  );

  return (
    <div ref={elementRef} className={containerClasses}>
      {staggerChildren
        ? React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                // @ts-ignore
                className: cn(child.props.className, childClasses),
              });
            }
            return child;
          })
        : children}
    </div>
  );
};

export default FadeInOnScroll;
