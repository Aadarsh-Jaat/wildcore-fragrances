import { createContext, useContext, useReducer, ReactNode } from 'react';
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  volume: number;
  quantity: number;
}
interface CartState {
  items: CartItem[];
}
type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string; volume: number }
  | { type: 'UPDATE_QTY'; id: string; volume: number; quantity: number }
  | { type: 'CLEAR_CART' };
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = `${action.item.id}-${action.item.volume}`;
      const existing = state.items.find(i => `${i.id}-${i.volume}` === key);
      if (existing) {
        return {
          items: state.items.map(i =>
            `${i.id}-${i.volume}` === key
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => !(i.id === action.id && i.volume === action.volume)) };
    case 'UPDATE_QTY':
      return {
        items: state.items.map(i =>
          i.id === action.id && i.volume === action.volume
            ? { ...i, quantity: action.quantity }
            : i
        ).filter(i => i.quantity > 0),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, volume: number) => void;
  updateQty: (id: string, volume: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}
const CartContext = createContext<CartContextType | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
      removeItem: (id, volume) => dispatch({ type: 'REMOVE_ITEM', id, volume }),
      updateQty: (id, volume, quantity) => dispatch({ type: 'UPDATE_QTY', id, volume, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      total,
      count,
    }}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
