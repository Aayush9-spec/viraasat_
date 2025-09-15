'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const LiquidCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  
  const moveCursor = (e: MouseEvent) => {
    if (!hasMoved) setHasMoved(true);

    const { clientX, clientY } = e;
    if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        followerRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
    }
  };
  
  useEffect(() => {
    document.body.style.cursor = 'none';
    const allInteractiveElements = document.querySelectorAll('a, button, input, [role="button"], [data-cursor-pointer]');
    allInteractiveElements.forEach(el => {
        (el as HTMLElement).style.cursor = 'none';
    });


    window.addEventListener('mousemove', moveCursor);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input[type="checkbox"], input[type="radio"], [role="button"], [data-cursor-pointer]')) {
        setIsPointer(true);
      }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
       if (target.closest('a, button, input[type="checkbox"], input[type="radio"], [role="button"], [data-cursor-pointer]')) {
        setIsPointer(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
        document.body.style.cursor = '';
         allInteractiveElements.forEach(el => {
            (el as HTMLElement).style.cursor = '';
        });
        window.removeEventListener('mousemove', moveCursor);
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div 
        ref={followerRef}
        className={cn(
            'fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/30 pointer-events-none z-[9999] transition-[width,height] duration-300 ease-in-out',
            'hidden md:block', // Hide on mobile devices
            !hasMoved && 'opacity-0',
            isPointer ? 'w-12 h-12' : 'w-8 h-8'
        )}
      />
      <div 
        ref={cursorRef}
        style={{ transition: 'transform 0.1s ease-out' }}
        className={cn(
            'fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999]',
            'hidden md:block', // Hide on mobile devices
             !hasMoved && 'opacity-0',
            isPointer ? 'scale-[3] bg-primary/50' : 'scale-100'
        )}
      />
    </>
  );
};

export default LiquidCursor;
