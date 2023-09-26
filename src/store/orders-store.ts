import create from 'zustand';
import { OrderDataModel } from '../models/order';

interface OrdersState {
  orders: OrderDataModel[];
  updateOrders: (newOrders: OrderDataModel[]) => void;
}

const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  updateOrders: (newValue) => set({ orders: newValue }),
}));

export default useOrdersStore;
