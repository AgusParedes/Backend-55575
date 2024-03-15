document.addEventListener('DOMContentLoaded', function() {
   const forms = document.querySelectorAll('form');
   forms.forEach(form => {
      form.addEventListener('submit', async function(event) {
         event.preventDefault();

         const url = this.action;

         try {
            const response = await fetch(url, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               }
            });

            if (response.ok) {
               alert('La compra se realizo con exito');
               window.location.reload(); 
            } else {
                  alert('Hubo un error al intentar la compra');
               }
         } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al intentar la compra');
         }
      });
   });
});