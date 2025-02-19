"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { NoteData } from './Calendar';

interface NotesProps {
  date: Date;
  notes: NoteData;
  setNotes: (notes: NoteData) => void;
}

const Notes = ({ date, notes, setNotes }: NotesProps) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const currentNotes = notes[dateStr] || Array(9).fill('');

  const handleNoteChange = (index: number, value: string) => {
    const newNotes = [...currentNotes];
    newNotes[index] = value;
    setNotes({
      ...notes,
      [dateStr]: newNotes,
    });
  };

  return (
    <Card className="p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-4">
        Notes for {format(date, 'MMMM d, yyyy')}
      </h3>
      <div className="note-grid">
        {Array(9).fill(null).map((_, index) => (
          <div key={index} className="note-cell">
            <Textarea
              placeholder={`Note ${index + 1}`}
              value={currentNotes[index]}
              onChange={(e) => handleNoteChange(index, e.target.value)}
              className="w-full h-full resize-none bg-transparent border-none focus:ring-0"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Notes;
