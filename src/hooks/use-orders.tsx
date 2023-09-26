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
      orders.map((el: OrderDataModel) => {
        const orderMonth = handleDate(el.created_at).split(' ')[1];
        if (month == orderMonth) {
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
    const yesterday = currentDate.setDate(currentDate.getDate() - 1);
    const summYesterday = summaryDaily(
      handleDate(yesterday.toString()),
      orders
    );

    const summToday = summaryDaily(todayDate(), orders);

    const result =
      summToday === 0 || summYesterday === 0 ? 0 : summToday / summYesterday;

    return result ? 100 : result * 100;
  };

  // compare months in percentage
  const compareMonthsInPercent = (orders: OrderDataModel[]): number => {
    // get previous month
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const previousMonth = currentMonthIndex - 1;
    // get summ of previous
    const previousMonthSumm = summaryMonthly(
      germanMonth(previousMonth),
      orders
    );

    //get summ of current month
    const currentMonthSumm = summaryMonthly(currentMonth(), orders);

    const result = currentMonthSumm / previousMonthSumm;

    return result <= 0 ? 100 : 100 - result * 100;
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
