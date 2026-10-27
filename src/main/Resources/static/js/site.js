'use strict';

// Menú móvil: estado visible y accesible, cierre al navegar o pulsar Escape.
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu-movil');
function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    toggle.setAttribute('aria-expanded', String(!menu.hidden));
});
menu.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
        closeMenu();
        toggle.focus();
    }
});

// La solicitud se prepara localmente; no hay envío, cuenta o cobro automático.
const form = document.getElementById('solicitud-form');
const service = document.getElementById('servicio');
const notice = document.getElementById('saas-aviso');
const status = document.getElementById('form-status');
function invalidateRequest() {
    status.textContent = '';
}
function updateService() {
    notice.hidden = service.value !== 'ALSHAFACTURAS SaaS';
    invalidateRequest();
}
service.addEventListener('change', updateService);
form.addEventListener('input', invalidateRequest);
form.addEventListener('change', invalidateRequest);
document.querySelectorAll('[data-servicio]').forEach(link => {
    link.addEventListener('click', () => {
        service.value = link.dataset.servicio;
        updateService();
    });
});
form.addEventListener('submit', event => {
    event.preventDefault();
    // required no rechaza espacios: normalizamos antes de validar.
    ['nombre', 'empresa', 'email', 'mensaje'].forEach(id => {
        const field = document.getElementById(id);
        field.value = field.value.trim();
    });
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [
        'Hola, Alsha Group. Quiero realizar una consulta.',
        `Servicio o producto: ${data.get('servicio')}`,
        `Nombre: ${data.get('nombre')}`,
    ];
    if (data.get('empresa')) lines.push(`Negocio: ${data.get('empresa')}`);
    if (data.get('email')) lines.push(`Correo: ${data.get('email')}`);
    lines.push(`Consulta: ${data.get('mensaje')}`);
    if (service.value === 'ALSHAFACTURAS SaaS') {
        lines.push('Entiendo que ALSHAFACTURAS está en desarrollo. Solicito información sobre disponibilidad y condiciones.');
    }
    const url = `https://wa.me/51932341719?text=${encodeURIComponent(lines.join('\n'))}`;
    // Se abre durante el clic del usuario; no hay paso intermedio de preparación.
    window.open(url, '_blank', 'noopener,noreferrer');
    status.textContent = 'Continúa en WhatsApp y pulsa Enviar para hacernos llegar tu consulta. Si no se abrió, revisa si tu navegador bloqueó la nueva pestaña.';
});
// Solo habilitar cuando todos los controladores se hayan registrado.
document.getElementById('solicitud-submit').disabled = false;
updateService();

// El enlace del formulario abre el aviso del pie antes de desplazarse hasta él.
document.querySelector('a[href="#privacidad"]').addEventListener('click', () => {
    document.getElementById('privacidad').open = true;
});
