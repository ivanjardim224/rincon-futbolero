# Rincón Futbolero

Tienda adaptable a móvil y computadora, con catálogo de camisetas, carrito y pedidos por WhatsApp.

## Cómo comprar y pagar

El cliente elige una camiseta, su talla y un jugador con su dorsal asociado; luego agrega el modelo al carrito y envía el pedido por WhatsApp para confirmar disponibilidad, pago y entrega. Las camisetas de temporada regular cuestan `$25`, las retro `$28` y los suéteres de entrenamiento sin dorsal `$30`. Se acepta pago en dólares o por Pago Móvil; el monto en bolívares y los datos vigentes se confirman por WhatsApp. Hay delivery a toda Caracas con costo adicional y envíos a toda Venezuela por MRW o Zoom; el costo de entrega se confirma por WhatsApp y no se suma automáticamente al total de las camisetas en el carrito.

## Administrar el catálogo

El catálogo es de solo lectura para los visitantes. Para cambiar el inventario oficial, edita `catalog.js` desde tu copia del proyecto y publica los cambios en el repositorio de GitHub con tu cuenta. Solo quien tenga permiso de escritura en el repositorio podrá actualizar la tienda publicada; no hay una opción pública para editar el inventario.

Para agregar una camiseta:

1. Añade la imagen PNG a `assets/`.
2. Agrega un objeto al arreglo de `catalog.js`:

   ```js
   { id: "nombre-unico", name: "Equipo · Modelo", team: "Equipo", category: "Equipo", image: "assets/nombre-de-imagen.png", tag: "NUEVA", player: "Nombre sugerido", type: "retro", printOptions: [{ name: "Nombre sugerido", number: "9" }] },
   ```

3. Usa un `id` único. El nombre de `team` genera automáticamente un filtro para ese equipo; usa el mismo valor en `category` para mantener los datos consistentes.
4. Guarda el archivo y publica esos cambios en el repositorio con tu cuenta de GitHub.

Las camisetas regulares cuestan `$25` por defecto. Agrega `type: "retro"` para cobrar `$28` o `type: "training"` para un suéter de entrenamiento sin dorsal a `$30`.

Cada producto con estampado debe incluir `player` y `printOptions`, una lista de opciones `{ name, number }` para elegir jugador y dorsal juntos. Los jugadores de temporada regular se configuran en `TEAM_PRINT_OPTIONS` en `catalog.js`; en productos `retro`, ofrece solo el jugador y dorsal que corresponden a esa camiseta. En camisetas de temporada regular, el cliente también puede elegir “Otro jugador” y escribir un nombre y un dorsal de 0 a 99. Para un modelo que se vende sin estampado, agrega `noPrint: true`; no mostrará selector de jugador y el pedido indicará “Sin dorsal”. Los clientes eligen S, M, L, XL o Niño; talla, estampado, precio y cantidad se incluyen en el pedido de WhatsApp.

Para ofrecer más vistas en el detalle de una camiseta, añade `gallery: ["assets/otra-vista.png"]` al producto. El botón de cada tarjeta abre la imagen en grande; se pueden recorrer las fotos adicionales desde esa vista. Los botones flotantes de Instagram y TikTok, además de los enlaces sociales, llevan a los perfiles de Rincón Futbolero.
