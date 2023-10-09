const socket = io()

socket.on('connect_error', (err) => {
   console.log('Error de conexión:', err);
 });

socket.on('showProducts', data => {
   const container = document.getElementById('container');
   container.innerHTML = '';

   data.forEach(prod => {
      container.innerHTML += `
            <ul id="ul-id-${prod.id}">
               <li>title: ${prod.title}</li> 
               <li>description: ${prod.description}</li>
               <li>code: ${prod.code}</li>
               <li>price: ${prod.price}</li>
               <li>status: ${prod.status}</li>
               <li>stock: ${prod.stock}</li>
               <li>category: ${prod.category}</li>
               <li>id: ${prod.id}</li>
            </ul>
      `;
   });
});

socket.on('productDeleted', productId => {
   const productElement = document.getElementById(`ul-id-${productId}`);
   if (productElement) {
      productElement.remove();
   }
});

socket.on('productAdded', prod => {
   const container = document.getElementById('container');
   container.innerHTML += `
   <ul id="ul-id-${prod.id}">
      <li>title: ${prod.title}</li> 
      <li>description: ${prod.description}</li>
      <li>code: ${prod.code}</li>
      <li>price: ${prod.price}</li>
      <li>status: ${prod.status}</li>
      <li>stock: ${prod.stock}</li>
      <li>category: ${prod.category}</li>
      <li>id: ${prod.id}</li>
   </ul> 
   `;
});




