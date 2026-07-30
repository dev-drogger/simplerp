import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { useState } from "react";

const DatePicker = <TData,>({ table }: { table: Table<TData> }) => {
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined);
  const handleDateSelect = (d: Date | undefined) => {
    setDateValue(d);
    table.getColumn("date")?.setFilterValue(d);
  };

  const clearDate = () => {
    setDateValue(undefined);
    table.getColumn("date")?.setFilterValue(undefined);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-50 justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? format(dateValue, "PPP") : <span>Filter by date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>

      {dateValue && (
        <Button variant="ghost" size="icon" onClick={clearDate}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};

export default DatePicker;
