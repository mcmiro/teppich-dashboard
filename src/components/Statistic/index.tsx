import { useOrders } from '../../hooks/use-orders';
import { useDateTime } from '../../hooks/use-date-time';
import ChartDown from '../../assets/icons/arrow-down.svg';
import ChartUp from '../../assets/icons/arrow-up.svg';
import { useEffect, useState } from 'react';

const Statistic = () => {
  const {
    orders,
    summaryMonthly,
    summaryDaily,
    countDailyOrders,
    countOpenOrders,
    compareDaysInPercent,
    germanFormatSumm,
    compareMonthsInPercent,
  } = useOrders();

  const { todayDate, germanMonth } = useDateTime();

  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(-1);

  useEffect(() => {
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();
    setCurrentMonthIndex(monthIndex);
  }, []);

  const stats = [
    {
      name: `Umsatz für ${germanMonth(currentMonthIndex)}`,
      //value: `€ ${germanFormatSumm(summaryMonthly(currentMonth(), orders))}`,
      value: `€ ${germanFormatSumm(
        summaryMonthly(germanMonth(currentMonthIndex), orders)
      )}`,
      change: `${
        compareMonthsInPercent(orders) > 100 ? '+' : '-'
      } ${germanFormatSumm(compareMonthsInPercent(orders))}%`,
      changeType: `${
        compareMonthsInPercent(orders) > 100 ? 'positive' : 'negative'
      }`,
    },
    {
      name: `Umsatz heute`,
      value: `€ ${germanFormatSumm(summaryDaily(todayDate(), orders))}`,
      change: `${
        compareDaysInPercent(orders) >= 0 ? '+' : '-'
      } ${compareDaysInPercent(orders)}%`,
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

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
          >
            <div className="flex items-center justify-center gap-2">
              {/*{index == 0 && (
                <div
                  onClick={() => setCurrentMonthIndex(currentMonthIndex - 1)}
                  className="bg-gray-100 flex items-center justify-center rounded-full w-8 h-8 cursor-pointer"
                >
                  {'<'}
                </div>
              )}*/}
              <dt className="text-sm font-medium leading-6 text-gray-500">
                {stat.name}
              </dt>
              {/*{index == 0 && (
                <div
                  onClick={() => setCurrentMonthIndex(currentMonthIndex + 1)}
                  className="bg-gray-100 flex items-center justify-center rounded-full w-8 h-8 cursor-pointer"
                >
                  {'>'}
                </div>
              )}*/}
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
                    src={ChartDown}
                    className="-ml-1 mr-0.5 h-4 w-5 flex-shrink-0 self-center"
                    aria-hidden="true"
                  />
                ) : (
                  <img
                    src={ChartUp}
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
  );
};

export default Statistic;
