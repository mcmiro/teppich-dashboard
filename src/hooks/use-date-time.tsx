import { useCallback } from 'react';

const months = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

const optionsDate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const optionsTime: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

export const useDateTime = () => {
  const handleDate = useCallback((dateTimeObject: string) => {
    const dateObject = new Date(dateTimeObject);
    const parsedDate = dateObject.toLocaleDateString('de-DE', optionsDate);
    return parsedDate;
  }, []);

  const handleTime = useCallback((dateTimeObject: string) => {
    const dateObject = new Date(dateTimeObject);
    const parsedTime = dateObject.toLocaleTimeString('de-DE', optionsTime);
    return parsedTime;
  }, []);

  const currentYear = useCallback(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    return year;
  }, []);

  const currentMonth = useCallback((): string => {
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();
    return months[monthIndex];
  }, []);

  const currentDay = useCallback(() => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    return day;
  }, []);

  const todayDate = useCallback(() => {
    return handleDate(new Date().toString());
  }, [handleDate]);

  const germanMonth = useCallback((monthIndex: number) => {
    return months[monthIndex];
  }, []);

  return {
    handleDate,
    handleTime,
    currentYear,
    currentMonth,
    currentDay,
    todayDate,
    germanMonth,
  };
};
