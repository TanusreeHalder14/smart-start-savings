
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SliderContextType {
  currentValue: number | number[];
  setCurrentValue: (value: number | number[]) => void;
  updateValue: (value: string | number, index?: number) => void;
}

const SliderContext = createContext<SliderContextType | undefined>(undefined);

export const useSlider = () => {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error('useSlider must be used within a SliderProvider');
  }
  return context;
};

interface SliderProviderProps {
  children: ReactNode;
  defaultValue: number | number[];
  onValueChange?: (value: number | number[]) => void;
  min?: number;
  max?: number;
}

export const SliderProvider: React.FC<SliderProviderProps> = ({
  children,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100
}) => {
  const [currentValue, setCurrentValue] = useState<number | number[]>(defaultValue);
  
  // Handle setting value from slider component
  const handleSetCurrentValue = (value: number | number[]) => {
    setCurrentValue(value);
    onValueChange?.(value);
  };
  
  // Update slider value from manual input
  const updateValue = (inputValue: string | number, index?: number) => {
    const numValue = typeof inputValue === 'string' ? parseFloat(inputValue) : inputValue;
    
    if (isNaN(numValue)) return;
    
    // Ensure the value is within min/max range
    const boundedValue = Math.min(Math.max(numValue, min), max);
    
    if (Array.isArray(currentValue) && index !== undefined) {
      // For multi-thumb sliders
      const newValues = [...currentValue];
      newValues[index] = boundedValue;
      setCurrentValue(newValues);
      onValueChange?.(newValues);
    } else {
      // For single-thumb sliders
      setCurrentValue(boundedValue);
      onValueChange?.(boundedValue);
    }
  };
  
  return (
    <SliderContext.Provider value={{ 
      currentValue, 
      setCurrentValue: handleSetCurrentValue, 
      updateValue 
    }}>
      {children}
    </SliderContext.Provider>
  );
};
