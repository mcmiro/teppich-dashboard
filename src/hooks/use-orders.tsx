import { useEffect, useState } from 'react';
import axios from 'axios';
import useOrdersStore from '../store/orders-store';
import { useDateTime } from './use-date-time';
import { OrderDataModel } from '../models/order';
import { BACKEND_URL } from '../mocks/backend';

export const useOrders = () => {
  const { orders, updateOrders } = useOrdersStore();
  const [total, setTotal] = useState(0);
  const { handleDate, todayDate, currentMonth, germanMonth } = useDateTime();
  const [filterData, setFilterData] = useState<OrderDataModel[]>([]);

  // get & set all orders from backend
  const fetchData = async (): Promise<OrderDataModel[]> => {
    try {
      const res = await axios.post(`${BACKEND_URL}/orders/get`);
      return res.data.object as OrderDataModel[];
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await fetchData();
        updateOrders(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    const data = {
      status: status,
    };
    try {
      const res = await axios.post(
        `${BACKEND_URL}/order/status/update/${id}`,
        data
      );

      updateOrders(res.data.object);

      return res.data.object as string;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    orders.length && serializeOrders(orders as OrderDataModel[]);
  }, [orders]);

  // get summ of all
  const serializeOrders = async (obj: OrderDataModel[]) => {
    let summ = 0;

    obj.map((el: OrderDataModel) => {
      summ += el.summ * 1;
    });

    setTotal(summ);

    return obj;
  };

  // change numbers into text in german format
  const germanFormatSumm = (summ: number): string => {
    const fixedSumm = summ.toFixed(2);
    const formattedNumber = new Intl.NumberFormat('de-DE').format(
      parseFloat(fixedSumm)
    );

    return formattedNumber;
  };

  // summ monthly
  const summaryMonthly = (month: string, orders: OrderDataModel[]): number => {
    let dailySum = 0;

    if (Array.isArray(orders)) {
      const currentYear = new Date().getFullYear();
      orders.map((el: OrderDataModel) => {
        const orderMonth = handleDate(el.created_at).split(' ')[1];
        const orderYear = handleDate(el.created_at).split(' ')[2];
        if (month === orderMonth && orderYear === currentYear.toString()) {
          dailySum += el.summ * 1;
        }
      });
    }

    return dailySum;
  };

  // get summ daily
  const summaryDaily = (day: string, orders: OrderDataModel[]): number => {
    let dailySum = 0;

    if (Array.isArray(orders)) {
      orders.map((el: OrderDataModel) => {
        if (day == handleDate(el.created_at)) {
          dailySum += el.summ * 1;
        }
      });
    }

    return dailySum;
  };

  // count daily orders
  const countDailyOrders = (day: string, orders: OrderDataModel[]): number => {
    let orderCounter = 0;

    if (Array.isArray(orders)) {
      orders.map((el: OrderDataModel) => {
        if (day == handleDate(el.created_at)) {
          orderCounter++;
        }
      });
    }

    return orderCounter;
  };

  // count all open orders
  const countOpenOrders = (orders: OrderDataModel[]): number => {
    let orderCounter = 0;

    if (Array.isArray(orders)) {
      orders.map((el: OrderDataModel) => {
        if (el.status == 'open') {
          orderCounter++;
        }
      });
    }

    return orderCounter;
  };

  // compare days in percentage
  const compareDaysInPercent = (orders: OrderDataModel[]): number => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const formattedDateYesterday = currentDate.toISOString().split('T')[0];
    const summYesterday = summaryDaily(
      handleDate(formattedDateYesterday.toString()),
      orders
    );

    const summToday = summaryDaily(todayDate(), orders);

    if (summYesterday === 0 && summToday > 0) {
      return 100;
    }
    if (summToday === 0 && summYesterday > 0) {
      return -100;
    }
    if (summToday > summYesterday && summYesterday > 0) {
      return (summToday / summYesterday) * 100 - 100;
    }
    if (summToday < summYesterday && summYesterday > 0) {
      return -(100 - (summToday / summYesterday) * 100);
    } else {
      return 0;
    }
  };

  // compare months in percentage
  const compareMonthsInPercent = (orders: OrderDataModel[]): number => {
    // get previous month
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const previousMonth = currentMonthIndex - 1;
    //get summ of previous
    const previousMonthSumm = summaryMonthly(
      germanMonth(previousMonth),
      orders
    );

    //get summ of current month
    const currentMonthSumm = summaryMonthly(currentMonth(), orders);

    if (previousMonthSumm === 0 && currentMonthSumm > 0) {
      return 100;
    }
    if (currentMonthSumm === 0 && previousMonthSumm > 0) {
      return -100;
    }
    if (currentMonthSumm > previousMonthSumm && previousMonthSumm > 0) {
      return (currentMonthSumm / previousMonthSumm) * 100 - 100;
    }
    if (currentMonthSumm < previousMonthSumm && previousMonthSumm > 0) {
      return -(100 - (currentMonthSumm / previousMonthSumm) * 100);
    } else {
      return 0;
    }
  };

  return {
    orders,
    total,
    filterData,
    germanFormatSumm,
    setFilterData,
    summaryDaily,
    countDailyOrders,
    countOpenOrders,
    summaryMonthly,
    compareDaysInPercent,
    compareMonthsInPercent,
    handleUpdateStatus,
  };
};
