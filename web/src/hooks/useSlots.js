// hooks/useSlots.js
import { useState, useCallback, useEffect } from 'react';
import useApiCall from '@hooks/useApiCall';
import { getLocalTimeFromUTC } from '@helpers/time'; 

export default (profile, options = { withBooking: false }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFullDay, setShowFullDay] = useState(false);
  
  const { call: getSlots, data: slotsData, loading: slotsLoading } =
    useApiCall('slot.byDay', { autoFetch: false });

  const generateDays = useCallback(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  }, []);

  const generateTimeSlots = useCallback(() => {
    const startHour = showFullDay ? 0 : 8;
    const endHour = showFullDay ? 23 : 20;
    const slotDuration = profile?.slotDuration || 60;
    const slots = [];
  
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        if (hour === endHour && minute + slotDuration > 60) break;
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  }, [showFullDay, profile?.slotDuration]);

  const loadSlots = useCallback((date) => {
    if (!profile?.profileId) return;
    
    const dateString = date.toISOString().split('T')[0];
    getSlots({ 
      date: dateString, 
      profileId: profile.profileId, 
      withBooking: options.withBooking,
    });
  }, [getSlots, profile?.profileId]);

  return {
    selectedDate,
    setSelectedDate,
    showFullDay,
    setShowFullDay,
    days: generateDays(),
    timeSlots: generateTimeSlots(),
    slots: slotsData || [],
    slotsLoading,
    loadSlots
  };
};