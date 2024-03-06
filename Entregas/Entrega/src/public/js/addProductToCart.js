document.addEventListener('DOMContentLoaded', function() {
   // Escuchar el evento submit de todos los formularios
   const forms = document.querySelectorAll('form');
   forms.forEach(form => {
      form.addEventListener('submit', async function(event) {
         event.preventDefault();

         // Obtener la URL de acción del formulario
         const url = this.action;

         try {
            const response = await fetch(url, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               }
            });

            if (response.ok) {
               alert('El producto se agregó al carrito correctamente.');
            } else {
               alert('Hubo un error al agregar el producto al carrito.');
            }
         } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al agregar el producto al carrito.');
         }
      });
   });
});