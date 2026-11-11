const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'src/main/resources/templates/index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'src/main/resources/static/js/site.js'), 'utf8');
function setup() {
    const dom = new JSDOM(html, {runScripts: 'outside-only', url:'https://example.test/'});
    dom.opened = [];
    dom.window.open = (...args) => { dom.opened.push(args); return null; };
    dom.window.eval(js);
    return dom;
}
test('El menú móvil se abre, informa su estado y cierra con Escape', () => {
    const dom = setup(), d = dom.window.document;
    const button = d.getElementById('menu-toggle'), menu = d.getElementById('menu-movil');
    button.click();
    assert.equal(menu.hidden, false);
    assert.equal(button.getAttribute('aria-expanded'), 'true');
    d.dispatchEvent(new dom.window.KeyboardEvent('keydown', {key:'Escape'}));
    assert.equal(menu.hidden, true);
    assert.equal(button.getAttribute('aria-expanded'), 'false');
    dom.window.close();
});
test('La llamada del SaaS selecciona producto y muestra disponibilidad', () => {
    const dom = setup(), d = dom.window.document;
    d.querySelector('[data-servicio="ALSHAFACTURAS SaaS"]').click();
    assert.equal(d.getElementById('servicio').value, 'ALSHAFACTURAS SaaS');
    assert.equal(d.getElementById('saas-aviso').hidden, false);
    dom.window.close();
});
test('Una solicitud inválida no abre WhatsApp y la válida lo abre directamente con el producto', () => {
    const dom = setup(), d = dom.window.document;
    const form = d.getElementById('solicitud-form');
    const submit = () => form.dispatchEvent(new dom.window.Event('submit', {cancelable:true}));
    submit();
    assert.equal(dom.opened.length, 0);
    d.getElementById('servicio').value = 'ALSHAFACTURAS SaaS';
    d.getElementById('nombre').value = ' Gustavo & Ana ';
    d.getElementById('mensaje').value = 'Necesito información: <script> & inventarios.';
    submit(); // Falta consentimiento.
    assert.equal(dom.opened.length, 0);
    d.getElementById('consentimiento').checked = true;
    submit();
    assert.equal(dom.opened.length, 1);
    assert.equal(dom.opened[0][1], '_blank');
    assert.equal(dom.opened[0][2], 'noopener,noreferrer');
    const url = new URL(dom.opened[0][0]);
    assert.equal(url.origin, 'https://wa.me');
    assert.equal(url.pathname, '/51932341719');
    const message = url.searchParams.get('text');
    assert.ok(message.includes('Gustavo & Ana'));
    assert.ok(message.includes('<script> & inventarios.'));
    assert.ok(message.includes('está en desarrollo'));
    assert.ok(d.getElementById('form-status').textContent.includes('pulsa Enviar'));
    d.getElementById('mensaje').dispatchEvent(new dom.window.Event('input', {bubbles:true}));
    assert.equal(d.getElementById('form-status').textContent, '');
    dom.window.close();
});
test('Todos los anclajes y recursos propios existen y los campos tienen etiquetas', () => {
    const dom = setup(), d = dom.window.document;
    for (const a of d.querySelectorAll('a[href^="#"]')) {
        assert.ok(d.getElementById(a.getAttribute('href').slice(1)), a.outerHTML);
    }
    for (const el of d.querySelectorAll('img[src],link[href],script[src]')) {
        const url = el.getAttribute('src') || el.getAttribute('href');
        if (url.startsWith('/')) assert.ok(fs.existsSync(path.join(root, 'src/main/resources/static', url)), url);
    }
    for (const field of d.querySelectorAll('input,select,textarea')) {
        assert.ok(field.id && d.querySelector(`label[for="${field.id}"]`));
    }
    assert.equal(d.querySelectorAll('main').length, 1);
    assert.equal(d.querySelectorAll('details').length, d.querySelectorAll('details > summary').length);
    assert.ok(!html.includes('localhost'));
    assert.ok(!html.includes('cdn.tailwindcss.com'));
    dom.window.close();
});

test('El aviso vive debajo de la marca y se despliega desde el consentimiento', () => {
    const dom = setup(), d = dom.window.document;
    const notice = d.getElementById('privacidad');
    assert.equal(notice.tagName, 'DETAILS');
    assert.ok(notice.closest('footer'));
    assert.equal(notice.open, false);
    d.querySelector('a[href="#privacidad"]').click();
    assert.equal(notice.open, true);
    dom.window.close();
});

test('Los errores aparecen junto al campo y el foco llega al primero inválido', () => {
    const dom = setup(), d = dom.window.document;
    d.getElementById('solicitud-form').dispatchEvent(new dom.window.Event('submit', {cancelable:true}));
    assert.equal(d.activeElement.id, 'servicio');
    assert.equal(d.getElementById('servicio').getAttribute('aria-invalid'), 'true');
    assert.equal(d.getElementById('servicio-error').hidden, false);
    d.getElementById('servicio').value = 'Software a medida';
    d.getElementById('servicio').dispatchEvent(new dom.window.Event('change'));
    assert.equal(d.getElementById('servicio-error').hidden, true);
    d.getElementById('nombre').value = '   ';
    d.getElementById('mensaje').value = 'corto';
    d.getElementById('consentimiento').checked = true;
    d.getElementById('solicitud-form').dispatchEvent(new dom.window.Event('submit', {cancelable:true}));
    assert.equal(d.activeElement.id, 'nombre');
    assert.match(d.getElementById('mensaje-error').textContent, /10/);
    assert.equal(dom.opened.length, 0);
    dom.window.close();
});

test('Un bloqueo de WhatsApp deja alternativas correctas y editarlas invalida el mensaje', () => {
    const dom = setup(), d = dom.window.document;
    dom.window.open = () => { throw new Error('Popup blocked'); };
    d.getElementById('servicio').value = 'Página web para negocio';
    d.getElementById('nombre').value = 'María & José';
    d.getElementById('mensaje').value = 'Necesito una página con catálogo & contacto.';
    d.getElementById('plazo').value = 'Flexible';
    d.getElementById('presupuesto').value = 'Por definir';
    d.getElementById('consentimiento').checked = true;
    const events = [];
    d.addEventListener('alsha:consulta-preparada', e => events.push(e.detail));
    d.getElementById('solicitud-form').dispatchEvent(new dom.window.Event('submit', {cancelable:true}));
    assert.equal(d.getElementById('contact-fallback').hidden, false);
    const wa = new URL(d.getElementById('whatsapp-fallback').href);
    assert.match(wa.searchParams.get('text'), /María & José/);
    assert.match(wa.searchParams.get('text'), /Plazo deseado: Flexible/);
    const mail = new URL(d.getElementById('email-fallback').href);
    assert.equal(mail.protocol, 'mailto:');
    assert.match(mail.searchParams.get('body'), /catálogo & contacto/);
    assert.deepEqual(Object.keys(events[0]), ['servicio']);
    d.getElementById('mensaje').dispatchEvent(new dom.window.Event('input'));
    assert.equal(d.getElementById('contact-fallback').hidden, true);
    assert.equal(d.getElementById('whatsapp-fallback').hasAttribute('href'), false);
    dom.window.close();
});

test('La atribución solo incorpora identificadores de campaña permitidos', () => {
    const dom = setup(), d = dom.window.document;
    dom.window.history.replaceState({}, '', '/?utm_source=instagram&utm_campaign=web_2026&utm_medium=a%40b.com&token=privado');
    d.getElementById('servicio').value = 'Perfil profesional';
    d.getElementById('nombre').value = 'Ana';
    d.getElementById('mensaje').value = 'Quiero presentar mis proyectos.';
    d.getElementById('consentimiento').checked = true;
    d.getElementById('solicitud-form').dispatchEvent(new dom.window.Event('submit', {cancelable:true}));
    const message = new URL(dom.opened[0][0]).searchParams.get('text');
    assert.match(message, /utm_source: instagram/);
    assert.match(message, /utm_campaign: web_2026/);
    assert.ok(!message.includes('privado'));
    assert.ok(!message.includes('a@b.com'));
    assert.equal(d.querySelectorAll('script:not([src])').length, 0);
    dom.window.close();
});
