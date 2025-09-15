
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ text, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLHeadingElement>(null);

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
        threshold: 0.1,
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
  }, [text]); // Re-run effect if text changes

  const words = text.split(' ');

  return (
    <h2
      ref={elementRef}
      className={cn('word-animation-container', isVisible && 'is-visible', className)}
      // Add a key to force re-render on text change, which resets the animation
      key={text}
    >
      {words.map((word, index) => (
        <span key={index} className="word-wrapper">
          <span className="word" style={{ transitionDelay: `${index * 100}ms` }}>
            {word}
          </span>
        </span>
      ))}
    </h2>
  );
};

export default AnimatedHeading;
