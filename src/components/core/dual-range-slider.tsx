'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';
import { Controller } from 'react-hook-form';

import { cn } from '@/lib';

interface DualRangeSliderProps {
  control: any; // React Hook Form control
  name: string;
  labelPosition?: 'top' | 'bottom';
  label?: (value: number | undefined) => React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
}

const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  control,
  name,
  label,
  labelPosition = 'top',
  min = 0,
  max = 100,
  step = 1
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const sliderValue = Array.isArray(value) ? value : [min, max];

        return (
          <SliderPrimitive.Root
            className={cn(
              'relative flex w-full touch-none items-center select-none'
            )}
            value={sliderValue}
            min={min}
            max={max}
            step={step}
            onValueChange={onChange}
          >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-100">
              <SliderPrimitive.Range className="absolute h-full bg-gray-800" />
            </SliderPrimitive.Track>

            {sliderValue.map((val, index) => (
              <SliderPrimitive.Thumb
                key={index}
                className="ring-offset-background focus-visible:ring-ring relative block h-4 w-4 rounded-full border-2 border-b-gray-800 bg-gray-800 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                {label && (
                  <span
                    className={cn(
                      'absolute flex w-full justify-center text-black',
                      labelPosition === 'top' && '-top-7',
                      labelPosition === 'bottom' && 'top-4'
                    )}
                  >
                    {label(val)}
                  </span>
                )}
              </SliderPrimitive.Thumb>
            ))}
          </SliderPrimitive.Root>
        );
      }}
    />
  );
};

export { DualRangeSlider };
