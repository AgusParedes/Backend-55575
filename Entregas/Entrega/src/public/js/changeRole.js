document.addEventListener('DOMContentLoaded', function() {
   var changeRoleForms = document.querySelectorAll('.change-role-form');

   changeRoleForms.forEach(function(form) {
      form.addEventListener('submit', function(event) {
         event.preventDefault();
         var userId = this.querySelector('button').getAttribute('data-user-id');

         fetch('https://backend-55575-production.up.railway.app/api/users/premium/' + userId, {
               method: 'PUT'
         })
            .then(function(response) {
               if (response.ok) {
                  location.reload();
               } else {
                  alert('Error al cambiar el rol del usuario');
            }
         })
         .catch(function(error) {
            console.error('Error:', error);
         });
      });
   });
});