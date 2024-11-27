import * as Slider from '@radix-ui/react-slider'

interface TimeSliderProps {
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export default function TimeSlider({ value, onChange }: TimeSliderProps) {
  return (
    <div className="mb-4">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        onValueChange={onChange as (value: number[]) => void}
        max={24}
        step={1}
        aria-label="Time range"
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-violet-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-5 h-5 bg-violet-500 rounded-full hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2" />
        <Slider.Thumb className="block w-5 h-5 bg-violet-500 rounded-full hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2" />
      </Slider.Root>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>{value[0]}:00</span>
        <span>{value[1]}:00</span>
      </div>
    </div>
  )
}