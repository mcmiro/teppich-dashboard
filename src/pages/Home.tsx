import useOrdersStore from '../store/orders-store';
import { UI } from '../components/index';

const Orders = () => {
  const { orders } = useOrdersStore();

  return (
    <div className="md:p-8">
      <div className="mx-auto mt-8">
        <div className="mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Statistik
          </h2>
          <div className="mt-4 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
            <div className="lg:flex-auto">
              <p className="text-xl leading-8 text-gray-600">
                Eine schnelle Übersicht über die finanzielle Monatsbilanz.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <UI.Statistic />
      </div>
      <div>{orders.length > 0 && <UI.OrderDataTable orders={orders} />}</div>
    </div>
  );
};

export default Orders;
