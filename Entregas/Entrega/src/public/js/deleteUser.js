document.addEventListener('DOMContentLoaded', function() {
   var deleteForms = document.querySelectorAll('.delete-form');

   deleteForms.forEach(function(form) {
      form.addEventListener('submit', function(event) {
         event.preventDefault();
         var userId = this.querySelector('button').getAttribute('data-user-id');

         fetch('http://localhost:8080/api/users/' + userId, {
               method: 'DELETE'
         })
         .then(function(response) {
               if (response.ok) {
                  location.reload();
               } else {
                  alert('Error al eliminar el usuario');
               }
         })
         .catch(function(error) {
               console.error('Error:', error);
         });
      });
   });
});