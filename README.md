# Rincón Futbolero

Tienda adaptable a móvil y computadora, con catálogo de camisetas, carrito y pedidos por WhatsApp.

## Cómo comprar y pagar

El cliente elige una camiseta y su talla, la agrega al carrito y envía el pedido por WhatsApp para confirmar disponibilidad y entrega. Cada camiseta cuesta `$25`; se acepta pago en dólares o por Pago Móvil. El monto en bolívares y los datos de Pago Móvil se confirman por WhatsApp al momento de coordinar el pago.

## Administrar el catálogo

El catálogo es de solo lectura para los visitantes. Para cambiar el inventario oficial, edita `catalog.js` desde tu copia del proyecto y publica los cambios en el repositorio de GitHub con tu cuenta. Solo quien tenga permiso de escritura en el repositorio podrá actualizar la tienda publicada; no hay una opción pública para editar el inventario.

Para agregar una camiseta:

1. Añade la imagen PNG a `assets/`.
2. Agrega un objeto al arreglo de `catalog.js`:

   ```js
   { id: "nombre-unico", name: "Equipo · Modelo", team: "Equipo", category: "Otros", image: "assets/nombre-de-imagen.png", tag: "NUEVA", player: "Nombre del jugador estampado" },
   ```

3. Usa un `id` único y una categoría que corresponda a los filtros: `Barcelona`, `Real Madrid`, `AC Milan` u `Otros`.
4. Guarda el archivo y publica esos cambios en el repositorio con tu cuenta de GitHub.

El precio de cada camiseta se configura en `app.js`; actualmente es `$25`.

Cada producto debe incluir `player`, el jugador que ya viene estampado en esa camiseta. Ese nombre es fijo y no se puede personalizar desde la tienda. Los clientes eligen S, M, L, XL o Niño; la talla y el jugador estampado se incluyen en el pedido de WhatsApp.
