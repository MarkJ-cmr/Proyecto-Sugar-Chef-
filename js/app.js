// ===================================================
// 1. MENÚ HAMBURGUESA RESPONSIVO (Semana 14)
// ===================================================
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  const isActive = navLinks.classList.toggle('is-active');
  menuToggle.classList.toggle('is-active');
  menuToggle.setAttribute('aria-expanded', isActive);
});

// Cerrar menú automáticamente al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach((enlace) => {
  enlace.addEventListener('click', () => {
    navLinks.classList.remove('is-active');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===================================================
// 2. VENTANA MODAL FLOTANTE ACCESIBLE (Semana 14)
// ===================================================
const modalOverlay = document.getElementById('modal-overlay');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

const abrirModal = () => {
  modalOverlay.classList.add('is-visible');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Bloqueo de scroll
};

const cerrarModal = () => {
  modalOverlay.classList.remove('is-visible');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto'; // Restaurar scroll
};

openModalBtn.addEventListener('click', abrirModal);
closeModalBtn.addEventListener('click', cerrarModal);

// Cerrar al hacer clic fuera del cuadro de diálogo (Backdrop)
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    cerrarModal();
  }
});

// Cerrar al presionar la tecla Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) {
    cerrarModal();
  }
});

// ===================================================
// 3. ARREGLOS Y MANIPULACIÓN DEL DOM PARA COMANDAS (Semanas 12 & 13)
// ===================================================
const bocaditosAgregados = []; // Arreglo en memoria

const selectPaquete = document.getElementById('selectPaquete');
const selectBocadito = document.getElementById('selectBocadito');
const btnAgregarBocadito = document.getElementById('btn-agregar-bocadito');
const listaAdicionales = document.getElementById('lista-adicionales');
const totalMontoEl = document.getElementById('total-monto');
const detalleResumenEl = document.getElementById('detalle-resumen');
const formComanda = document.getElementById('form-comanda');

// Función para recalcular el total y actualizar el DOM de forma segura
function actualizarTotal() {
  const opcionPaquete = selectPaquete.options[selectPaquete.selectedIndex];
  const precioPaquete = parseFloat(opcionPaquete.dataset.precio) || 0;

  let subtotalBocaditos = 0;
  for (const item of bocaditosAgregados) {
    subtotalBocaditos += item.precio;
  }

  const totalFinal = precioPaquete + subtotalBocaditos;

  totalMontoEl.textContent = `S/ ${totalFinal.toFixed(2)}`;
  detalleResumenEl.textContent = `${opcionPaquete.value} + ${bocaditosAgregados.length} adicional(es) de bocaditos`;
}

// Renderizar lista de bocaditos en el DOM usando createElement y textContent (Prevención XSS)
function renderizarBocaditos() {
  listaAdicionales.innerHTML = '';

  bocaditosAgregados.forEach((item, index) => {
    const li = document.createElement('li');

    const spanTexto = document.createElement('span');
    spanTexto.textContent = `${item.nombre} — S/ ${item.precio.toFixed(2)}`;

    const btnEliminar = document.createElement('button');
    btnEliminar.type = 'button';
    btnEliminar.className = 'btn-remove-item';
    btnEliminar.textContent = 'Quitar';

    btnEliminar.addEventListener('click', () => {
      bocaditosAgregados.splice(index, 1);
      renderizarBocaditos();
      actualizarTotal();
    });

    li.appendChild(spanTexto);
    li.appendChild(btnEliminar);
    listaAdicionales.appendChild(li);
  });
}

// Evento al presionar "Agregar" bocadito
btnAgregarBocadito.addEventListener('click', () => {
  const opcion = selectBocadito.options[selectBocadito.selectedIndex];
  const nombre = opcion.value;
  const precio = parseFloat(opcion.dataset.precio);

  bocaditosAgregados.push({ nombre, precio });
  renderizarBocaditos();
  actualizarTotal();
});

// Evento al cambiar de paquete en el <select>
selectPaquete.addEventListener('change', actualizarTotal);

// Seleccionar paquete directamente desde las tarjetas superiores
document.querySelectorAll('.btn-select-pkg').forEach((boton) => {
  boton.addEventListener('click', () => {
    const nombrePaquete = boton.dataset.paquete;

    for (let i = 0; i < selectPaquete.options.length; i++) {
      if (selectPaquete.options[i].value === nombrePaquete) {
        selectPaquete.selectedIndex = i;
        break;
      }
    }

    actualizarTotal();
    document.getElementById('cotizador').scrollIntoView({ behavior: 'smooth' });
  });
});

// ===================================================
// 4. ENVÍO DE COMANDA FORMATEADA A WHATSAPP
// ===================================================
formComanda.addEventListener('submit', (e) => {
  e.preventDefault(); // Evitar recarga de la página

  const nombre = document.getElementById('nombreCliente').value.trim();
  const fecha = document.getElementById('fechaEntrega').value;
  const paquete = selectPaquete.value;
  const keke = document.getElementById('selectKeke').value;
  const tematica = document.getElementById('tematica').value.trim() || 'Por definir';
  const distrito = document.getElementById('distrito').value.trim();
  const total = totalMontoEl.textContent;

  const textoAdicionales =
    bocaditosAgregados.length > 0
      ? bocaditosAgregados.map((b) => b.nombre).join(', ')
      : 'Ninguno';

  const mensaje =
    `📋 *NUEVA COMANDA - SUGAR CHEF*%0A%0A` +
    `👤 *Cliente:* ${nombre}%0A` +
    `📅 *Fecha de Entrega:* ${fecha}%0A` +
    `📦 *Paquete:* ${paquete}%0A` +
    `🍰 *Sabor de Keke:* ${keke}%0A` +
    `🧁 *Bocaditos Adicionales:* ${textoAdicionales}%0A` +
    `✨ *Temática:* ${tematica}%0A` +
    `📍 *Distrito:* ${distrito}%0A` +
    `💰 *TOTAL ESTIMADO:* ${total}`;

  // Número oficial de la empresa (+51 922 445 727)
  const telefonoEmpresa = '51922445727';
  const urlWhatsApp = `https://wa.me/${telefonoEmpresa}?text=${mensaje}`;

  window.open(urlWhatsApp, '_blank');
});