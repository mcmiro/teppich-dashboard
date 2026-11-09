import { useEffect, useState } from 'react';
import { ICON } from '../../assets/icons';
import { UI } from '../../components';
import { useDateTime } from '../../hooks/use-date-time';
import { useOrders } from '../../hooks/use-orders';
import { OrderDataModel } from '../../models/order';
import { PropductModel } from '../../models/product';
import { MAX_REMINDERS } from '../../status';

export interface OrderModalProps {
  data: OrderDataModel;
  onToggle: () => void;
}

const OrderModal = ({ data, onToggle }: OrderModalProps) => {
  const { handleDate, handleTime } = useDateTime();
  const { orders, handleUpdateOrder, handleSendReminder } = useOrders();

  const [statusValue, setStatusValue] = useState<string>('');
  const [products, setProducts] = useState<PropductModel[]>();
  const [noteValue, setNoteValue] = useState<string>(data.note || '');
  const [reminderSending, setReminderSending] = useState(false);
  const [reminderMessage, setReminderMessage] = useState<string>('');

  // `data` is a snapshot from the table, read the live order for the current count
  const liveOrder = orders.find((o) => o.id === data.id) ?? data;
  const reminderCount = Number(liveOrder.reminder) || 0;
  const canSendReminder =
    liveOrder.status === 'unobtainable' && reminderCount < MAX_REMINDERS;

  const onSendReminder = async () => {
    setReminderSending(true);
    setReminderMessage('');
    try {
      const res = await handleSendReminder(data.id);
      setReminderMessage(res.message);
    } catch {
      setReminderMessage('Erinnerung konnte nicht gesendet werden.');
    } finally {
      setReminderSending(false);
    }
  };

  const hasChanges = statusValue !== '' || noteValue !== (data.note || '');

  const handleToggleModal = (event: any) => {
    if (event.target === event.currentTarget) {
      onToggle();
    }
  };

  const handleSelectDropDown = (payload: string) => {
    setStatusValue(payload);
  };

  const handleSave = () => {
    const status = statusValue || data.status;
    handleUpdateOrder(data.id, status, noteValue);
  };

  useEffect(() => {
    const parsedProducts: PropductModel[] = JSON.parse(
      JSON.stringify(data.products),
    );
    setProducts(parsedProducts);
  }, [data]);

  const productItems = products?.map((el: PropductModel) => {
    return <UI.Product product={el} key={el.id.toString()} />;
  });

  return (
    <div
      onClick={handleToggleModal}
      className="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20 cursor-pointer"
    >
      <div className="bg-white h-full md:h-[80vh] w-full max-w-[800px] md:rounded-lg cursor-default overflow-y-scroll">
        <div className="overflow-hidden bg-white sm:rounded-lg min-h-full pb-24">
          <div className="flex justify-end pt-4 px-4 text-[24px]">
            <div
              onClick={onToggle}
              className="flex justify-center items-center cursor-pointer w-8 h-8"
            >
              <img src={ICON.CloseCircle} className="h-8 w-8" />
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
                  <img
                    src={ICON.Calender}
                    alt="Kalender"
                    className="h-full w-5 "
                  />
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
                <dt className="text-sm font-medium text-gray-900">Telefon</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {data.phone}
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
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Notiz</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <textarea
                    value={noteValue}
                    onChange={(e) => setNoteValue(e.target.value)}
                    rows={3}
                    placeholder="Optionale Notiz hinzufügen..."
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">
                  Erinnerung
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <button
                    disabled={!canSendReminder || reminderSending}
                    onClick={onSendReminder}
                    type="button"
                    className={`inline-flex items-center gap-x-2 rounded px-3 py-2 text-sm font-semibold text-white ${
                      !canSendReminder || reminderSending
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    {reminderSending ? 'Wird gesendet...' : 'Erinnerung senden'}
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                      {reminderCount}/{MAX_REMINDERS}
                    </span>
                  </button>
                  {liveOrder.status !== 'unobtainable' && (
                    <p className="pt-2 text-xs text-gray-500">
                      Nur für Bestellungen mit Status „Nicht erreichbar“.
                    </p>
                  )}
                  {reminderMessage && (
                    <p className="pt-2 text-xs text-gray-500">
                      {reminderMessage}
                    </p>
                  )}
                </dd>
              </div>
              <div className="px-4 py-6 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">
                  Bestellstatus
                  {data.status !== 'done' ? (
                    <div className="flex gap-2 w-full pt-2">
                      <div className="w-6/12">
                        <UI.DropDown
                          onSelect={handleSelectDropDown}
                          defaultValue={data.status}
                        />
                      </div>
                      <div className="w-6/12 ">
                        <button
                          disabled={!hasChanges}
                          onClick={handleSave}
                          type="button"
                          className={`inline-flex items-center gap-x-2 rounded px-3 py-3 text-sm font-semibold text-white ${
                            !hasChanges
                              ? 'cursor-not-allowed bg-gray-400'
                              : 'bg-blue-600 hover:bg-blue-500'
                          }`}
                        >
                          Speichern
                          <img src={ICON.Check} className="-mr-0.5 h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="inline-flex rounded-full gap-2 bg-green-300 border border-green-400 py-1.5 px-4 mt-2">
                        <img src={ICON.Check} className="h-5 w-5" />
                        <p>Abgeschlossen</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-1 text-xs text-gray-500 sm:mt-0 font-light pt-4">
                    Es ist sehr wichtig, dass der Bestellstatus immer
                    ordnungsgemäß angepasst wird. Dies hilft nicht nur bei der
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
