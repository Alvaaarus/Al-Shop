export interface Producto {
  id: number;
  codigo: string;          // Código del proveedor: E04, N08, etc.
  nombre: string;
  precio: number;
  imagen: string;
  imagenes?: string[];
  video?: string;
  descripcion: string;
  etiquetas: string[];
  talla: string;
  color: string;
  stock: number;
  rating: number;
  reviews: number;
  nuevo: boolean;
  /** Línea bajo el título (ej. "Gorra snapback · Streetwear") */
  categoria?: string;
  /** Texto de materiales para ficha estilo detalle */
  materiales?: string;
  /** Viñetas de características (sustituye fila de "tallas" en la ficha) */
  caracteristicas?: string[];
}

export interface CarritoItem extends Producto {
  cantidad: number;
}

export interface CarritoStore {
  items: CarritoItem[];
  agregarItem: (producto: Producto) => void;
  quitarItem: (id: number) => void;
  actualizarCantidad: (id: number, cantidad: number) => void;
  limpiarCarrito: () => void;
  totalItems: () => number;
  totalPrecio: () => number;
}