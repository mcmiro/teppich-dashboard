import { OrderDataModel } from '../../models/order';
import { PropductModel } from '../../models/product';
import { useDateTime } from '../../hooks/use-date-time';
import { useOrders } from '../../hooks/use-orders';
import { UI } from '../../components';
import Calender from '../../assets/icons/calendar.svg';
import Check from '../../assets/icons/check-circle.svg';
import { useEffect, useState } from 'react';

export interface OrderModalProps {
  data: OrderDataModel;
  onToggle: () => void;
}

const OrderModal = ({ data, onToggle }: OrderModalProps) => {
  const { handleDate, handleTime } = useDateTime();
  const { handleUpdateStatus } = useOrders();

  const [statusValue, setStatusValue] = useState<string>('');
  const [products, setProducts] = useState<PropductModel[]>();

  const handleToggleModal = (event: any) => {
    if (event.target === event.currentTarget) {
      onToggle();
    }
  };

  const handleSelectDropDown = (payload: string) => {
    setStatusValue(payload);
  };

  const handleStatus = () => {
    handleUpdateStatus(data.id, statusValue);
  };

  useEffect(() => {
    const parsedProducts: PropductModel[] = JSON.parse(
      JSON.stringify(data.products)
    );
    setProducts(parsedProducts);
  }, [data]);

  const productItems = products?.map((el: PropductModel) => {
    return <UI.Product product={el} key={el.id} />;
  });

  return (
    <div
      onClick={handleToggleModal}
      className="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20 cursor-pointer"
    >
      <div className="bg-white h-full md:h-[80vh] w-full max-w-[800px] md:rounded-lg cursor-default overflow-y-scroll">
        <div className="overflow-hidden bg-white shadow sm:rounded-lg min-h-full pb-24">
          <div className="flex justify-end pt-2 px-4 text-[24px]">
            <div
              onClick={onToggle}
              className="flex justify-center items-center cursor-pointer w-8 h-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="px-4 pb-6 pt-2 sm:px-6">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Bestellinformation
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Kunden- und Produktdaten
              </p>
            </div>
            <div className="px-4 pb-6 pt-2 sm:px-6 text-right">
              <div className="flex gap-2 justify-end">
                <div>
                  <img src={Calender} alt="Kalender" className="h-full w-5 " />
                </div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Bestellungsdatum
                </h3>
              </div>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                {handleDate(data.created_at)}, {handleTime(data.created_at)}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Name</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {data.first_name}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Adresse</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {data.address}, {data.number}, {data.postal_code}, {data.town}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">
                  E-Mail-Adresse
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {data.email}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">
                  Preis gesamt
                  <span className="block text-xs font-light text-gray-500">
                    Inkl. An- und Abholung
                  </span>
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  € {data.summ.toString().replace('.', ',')}
                </dd>
              </div>
              <div>
                {data.products && (
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900">
                      Produkte
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {products && productItems}
                    </dd>
                  </div>
                )}
              </div>
              <div className="px-4 py-6 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">
                  Bestellstatus
                  <div className="flex gap-2 w-full pt-2">
                    <div className="w-6/12">
                      <UI.DropDown onSelect={handleSelectDropDown} />
                    </div>
                    <div className="w-6/12 ">
                      <button
                        disabled={statusValue === ''}
                        onClick={handleStatus}
                        type="button"
                        className={`inline-flex items-center gap-x-2 rounded px-3 py-3 text-sm font-semibold text-white ${
                          statusValue === ''
                            ? 'cursor-not-allowed bg-gray-400'
                            : 'bg-blue-600 hover:bg-blue-500'
                        }`}
                      >
                        Speichern
                        <img src={Check} className="-mr-0.5 h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 sm:mt-0 font-light pt-4">
                    Es ist sehr wichtig, dass der Bestellstatus immer
                    ordnungsgemäß eingetragen wird. Dies hilft nicht nur bei der
                    reibungslosen Verfolgung von Bestellungen, sondern
                    gewährleistet auch, dass Kunden stets über den aktuellen
                    Status informiert sind. Vielen Dank für Ihre Unterstützung
                    bei dieser wichtigen Aufgabe!
                  </div>
                </dt>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
