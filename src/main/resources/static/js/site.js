'use strict';

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

const form = document.getElementById('solicitud-form');
const service = document.getElementById('servicio');
const notice = document.getElementById('saas-aviso');
const status = document.getElementById('form-status');
const fallback = document.getElementById('contact-fallback');
const fields = [...form.querySelectorAll('input, select, textarea')];
const help = {
    'Perfil profesional': 'Cuéntanos tu profesión y qué trabajos o proyectos quieres presentar.',
    'Página web para negocio': 'Indica qué vende tu negocio y qué consultas quieres recibir desde tu web.',
    'Software a medida': 'Describe el proceso que necesitas resolver y cómo lo realizas actualmente.',
    'ALSHAFACTURAS SaaS': 'Cuéntanos qué tipo de comercio tienes y qué necesitas gestionar. El producto está en desarrollo.',
    'Soporte y mantenimiento': 'Describe qué ocurre, en qué pantalla y desde cuándo. No incluyas contraseñas.'
};
// Los mensajes y los datos viven en esta página, sin almacenamiento ni rastreadores.
const errors = new Map();
for (const field of fields) {
    const error = document.createElement('p');
    error.id = `${field.id}-error`;
    error.className = 'field-error';
    error.hidden = true;
    if (field.type === 'checkbox') field.closest('label').after(error);
    else field.after(error);
    field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
    errors.set(field, error);
}
service.setAttribute('aria-describedby', service.getAttribute('aria-describedby') + ' service-help saas-aviso');
function errorFor(field) {
    const value = field.value.trim();
    if (field.type === 'checkbox') return field.required && !field.checked ? 'Autoriza el contacto para continuar con la consulta.' : '';
    if (field.required && !value) return 'Completa este campo.';
    if (value && field.minLength > 0 && value.length < field.minLength) return `Escribe al menos ${field.minLength} caracteres.`;
    if (field.maxLength > 0 && value.length > field.maxLength) return `Usa como máximo ${field.maxLength} caracteres.`;
    if (field.type === 'email' && value && !field.validity.valid) return 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
    if (field === service && !Object.hasOwn(help, value)) return 'Selecciona un servicio de la lista.';
    return '';
}
function validate(field) {
    const message = errorFor(field);
    const error = errors.get(field);
    error.textContent = message;
    error.hidden = !message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
}
function invalidateRequest() {
    status.textContent = '';
    fallback.hidden = true;
    document.getElementById('whatsapp-fallback').removeAttribute('href');
    document.getElementById('email-fallback').removeAttribute('href');
}
function updateService() {
    notice.hidden = service.value !== 'ALSHAFACTURAS SaaS';
    document.getElementById('service-help').textContent = help[service.value] || 'Selecciona un servicio para orientar tu consulta.';
    invalidateRequest();
}
service.addEventListener('change', updateService);
for (const field of fields) {
    field.addEventListener('input', () => {
        invalidateRequest();
        if (field.getAttribute('aria-invalid') === 'true') validate(field);
    });
    field.addEventListener('change', () => {
        invalidateRequest();
        if (field.getAttribute('aria-invalid') === 'true') validate(field);
    });
}
document.querySelectorAll('[data-servicio]').forEach(link => {
    link.addEventListener('click', () => {
        service.value = link.dataset.servicio;
        updateService();
        if (service.getAttribute('aria-invalid') === 'true') validate(service);
    });
});
form.addEventListener('submit', event => {
    event.preventDefault();
    for (const field of fields) if (field.type !== 'checkbox') field.value = field.value.trim();
    const invalid = fields.filter(field => !validate(field));
    document.getElementById('form-errors').hidden = invalid.length === 0;
    if (invalid.length) {
        invalidateRequest();
        invalid[0].focus();
        return;
    }
    const data = new FormData(form);
    const lines = [
        'Hola, Alsha Group. Quiero realizar una consulta.',
        `Servicio o producto: ${data.get('servicio')}`,
        `Nombre: ${data.get('nombre')}`
    ];
    for (const [key, label] of [['empresa','Negocio'],['email','Correo'],['plazo','Plazo deseado'],['presupuesto','Presupuesto disponible']]) {
        if (data.get(key)) lines.push(`${label}: ${data.get(key)}`);
    }
    lines.push(`Consulta: ${data.get('mensaje')}`);
    if (service.value === 'ALSHAFACTURAS SaaS') lines.push('Entiendo que ALSHAFACTURAS está en desarrollo. Solicito información sobre disponibilidad y condiciones.');
    // Solo los identificadores de campaña permitidos; nunca la URL o query completas.
    const params = new URLSearchParams(window.location.search);
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
        const value = params.get(key);
        if (value && /^[a-zA-Z0-9_-]{1,80}$/.test(value)) lines.push(`${key}: ${value}`);
    }
    const message = lines.join('\n');
    const url = `https://wa.me/51932341719?text=${encodeURIComponent(message)}`;
    document.getElementById('whatsapp-fallback').href = url;
    document.getElementById('email-fallback').href = `mailto:gustavomontes2603@gmail.com?subject=${encodeURIComponent('Consulta Alsha Group: ' + service.value)}&body=${encodeURIComponent(message)}`;
    fallback.hidden = false;
    // Un bloqueo o una excepción del navegador deja los enlaces alternativos disponibles.
    try { window.open(url, '_blank', 'noopener,noreferrer'); } catch { /* Usar el enlace visible. */ }
    status.textContent = 'Continúa en WhatsApp y pulsa Enviar para hacernos llegar tu consulta. Si no se abrió, utiliza uno de los enlaces de abajo.';
    // Punto de integración sin datos personales ni transmisión a servicios externos.
    form.dispatchEvent(new CustomEvent('alsha:consulta-preparada', {bubbles: true, detail: {servicio: service.value}}));
});
document.getElementById('solicitud-submit').disabled = false;
updateService();

document.querySelectorAll('a[href="#privacidad"]').forEach(link => link.addEventListener('click', () => {
    document.getElementById('privacidad').open = true;
}));
(() => {
    const encabezado = document.querySelector(".alsha-header");
    const botonMenu = document.getElementById("menu-toggle");

    if (!encabezado || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let posicionAnterior = Math.max(0, window.scrollY);
    let temporizador;

    function ocultar() {
        encabezado.classList.remove("encabezado-apareciendo");
        encabezado.classList.add("encabezado-oculto");
    }

    function mostrar() {
        if (!encabezado.classList.contains("encabezado-oculto")) {
            return;
        }

        encabezado.classList.remove("encabezado-oculto");
        encabezado.classList.add("encabezado-apareciendo");
    }

    window.addEventListener("scroll", () => {
        const posicionActual = Math.max(0, window.scrollY);
        const diferencia = posicionActual - posicionAnterior;

        // Ignora movimientos mínimos.
        if (Math.abs(diferencia) < 2) return;

        posicionAnterior = posicionActual;
        clearTimeout(temporizador);

        const menuAbierto =
            botonMenu?.getAttribute("aria-expanded") === "true";
        const tieneFoco =
            encabezado.contains(document.activeElement);

        if (
            diferencia > 0 &&
            posicionActual > encabezado.offsetHeight &&
            !menuAbierto &&
            !tieneFoco
        ) {
            ocultar();
        } else {
            mostrar();
        }

        temporizador = setTimeout(mostrar, 600);
    }, { passive: true });

    encabezado.addEventListener("animationend", (evento) => {
        if (evento.animationName === "revelar-encabezado") {
            encabezado.classList.remove("encabezado-apareciendo");
        }
    });

    encabezado.addEventListener("focusin", () => {
        clearTimeout(temporizador);
        encabezado.classList.remove("encabezado-oculto", "encabezado-apareciendo");
    });
})();
