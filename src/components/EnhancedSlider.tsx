
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { SliderProvider, useSlider } from '@/contexts/SliderContext';

interface EnhancedSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number | number[];
  onValueChange?: (value: number | number[]) => void;
  formatValue?: (value: number) => string;
  className?: string;
  showInput?: boolean;
  inputPrefix?: string;
}

const SliderWithInput = ({
  min,
  max,
  step,
  formatValue,
  className,
  showInput = true,
  inputPrefix
}: Omit<EnhancedSliderProps, 'value' | 'onValueChange'>) => {
  const { currentValue, setCurrentValue, updateValue } = useSlider();

  // Format the displayed value
  const formatDisplayValue = (value: number) => {
    return formatValue ? formatValue(value) : value.toString();
  };

  // Ensures the value is always treated as an array for the component
  const valueAsArray = Array.isArray(currentValue) ? currentValue : [currentValue];

  return (
    <div className={`space-y-2 ${className}`}>
      <Slider
        min={min}
        max={max}
        step={step}
        value={valueAsArray}
        onValueChange={setCurrentValue}
      />
      
      {showInput && (
        <div className="flex items-center gap-2">
          {Array.isArray(currentValue) ? (
            <>
              <div className="relative flex-1">
                {inputPrefix && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    {inputPrefix}
                  </span>
                )}
                <Input
                  type="number"
                  value={currentValue[0]}
                  onChange={(e) => updateValue(e.target.value, 0)}
                  className={inputPrefix ? "pl-6" : ""}
                  min={min}
                  max={currentValue[1] || max}
                />
              </div>
              <span className="text-gray-400">—</span>
              <div className="relative flex-1">
                {inputPrefix && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    {inputPrefix}
                  </span>
                )}
                <Input
                  type="number"
                  value={currentValue[currentValue.length - 1]}
                  onChange={(e) => updateValue(e.target.value, currentValue.length - 1)}
                  className={inputPrefix ? "pl-6" : ""}
                  min={currentValue[0] || min}
                  max={max}
                />
              </div>
            </>
          ) : (
            <div className="relative w-full">
              {inputPrefix && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  {inputPrefix}
                </span>
              )}
              <Input
                type="number"
                value={currentValue}
                onChange={(e) => updateValue(e.target.value)}
                className={inputPrefix ? "pl-6" : ""}
                min={min}
                max={max}
              />
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatDisplayValue(min)}</span>
        <span>{formatDisplayValue(max)}</span>
      </div>
    </div>
  );
};

export const EnhancedSlider = (props: EnhancedSliderProps) => {
  return (
    <SliderProvider 
      defaultValue={props.value} 
      onValueChange={props.onValueChange}
      min={props.min}
      max={props.max}
    >
      <SliderWithInput {...props} />
    </SliderProvider>
  );
};

export default EnhancedSlider;
