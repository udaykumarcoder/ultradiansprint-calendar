
import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AlarmClock } from 'lucide-react';
import { AlarmData } from './Calendar';
import { useToast } from '@/components/ui/use-toast';

interface AlarmDialogProps {
  date: Date;
  alarms: AlarmData;
  setAlarms: (alarms: AlarmData) => void;
}

const AlarmDialog = ({ date, alarms, setAlarms }: AlarmDialogProps) => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('');
  const { toast } = useToast();
  const dateStr = format(date, 'yyyy-MM-dd');

  const handleSetAlarm = () => {
    if (!time) return;

    const newAlarms = {
      ...alarms,
      [dateStr]: [...(alarms[dateStr] || []), time],
    };
    
    setAlarms(newAlarms);
    setTime('');
    setOpen(false);
    
    toast({
      title: "Alarm set",
      description: `Alarm set for ${format(date, 'MMMM d')} at ${time}`,
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
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
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
