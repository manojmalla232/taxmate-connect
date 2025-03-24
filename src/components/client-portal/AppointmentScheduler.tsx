import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Video, Phone, User, X, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isBefore, startOfToday } from 'date-fns';

type AppointmentType = 'video' | 'phone';

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

type Appointment = {
  id: string;
  date: Date;
  time: string;
  type: AppointmentType;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
};

const AppointmentScheduler: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('video');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  
  // Sample existing appointments
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: addDays(new Date(), 3),
      time: '14:00',
      type: 'video',
      notes: 'Discuss tax deductions for investment properties',
      status: 'scheduled'
    }
  ]);
  
  // Generate time slots (9 AM to 5 PM, 30 min intervals)
  const generateTimeSlots = (selectedDate: Date | undefined): TimeSlot[] => {
    if (!selectedDate) return [];
    
    const slots: TimeSlot[] = [];
    const existingAppointmentsOnDate = appointments.filter(
      app => app.date.toDateString() === selectedDate.toDateString() && app.status !== 'cancelled'
    );
    
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isAvailable = !existingAppointmentsOnDate.some(app => app.time === timeString);
        
        slots.push({
          id: `${hour}-${minute}`,
          time: timeString,
          available: isAvailable
        });
      }
    }
    
    return slots;
  };
  
  const timeSlots = generateTimeSlots(date);
  
  const handleScheduleAppointment = () => {
    if (!date || !selectedTimeSlot) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        date: date,
        time: selectedTimeSlot,
        type: appointmentType,
        notes: notes.trim() || undefined,
        status: 'scheduled'
      };
      
      setAppointments([...appointments, newAppointment]);
      setShowConfirmation(true);
      setIsSubmitting(false);
      
      // Reset form
      setDate(undefined);
      setSelectedTimeSlot(null);
      setNotes('');
      
      toast({
        title: "Appointment scheduled",
        description: `Your appointment has been scheduled for ${format(date, 'MMMM d, yyyy')} at ${selectedTimeSlot}`
      });
    }, 1500);
  };
  
  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'cancelled' } : app
    ));
    
    toast({
      title: "Appointment cancelled",
      description: "Your appointment has been cancelled successfully"
    });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-card">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Schedule an Appointment</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Book a consultation with your tax agent</p>
      </div>
      
      <div className="p-6">
        {!showConfirmation ? (
          <div className="space-y-6">
            {/* Date selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => isBefore(date, startOfToday())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Time slot selection */}
            {date && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1 sm:gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                      className={`${!slot.available ? 'opacity-50 cursor-not-allowed' : ''} ${selectedTimeSlot === slot.time ? 'bg-blue-accent hover:bg-blue-accent/90' : ''}`}
                      onClick={() => slot.available && setSelectedTimeSlot(slot.time)}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Appointment type */}
            {date && selectedTimeSlot && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                <Select
                  value={appointmentType}
                  onValueChange={(value) => setAppointmentType(value as AppointmentType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center">
                        <Video size={16} className="mr-2" />
                        <span>Video Call</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center">
                        <Phone size={16} className="mr-2" />
                        <span>Phone Call</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
            
            {/* Notes */}
            {date && selectedTimeSlot && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <Textarea
                  placeholder="Add any details about what you'd like to discuss"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </motion.div>
            )}
            
            {/* Submit button */}
            {date && selectedTimeSlot && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-2"
              >
                <Button
                  className="w-full bg-blue-accent hover:bg-blue-accent/90"
                  onClick={handleScheduleAppointment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment Scheduled!</h3>
            <p className="text-gray-600 mb-6">Your tax agent will be notified of your appointment request.</p>
            <Button
              onClick={() => setShowConfirmation(false)}
              className="bg-blue-accent hover:bg-blue-accent/90"
            >
              Schedule Another
            </Button>
          </motion.div>
        )}
      </div>
      
      {/* Upcoming appointments */}
      <div className="border-t border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Upcoming Appointments</h3>
        
        {appointments.filter(app => app.status === 'scheduled').length > 0 ? (
          <div className="space-y-4">
            {appointments
              .filter(app => app.status === 'scheduled')
              .map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-light text-blue-accent flex items-center justify-center flex-shrink-0">
                      {appointment.type === 'video' ? <Video size={18} /> : <Phone size={18} />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {format(appointment.date, 'MMMM d, yyyy')} at {appointment.time}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {appointment.type === 'video' ? 'Video Call' : 'Phone Call'}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-2 italic">
                          "{appointment.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancel
                  </Button>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
            <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No upcoming appointments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduler;