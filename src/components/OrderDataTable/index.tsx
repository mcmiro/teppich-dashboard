import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { OrderDataModel } from '../../models/order';
import { UI } from '../../components';
import { useDateTime } from '../../hooks/use-date-time';
import useSearchStore from '../../store/search-store';

export interface OrderDataTableProps {
  orders: OrderDataModel[];
}

const OrderDataTable = ({ orders }: OrderDataTableProps) => {
  const [orderModalData, setOrderModalData] = useState<OrderDataModel>();
  const [orderModalVisible, setOrderModalVisible] = useState<boolean>(false);

  const { handleDate, handleTime } = useDateTime();
  const { searchValue } = useSearchStore();

  const tableColumns = [
    {
      name: 'Bearbeiten',
      cell: (row: OrderDataModel) => (
        <UI.EditCellButton data={row} onClick={handleRowClick} />
      ),
    },
    {
      name: 'ID',
      selector: (row: OrderDataModel) => row.id,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: OrderDataModel) => row.status,
      sortable: true,
      cell: (row: any) => (
        <div>
          <UI.Label status={row.status} />
        </div>
      ),
    },
    {
      name: 'Name',
      selector: (row: OrderDataModel) => row.first_name,
      sortable: true,
      style: {
        fontWeight: '600 !important',
      },
    },
    {
      name: 'PLZ',
      selector: (row: OrderDataModel) => row.postal_code,
      sortable: true,
    },
    {
      name: 'Adresse',
      selector: (row: OrderDataModel) => row.address,
      sortable: true,
      cell: (row: OrderDataModel) => (
        <div>
          <div className="font-semibold text-gray-800">{row.address}</div>
          <div className="text-gray-500 text-xs pt-1">{row.number}</div>
        </div>
      ),
    },
    {
      name: 'Preis',
      selector: (row: OrderDataModel) => row.summ,
      sortable: true,
      cell: (row: OrderDataModel) => (
        <div className="text-gray-500 text-xs pt-1">€{row.summ}</div>
      ),
    },
    {
      name: 'E-Mail',
      selector: (row: OrderDataModel) => row.email,
      sortable: true,
    },
    {
      name: 'Datum',
      selector: (row: OrderDataModel) => row.created_at,
      sortable: true,
      cell: (row: OrderDataModel) => (
        <div>
          <div className="font-semibold text-gray-800">
            {handleDate(row.created_at)}
          </div>
          <div className="text-gray-500 text-xs pt-1">
            {handleTime(row.created_at)}
          </div>
        </div>
      ),
    },
  ];

  // Filter
  const filteredItems = orders.filter((item) =>
    ['first_name', 'email'].some(
      (prop) =>
        item[prop as keyof OrderDataModel] &&
        item[prop as keyof OrderDataModel]
          .toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase())
    )
  );

  const handleRowClick = (row: OrderDataModel) => {
    setOrderModalData(row);
    setOrderModalVisible(true);
  };

  return (
    <div>
      {orderModalVisible && orderModalData && (
        <UI.OrderModal
          data={orderModalData}
          onToggle={() => setOrderModalVisible(false)}
        />
      )}
      <DataTable
        columns={tableColumns}
        data={searchValue ? filteredItems : orders}
        pagination
        paginationPerPage={25}
        paginationRowsPerPageOptions={[25, 50, 100]}
        paginationComponentOptions={{
          rowsPerPageText: 'Datensätze pro Seite:',
          rangeSeparatorText: 'von insgesamt',
        }}
        noDataComponent="Es sind keine Datensätze vorhanden"
        subHeader
        persistTableHead
        className="table-container"
      />
    </div>
  );
};

export default OrderDataTable;
