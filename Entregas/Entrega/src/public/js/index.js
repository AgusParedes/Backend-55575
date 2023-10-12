const socket = io()

socket.on('connect_error', (err) => {
   console.log('Error de conexión:', err);
});


const addProductForm = document.getElementById('addProductForm');
if (addProductForm){
   addProductForm.addEventListener('submit', function(e) {
   e.preventDefault();
   const title = document.getElementById('title').value;
   const description = document.getElementById('description').value;
   const code = document.getElementById('code').value;
   const price = document.getElementById('price').value;
   const stock = document.getElementById('stock').value;
   const category = document.getElementById('category').value;
   const thumbnail = document.getElementById('thumbnail').value;
   socket.emit('addProduct', { title, description, code, price, stock, category, thumbnail});
})}

const container = document.getElementById('container');
if (container){container.addEventListener('click', function(e) {
   if (e.target.tagName === 'BUTTON' && e.target.classList.contains('deleteBtn')) {
      const productId = e.target.dataset.productId;
      socket.emit('deleteProduct', productId);
   }
})};

socket.on('showProducts', data => {
   const container = document.getElementById('container');
   container.innerHTML = '';

   data.forEach(prod => {
      container.innerHTML += `
            <ul id="ul-id-${prod.id}">
               <li>title: ${prod.title}</li> 
               <li>description: ${prod.description}</li>
               <li>code: ${prod.code}</li>
               <li>price: $${prod.price}</li>
               <li>status: ${prod.status}</li>
               <li>stock: ${prod.stock}</li>
               <li>category: ${prod.category}</li>
               <li>thumbnail: ["${prod.thumbnail}"]</li>
               <li>id: ${prod.id}</li>
               <li><button class="deleteBtn" data-product-id="${prod.id}">Eliminar</button></li>
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
      <li>price: $${prod.price}</li>
      <li>status: ${prod.status}</li>
      <li>stock: ${prod.stock}</li>
      <li>category: ${prod.category}</li>
      <li>thumbnail: ["${prod.thumbnail}"]</li>
      <li>id: ${prod.id}</li>
      <li><button class="deleteBtn" data-product-id="${prod.id}">Eliminar</button></li>
   </ul> 
   `;
});




