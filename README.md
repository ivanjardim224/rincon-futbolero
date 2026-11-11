# Rincón Futbolero

Tienda adaptable a móvil y computadora, con catálogo de camisetas, carrito y pedidos por WhatsApp.

## Administrar el catálogo

El catálogo es de solo lectura para los visitantes. Para cambiar el inventario oficial, edita `catalog.js` desde tu copia del proyecto y publica los cambios en el repositorio de GitHub con tu propia cuenta. Solo los colaboradores con permiso de escritura en ese repositorio pueden actualizar la tienda publicada.

Para agregar una camiseta:

1. Añade la imagen PNG a `assets/`.
2. Agrega un objeto al arreglo de `catalog.js`:

   ```js
   { id: "nombre-unico", name: "Equipo · Modelo", team: "Equipo", category: "Otros", image: "assets/nombre-de-imagen.png", tag: "NUEVA" },
   ```

3. Usa un `id` único y una categoría que corresponda a los filtros: `Barcelona`, `Real Madrid`, `AC Milan` u `Otros`.
4. Guarda el archivo y publica esos cambios en el repositorio con tu cuenta de GitHub.

El precio de cada camiseta se configura en `app.js`; actualmente es `$25`.

Los clientes eligen S, M, L, XL o Niño antes de agregar una camiseta al carrito. La talla seleccionada se incluye en el pedido de WhatsApp.
