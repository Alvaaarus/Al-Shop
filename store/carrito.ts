import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CarritoStore, Producto } from '@/lib/types';

export const useCarritoStore = create<CarritoStore>()(
  persist(
    (set, get) => ({
      items: [],

      agregarItem: (producto: Producto) => {
        const items = get().items;
        const existe = items.find((i) => i.id === producto.id);
        if (existe) {
          set({
            items: items.map((i) =>
              i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...producto, cantidad: 1 }] });
        }
      },

      quitarItem: (id: number) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      actualizarCantidad: (id: number, cantidad: number) => {
        if (cantidad <= 0) {
          get().quitarItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, cantidad } : i
          ),
        });
      },

      limpiarCarrito: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),

      totalPrecio: () =>
        get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
    }),
    {
      name: 'al-shop-carrito', // Persiste en localStorage
    }
  )
);