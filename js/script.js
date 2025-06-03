
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const recoverForm = document.getElementById('recoverForm');
  const formPaciente = document.getElementById('formPaciente');
  const tablaPacientes = document.getElementById('tablaPacientes')?.querySelector('tbody');
  const contadores = document.getElementById('contadores');

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
  let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

  if (formPaciente) {
    actualizarTabla();
    actualizarContadores();
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const correo = document.getElementById('regCorreo').value;
      const clave = document.getElementById('regClave').value;
      usuarios[correo] = clave;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      alert('Cuenta creada con éxito');
      registerForm.reset();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const correo = document.getElementById('loginCorreo').value;
      const clave = document.getElementById('loginClave').value;
      if (usuarios[correo] === clave) {
        window.location.href = 'dashboard.html';
      } else {
        alert('Credenciales incorrectas');
      }
    });
  }

  if (recoverForm) {
    recoverForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const correo = document.getElementById('recCorreo').value;
      const clave = document.getElementById('recClave').value;
      if (usuarios[correo]) {
        usuarios[correo] = clave;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert('Contraseña actualizada');
        recoverForm.reset();
      } else {
        alert('Correo no registrado');
      }
    });
  }

  if (formPaciente) {
    formPaciente.addEventListener('submit', (e) => {
      e.preventDefault();
      const paciente = {
        nombre: document.getElementById('nombre').value,
        edad: document.getElementById('edad').value,
        genero: document.getElementById('genero').value,
        documento: document.getElementById('documento').value,
        sintomas: document.getElementById('sintomas').value,
        gravedad: document.getElementById('gravedad').value,
        tratamiento: document.getElementById('tratamiento').value,
        medicamentos: document.getElementById('medicamentos').value,
        examenes: document.getElementById('examenes').value,
      };
      pacientes.push(paciente);
      localStorage.setItem('pacientes', JSON.stringify(pacientes));
      actualizarTabla();
      actualizarContadores();
      formPaciente.reset();
    });
  }

  function actualizarTabla() {
    if (!tablaPacientes) return;
    tablaPacientes.innerHTML = '';
    pacientes.forEach((p, i) => {
      const fila = document.createElement('tr');
      fila.className = p.gravedad.toLowerCase();
      fila.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.edad}</td>
        <td>${p.documento}</td>
        <td>${p.gravedad}</td>
        <td><button class="btn btn-danger btn-sm" onclick="eliminarPaciente(${i})">X</button></td>
      `;
      tablaPacientes.appendChild(fila);
    });
  }

  window.eliminarPaciente = (i) => {
    if (confirm('¿Eliminar paciente?')) {
      pacientes.splice(i, 1);
      localStorage.setItem('pacientes', JSON.stringify(pacientes));
      actualizarTabla();
      actualizarContadores();
    }
  };

  function actualizarContadores() {
    if (!contadores) return;
    const conteo = { critico: 0, urgente: 0, moderado: 0, leve: 0 };
    pacientes.forEach(p => conteo[p.gravedad.toLowerCase()]++);
    contadores.innerHTML = `
      <div class="alert alert-danger">Críticos: ${conteo.critico}</div>
      <div class="alert alert-warning">Urgentes: ${conteo.urgente}</div>
      <div class="alert alert-info">Moderados: ${conteo.moderado}</div>
      <div class="alert alert-success">Leves: ${conteo.leve}</div>
    `;
  }
});
