export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price);
};

export const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Número de WhatsApp de la tienda (formato internacional sin +).
 * Cambia este valor antes de publicar en producción.
 * Ejemplo: '5215512345678' para México DF.
 */
export const WA_NUMBER = '528911055765';