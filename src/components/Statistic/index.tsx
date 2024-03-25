import { useEffect, useState } from 'react';
import { useOrders } from '../../hooks/use-orders';
import { useDateTime } from '../../hooks/use-date-time';
import { ICON } from '../../assets/icons';

const Statistic = () => {
  const {
    orders,
    summaryMonthly,
    setCurrentYear,
    currentYear,
    summaryDaily,
    countDailyOrders,
    countOpenOrders,
    compareDaysInPercent,
    germanFormatSumm,
    compareMonthsInPercent,
    getSelectedMonthOrders,
    filteredOrders,
    statusStatistic,
  } = useOrders();

  const { todayDate, germanMonth } = useDateTime();

  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(-1);
  const [monthInPercent, setMonthInPercent] = useState<number>(0);

  useEffect(() => {
    orders.length && setMonthInPercent(compareMonthsInPercent());
  }, [orders]);

  useEffect(() => {
    orders.length && getSelectedMonthOrders(germanMonth(currentMonthIndex));
  }, [orders, currentMonthIndex]);

  useEffect(() => {
    filteredOrders.length && console.log('filteredOrders', filteredOrders);
  }, [filteredOrders]);

  useEffect(() => {
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();
    setCurrentMonthIndex(monthIndex);
  }, []);

  const stats = [
    {
      name: `Umsatz für ${germanMonth(currentMonthIndex)} ${currentYear}`,
      value: `€ ${germanFormatSumm(
        summaryMonthly(germanMonth(currentMonthIndex))
      )}`,
      change: `${monthInPercent > 0 ? '+' : ''} ${germanFormatSumm(
        monthInPercent
      )}%`,
      changeType: `${monthInPercent > 0 ? 'positive' : 'negative'}`,
    },
    {
      name: `Umsatz heute`,
      value: `€ ${germanFormatSumm(summaryDaily(todayDate(), orders))}`,
      change: `${
        compareDaysInPercent(orders) >= 0 ? '+' : ''
      } ${compareDaysInPercent(orders).toFixed(2)}%`,
      changeType: `${
        compareDaysInPercent(orders) >= 0 ? 'positive' : 'negative'
      }`,
    },
    {
      name: 'Bestellungen heute',
      value: countDailyOrders(todayDate(), orders),
    },
    {
      name: 'Offene Bestellungen',
      value: countOpenOrders(orders),
    },
  ];

  const decreaseStatisticPeriod = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    } else {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    }
  };

  const increaseStatisticPeriod = () => {
    if (currentMonthIndex < 11) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    } else {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    }
  };

  return (
    <div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index: number) => (
            <div
              key={stat.name}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-white px-4 py-4 sm:px-6 xl:px-8"
            >
              <div className="flex items-center justify-center gap-2">
                {index === 0 && (
                  <div
                    onClick={decreaseStatisticPeriod}
                    className="w-6 h-6 cursor-pointer opacity-50"
                  >
                    <img src={ICON.ArrowLeftCircle} className="w-full h-full" />
                  </div>
                )}
                <dt className="text-sm font-medium leading-6 text-gray-500">
                  {stat.name}
                </dt>
                {index === 0 && (
                  <div
                    onClick={increaseStatisticPeriod}
                    className="w-6 h-6 cursor-pointer opacity-50"
                  >
                    <img
                      src={ICON.ArrowRightCircle}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
              {stat.changeType && (
                <div
                  className={`${
                    stat.changeType === 'negative'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }
                  inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0`}
                >
                  {stat.changeType === 'negative' ? (
                    <img
                      src={ICON.ChartDown}
                      className="-ml-1 mr-0.5 h-4 w-5 flex-shrink-0 self-center"
                      aria-hidden="true"
                    />
                  ) : (
                    <img
                      src={ICON.ChartUp}
                      className="-ml-1 mr-0.5 h-4 w-5 flex-shrink-0 self-center"
                      aria-hidden="true"
                    />
                  )}

                  <span className="sr-only">
                    {' '}
                    {stat.changeType === 'increase'
                      ? 'Increased'
                      : 'Decreased'}{' '}
                    by{' '}
                  </span>
                  {stat.change}
                </div>
              )}
              <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="overflow-hidden py-2 px-4 mt-4">
        <div className="w-full flex-none font-base leading-8 tracking-tight text-gray-900">
          {statusStatistic.length &&
            statusStatistic.map((el, index) => (
              <div key={index} className="flex justify-between w-full border-b">
                <div>{el.title}</div>
                <div>€ {germanFormatSumm(parseFloat(el.sum.toFixed(2)))}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Statistic;
