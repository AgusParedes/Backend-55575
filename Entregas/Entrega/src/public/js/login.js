const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
   e.preventDefault();
   const data = new FormData(form);
   const obj = {};
   
   data.forEach((value, key) => obj[key] = value);
   fetch('/api/sessions/login', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
         'Content-Type': 'application/json'
      }
   }).then(result => {
      if (result.status === 200) {
         console.log('Login successful');
         window.location.replace('/');
         // Agrega lógica de redirección u otras acciones después del inicio de sesión exitoso
      } else if (result.status === 401) {
         console.log('Invalid credentials');
         // Agrega lógica para manejar credenciales inválidas
      } else {
         console.log('Server error:', result.status);
         // Agrega lógica para manejar otros errores del servidor
      }
   }).catch(error => {
      console.error('Error en la llamada a fetch:', error);
   });
})   