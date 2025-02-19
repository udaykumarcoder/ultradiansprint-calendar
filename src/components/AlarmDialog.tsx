
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlarmClock } from 'lucide-react';
import { AlarmData } from './Calendar';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

interface AlarmDialogProps {
  date: Date;
  alarms: AlarmData;
  setAlarms: (alarms: AlarmData) => void;
}

// Create audio element once
const alarmSound = new Audio('/alarm-sound.mp3');
alarmSound.loop = true;

const AlarmDialog = ({ date, alarms, setAlarms }: AlarmDialogProps) => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const { toast } = useToast();
  const dateStr = format(date, 'yyyy-MM-dd');

  // Load alarms from localStorage on component mount
  useEffect(() => {
    const savedAlarms = localStorage.getItem('calendar-alarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }
  }, []);

  // Save alarms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendar-alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    // Check for alarms every minute
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const currentDate = format(now, 'yyyy-MM-dd');
      
      Object.entries(alarms).forEach(([alarmDate, alarmsList]) => {
        alarmsList.forEach(alarm => {
          if (alarmDate === currentDate && alarm.time === currentTime) {
            // Play alarm sound
            alarmSound.play();
            
            // Show notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Alarm Reminder', {
                body: alarm.note || 'Your alarm is ringing!',
                icon: '/favicon.ico'
              });
            }
            
            // Show toast with a button to stop the alarm
            toast({
              title: "Alarm!",
              description: (
                <div className="flex flex-col gap-2">
                  <p>{alarm.note || "Your alarm is ringing!"}</p>
                  <Button 
                    variant="secondary" 
                    onClick={() => alarmSound.pause()}
                  >
                    Stop Alarm
                  </Button>
                </div>
              ),
            });
          }
        });
      });
    }, 60000); // Check every minute

    return () => {
      clearInterval(interval);
      alarmSound.pause();
    };
  }, [alarms, toast]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSetAlarm = () => {
    if (!time) return;

    const newAlarms = {
      ...alarms,
      [dateStr]: [
        ...(alarms[dateStr] || []),
        { time, note }
      ],
    };
    
    setAlarms(newAlarms);
    setTime('');
    setNote('');
    setOpen(false);
    
    toast({
      title: "Alarm set",
      description: `Alarm set for ${format(date, 'MMMM d')} at ${time}${note ? ': ' + note : ''}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-4"
        >
          <AlarmClock className="mr-2 h-4 w-4" />
          Set Alarm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Alarm for {format(date, 'MMMM d, yyyy')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for this alarm..."
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSetAlarm}>Set Alarm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlarmDialog;
