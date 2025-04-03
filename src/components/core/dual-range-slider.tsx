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
              'relative flex w-[98%] touch-none items-center select-none'
            )}
            value={sliderValue}
            min={min}
            max={max}
            step={step}
            onValueChange={onChange}
          >
            <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-[#9999990D]">
              <SliderPrimitive.Range className="bg-red absolute h-full" />
            </SliderPrimitive.Track>

            {sliderValue.map((val, index) => (
              <SliderPrimitive.Thumb
                key={index}
                className="ring-offset-red focus-visible:ring-ring border-red relative block h-3 w-3 rounded-full border-2 bg-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                {label && (
                  <span
                    className={cn(
                      'text-red absolute flex w-full justify-center text-xs',
                      labelPosition === 'top' && '-top-5',
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
