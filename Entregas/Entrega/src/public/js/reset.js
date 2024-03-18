const form = document.getElementById('SendEmailForm');

form.addEventListener('submit', e => {
   e.preventDefault();
   const data = new FormData(form);
   const obj = {};
   
   data.forEach((value, key) => obj[key] = value);
   fetch('/api/logic-reset', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
         'Content-Type': 'application/json'
      }
   }).then(result => {
      if (result.status === 200) {
         console.log('Solicitud de restablecimiento de contraseña enviada correctamente');
         window.location.replace('/');
      } else if (result.status === 401) {
         console.log('Credenciales no válidas');
      } else {
         console.log('Error en el servidor:', result.status);
      }
   }).catch(error => {
      console.error('Error en la llamada a fetch:', error);
   });
});