const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  const isActive = navLinks.classList.toggle('is-active');
  menuToggle.classList.toggle('is-active');
  menuToggle.setAttribute('aria-expanded', isActive);
});

document.querySelectorAll('.nav-links a').forEach((enlace) => {
  enlace.addEventListener('click', () => {
    navLinks.classList.remove('is-active');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const modalOverlay = document.getElementById('modal-overlay');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

const abrirModal = () => {
  modalOverlay.classList.add('is-visible');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; 
};

const cerrarModal = () => {
  modalOverlay.classList.remove('is-visible');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto'; 
};

openModalBtn.addEventListener('click', abrirModal);
closeModalBtn.addEventListener('click', cerrarModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    cerrarModal();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) {
    cerrarModal();
  }
});

const bocaditosAgregados = [];

const selectPaquete = document.getElementById('selectPaquete');
const selectBocadito = document.getElementById('selectBocadito');
const btnAgregarBocadito = document.getElementById('btn-agregar-bocadito');
const listaAdicionales = document.getElementById('lista-adicionales');
const totalMontoEl = document.getElementById('total-monto');
const detalleResumenEl = document.getElementById('detalle-resumen');
const formComanda = document.getElementById('form-comanda');

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

btnAgregarBocadito.addEventListener('click', () => {
  const opcion = selectBocadito.options[selectBocadito.selectedIndex];
  const nombre = opcion.value;
  const precio = parseFloat(opcion.dataset.precio);

  bocaditosAgregados.push({ nombre, precio });
  renderizarBocaditos();
  actualizarTotal();
});

selectPaquete.addEventListener('change', actualizarTotal);

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

formComanda.addEventListener('submit', (e) => {
  e.preventDefault(); 

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

  const telefonoEmpresa = '51922445727';
  const urlWhatsApp = `https://wa.me/${telefonoEmpresa}?text=${mensaje}`;

  window.open(urlWhatsApp, '_blank');
});
