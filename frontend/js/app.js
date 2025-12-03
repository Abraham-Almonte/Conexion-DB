// app.js
const API_URL = 'http://localhost:3000/api/usuarios';

// Variables del DOM
const form = document.getElementById('usuario-form');
const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');
const usuarioIdInput = document.getElementById('usuario-id');
const tbody = document.getElementById('usuarios-tbody');
const notification = document.getElementById('notification');

// Variables del formulario
const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const telefonoInput = document.getElementById('telefono');
const edadInput = document.getElementById('edad');

// Estado de la aplicación
let modoEdicion = false;

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
  cargarUsuarios();
  configurarEventos();
});

// Configurar eventos
function configurarEventos() {
  form.addEventListener('submit', manejarSubmit);
  btnCancel.addEventListener('click', cancelarEdicion);
}

// Cargar todos los usuarios
async function cargarUsuarios() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    
    if (result.success) {
      mostrarUsuarios(result.data);
    } else {
      mostrarNotificacion('Error al cargar usuarios', 'error');
    }
  } catch (error) {
    mostrarNotificacion('Error de conexión con el servidor', 'error');
    console.error('Error:', error);
  }
}

// Mostrar usuarios en la tabla
function mostrarUsuarios(usuarios) {
  tbody.innerHTML = '';
  
  if (usuarios.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 30px; color: #999;">
          No hay usuarios registrados
        </td>
      </tr>
    `;
    return;
  }
  
  usuarios.forEach(usuario => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${usuario.nombre}</td>
      <td>${usuario.email}</td>
      <td>${usuario.telefono}</td>
      <td>${usuario.edad}</td>
      <td>
        <button class="btn-edit" onclick="editarUsuario('${usuario._id}')">
          Editar
        </button>
        <button class="btn-delete" onclick="eliminarUsuario('${usuario._id}')">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Manejar envío del formulario
async function manejarSubmit(e) {
  e.preventDefault();
  
  const usuario = {
    nombre: nombreInput.value.trim(),
    email: emailInput.value.trim(),
    telefono: telefonoInput.value.trim(),
    edad: parseInt(edadInput.value)
  };
  
  if (modoEdicion) {
    await actualizarUsuario(usuarioIdInput.value, usuario);
  } else {
    await crearUsuario(usuario);
  }
}

// Crear nuevo usuario
async function crearUsuario(usuario) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    });
    
    const result = await response.json();
    
    if (result.success) {
      mostrarNotificacion('Usuario creado exitosamente', 'success');
      form.reset();
      cargarUsuarios();
    } else {
      mostrarNotificacion(result.mensaje || 'Error al crear usuario', 'error');
    }
  } catch (error) {
    mostrarNotificacion('Error de conexión con el servidor', 'error');
    console.error('Error:', error);
  }
}

// Editar usuario (cargar datos en formulario)
async function editarUsuario(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const result = await response.json();
    
    if (result.success) {
      const usuario = result.data;
      
      // Cambiar a modo edición
      modoEdicion = true;
      usuarioIdInput.value = usuario._id;
      nombreInput.value = usuario.nombre;
      emailInput.value = usuario.email;
      telefonoInput.value = usuario.telefono;
      edadInput.value = usuario.edad;
      
      // Actualizar UI
      formTitle.textContent = 'Editar Usuario';
      btnSubmit.textContent = 'Actualizar Usuario';
      btnCancel.style.display = 'block';
      
      // Scroll al formulario
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (error) {
    mostrarNotificacion('Error al cargar datos del usuario', 'error');
    console.error('Error:', error);
  }
}

// Actualizar usuario
async function actualizarUsuario(id, usuario) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    });
    
    const result = await response.json();
    
    if (result.success) {
      mostrarNotificacion('Usuario actualizado exitosamente', 'success');
      cancelarEdicion();
      cargarUsuarios();
    } else {
      mostrarNotificacion(result.mensaje || 'Error al actualizar usuario', 'error');
    }
  } catch (error) {
    mostrarNotificacion('Error de conexión con el servidor', 'error');
    console.error('Error:', error);
  }
}

// Eliminar usuario
async function eliminarUsuario(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      mostrarNotificacion('Usuario eliminado exitosamente', 'success');
      cargarUsuarios();
    } else {
      mostrarNotificacion(result.mensaje || 'Error al eliminar usuario', 'error');
    }
  } catch (error) {
    mostrarNotificacion('Error de conexión con el servidor', 'error');
    console.error('Error:', error);
  }
}

// Cancelar edición
function cancelarEdicion() {
  modoEdicion = false;
  form.reset();
  usuarioIdInput.value = '';
  formTitle.textContent = 'Agregar Nuevo Usuario';
  btnSubmit.textContent = 'Guardar Usuario';
  btnCancel.style.display = 'none';
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo) {
  notification.textContent = mensaje;
  notification.className = `notification ${tipo} show`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}