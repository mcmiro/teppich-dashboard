import axios from 'axios';
import { useEffect } from 'react';
import { BACKEND_URL } from '../mocks/backend';
import { OrderDataModel } from '../models/order';
import { statusTitles } from '../status';
import useOrdersStore from '../store/orders-store';

interface StatusStatistic {
  title: string;
  sum: number;
}

// Pure utility functions - no hooks, no state
const formatDateGerman = (dateTimeObject: string): string => {
  const dateObject = new Date(dateTimeObject);
  return dateObject.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

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

export const germanMonth = (monthIndex: number): string => months[monthIndex];

export const germanFormatSumm = (summ: number): string => {
  const fixedSumm = summ.toFixed(2);
  return new Intl.NumberFormat('de-DE').format(parseFloat(fixedSumm));
};

export const getOrdersForMonth = (
  orders: OrderDataModel[],
  month: string,
  year: number,
): OrderDataModel[] => {
  return orders.filter((el) => {
    const [, orderMonth, orderYear] = formatDateGerman(el.created_at).split(
      ' ',
    );
    return month === orderMonth && orderYear === year.toString();
  });
};

export const getStatusStatistics = (
  orders: OrderDataModel[],
): StatusStatistic[] => {
  const statusSums: Record<string, number> = {};

  orders.forEach((order) => {
    const { status, summ } = order;
    statusSums[status] = (statusSums[status] || 0) + summ * 1;
  });

  return Object.entries(statusSums).map(([status, sum]) => ({
    title: statusTitles[status],
    sum,
  }));
};

export const getSummaryMonthly = (
  orders: OrderDataModel[],
  month: string,
  year: number,
): number => {
  return orders.reduce((sum, el) => {
    const [, orderMonth, orderYear] = formatDateGerman(el.created_at).split(
      ' ',
    );
    if (month === orderMonth && orderYear === year.toString()) {
      return sum + el.summ * 1;
    }
    return sum;
  }, 0);
};

export const getSummaryDaily = (
  orders: OrderDataModel[],
  day: string,
): number => {
  if (!Array.isArray(orders)) return 0;
  return orders.reduce((sum, el) => {
    if (day === formatDateGerman(el.created_at)) {
      return sum + el.summ * 1;
    }
    return sum;
  }, 0);
};

export const countDailyOrders = (
  orders: OrderDataModel[],
  day: string,
): number => {
  if (!Array.isArray(orders)) return 0;
  return orders.filter((el) => day === formatDateGerman(el.created_at)).length;
};

export const countOpenOrders = (orders: OrderDataModel[]): number => {
  if (!Array.isArray(orders)) return 0;
  return orders.filter((el) => el.status === 'open').length;
};

export const getTodayDate = (): string => {
  return formatDateGerman(new Date().toString());
};

export const compareDaysInPercent = (orders: OrderDataModel[]): number => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  const formattedDateYesterday = currentDate.toISOString().split('T')[0];
  const summYesterday = getSummaryDaily(
    orders,
    formatDateGerman(formattedDateYesterday),
  );
  const summToday = getSummaryDaily(orders, getTodayDate());

  if (summYesterday === 0 && summToday > 0) return 100;
  if (summToday === 0 && summYesterday > 0) return -100;
  if (summToday > summYesterday && summYesterday > 0) {
    return (summToday / summYesterday) * 100 - 100;
  }
  if (summToday < summYesterday && summYesterday > 0) {
    return -(100 - (summToday / summYesterday) * 100);
  }
  return 0;
};

export const compareMonthsInPercent = (
  orders: OrderDataModel[],
  year: number,
): number => {
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const previousMonthIndex = currentMonthIndex - 1;

  const previousMonthSumm = getSummaryMonthly(
    orders,
    germanMonth(previousMonthIndex),
    year,
  );
  const currentMonthSumm = getSummaryMonthly(
    orders,
    germanMonth(currentMonthIndex),
    year,
  );

  if (previousMonthSumm === 0 && currentMonthSumm > 0) return 100;
  if (currentMonthSumm === 0 && previousMonthSumm > 0) return -100;
  if (currentMonthSumm > previousMonthSumm && previousMonthSumm > 0) {
    return (currentMonthSumm / previousMonthSumm) * 100 - 100;
  }
  if (currentMonthSumm < previousMonthSumm && previousMonthSumm > 0) {
    return -(100 - (currentMonthSumm / previousMonthSumm) * 100);
  }
  return 0;
};

// The hook - only handles data fetching and updates
export const useOrders = () => {
  const { orders, updateOrders } = useOrdersStore();

  const fetchOrders = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/orders/get`);
      updateOrders(res.data.object as OrderDataModel[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (orders.length === 0) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency - run once on mount

  const handleUpdateOrder = async (
    id: number,
    status: string,
    note?: string,
    reminder?: string,
  ) => {
    const data = { status, note, reminder };
    try {
      const res = await axios.post(
        `${BACKEND_URL}/order/status/update/${id}`,
        data,
      );
      updateOrders(res.data.object);
      return res.data.object as string;
    } catch (error) {
      return error;
    }
  };

  const handleSendReminder = async (id: number) => {
    const res = await axios.post(`${BACKEND_URL}/orders/send-reminders`, {
      order_id: id,
    });
    // Endpoint doesn't return orders, so refetch to get the new reminder count
    await fetchOrders();
    return res.data as { message: string; reminders_sent: number };
  };

  return {
    orders,
    handleUpdateOrder,
    handleSendReminder,
  };
};
