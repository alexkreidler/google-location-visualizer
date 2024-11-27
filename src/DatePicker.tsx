import { Calendar } from "@/components/ui/calendar"

interface DatePickerProps {
  selectedDate: Date | undefined
  onDateChange: (date: Date | undefined) => void
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  return (
    <div className="mb-4 w-fit">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateChange}
        className="rounded-md border"
      />
    </div>
  )
}