"use client";

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import Notes from './Notes';
import AlarmDialog from './AlarmDialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';

export type NoteData = {
  [date: string]: string[];
};

export type AlarmData = {
  [date: string]: {
    time: string;
    note: string;
  }[];
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<NoteData>({});
  const [alarms, setAlarms] = useState<AlarmData>({});

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleGoToDate = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
    }
  };

  const hasNote = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return notes[dateStr]?.length > 0;
  };

  const hasAlarm = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return alarms[dateStr]?.length > 0;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <Card className="p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            className="hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <CalendarPicker
                  mode="single"
                  selected={currentDate}
                  onSelect={handleGoToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="hover:bg-secondary"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="calendar-grid mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-sm font-medium text-muted-foreground p-2 text-center">
              {day}
            </div>
          ))}
        </div>
        
        <div className="calendar-grid">
          {days.map(day => (
            <button
              key={day.toString()}
              onClick={() => handleDateSelect(day)}
              className={`day-cell ${
                isToday(day) ? 'font-bold' : ''
              } ${
                selectedDate && isSameDay(day, selectedDate) ? 'selected' : ''
              } ${hasNote(day) ? 'has-note' : ''} ${
                hasAlarm(day) ? 'has-alarm' : ''
              }`}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </Card>

      {selectedDate && (
        <div className="slide-up">
          <Notes
            date={selectedDate}
            notes={notes}
            setNotes={setNotes}
          />
          <AlarmDialog
            date={selectedDate}
            alarms={alarms}
            setAlarms={setAlarms}
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;
