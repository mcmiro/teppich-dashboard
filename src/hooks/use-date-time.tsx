export const useDateTime = () => {
  const optionsDate = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit',
  };

  const handleDate = (dateTimeObject: string) => {
    const dateObject = new Date(dateTimeObject);
    const parsedDate = dateObject.toLocaleDateString(
      'de-DE',
      optionsDate as Intl.DateTimeFormatOptions
    );

    return parsedDate;
  };

  const handleTime = (dateTimeObject: string) => {
    const dateObject = new Date(dateTimeObject);

    const parsedTime = dateObject.toLocaleTimeString(
      'de-DE',
      optionsTime as Intl.DateTimeFormatOptions
    );

    return parsedTime;
  };

  const currentYear = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    return year;
  };

  const currentMonth = (): string => {
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

    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();

    return months[monthIndex];
  };

  const currentDay = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    return day;
  };

  const todayDate = () => {
    return handleDate(new Date().toString());
  };

  const germanMonth = (monthIndex: number) => {
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

    return months[monthIndex];
  };

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
