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

// JSDOM no implementa el diálogo nativo. Se simulan sus dos métodos;
// el foco nativo y Escape se comprueban también en Chromium real.
function setupViewer() {
    const dom = setup(), d = dom.window.document;
    const viewer = d.getElementById('image-viewer');
    viewer.showModal = () => { viewer.open = true; };
    viewer.close = () => {
        viewer.open = false;
        viewer.dispatchEvent(new dom.window.Event('close'));
    };
    dom.window.eval(fs.readFileSync(path.join(root, 'src/main/resources/static/js/image-viewer.js'), 'utf8'));
    return dom;
}
test('El visor abre la imagen elegida, conserva su descripción y devuelve el foco al cerrar', () => {
    const dom = setupViewer(), d = dom.window.document;
    const opener = d.querySelector('[data-image-preview]');
    const event = new dom.window.MouseEvent('click', {bubbles:true,cancelable:true,button:0});
    opener.dispatchEvent(event);
    assert.equal(event.defaultPrevented, true);
    assert.equal(d.getElementById('image-viewer').open, true);
    assert.equal(d.getElementById('image-viewer-image').src, opener.querySelector('img').src);
    assert.equal(d.getElementById('image-viewer-image').alt, opener.querySelector('img').alt);
    assert.equal(d.getElementById('image-viewer-title').textContent, opener.dataset.imageTitle);
    assert.equal(d.activeElement.id, 'image-viewer-close');
    d.getElementById('image-viewer-close').click();
    assert.equal(d.getElementById('image-viewer').open, false);
    assert.equal(d.activeElement, opener);
    assert.equal(d.documentElement.classList.contains('image-viewer-open'), false);
    assert.equal(d.getElementById('image-viewer-image').hasAttribute('src'), false);
    dom.window.close();
});
test('El teclado recorre los controles del visor en ambas direcciones', () => {
    const dom = setupViewer(), d = dom.window.document;
    d.querySelector('[data-image-preview]').click();
    const viewer = d.getElementById('image-viewer');
    const close = d.getElementById('image-viewer-close');
    const original = d.getElementById('image-viewer-original');
    close.dispatchEvent(new dom.window.KeyboardEvent('keydown', {key:'Tab',shiftKey:true,bubbles:true,cancelable:true}));
    assert.equal(d.activeElement, original);
    original.dispatchEvent(new dom.window.KeyboardEvent('keydown', {key:'Tab',bubbles:true,cancelable:true}));
    assert.equal(d.activeElement, close);
    viewer.close();
    dom.window.close();
});
test('Un fallo de imagen ofrece recuperación y no altera el formulario', () => {
    const dom = setupViewer(), d = dom.window.document;
    const opener = d.querySelector('[data-image-preview]');
    d.getElementById('nombre').value = 'Gustavo';
    opener.click();
    d.getElementById('image-viewer-image').dispatchEvent(new dom.window.Event('error'));
    assert.equal(d.getElementById('image-viewer-image').hidden, true);
    assert.equal(d.getElementById('image-viewer-status').hidden, false);
    assert.match(d.getElementById('image-viewer-status').textContent, /No se pudo cargar/);
    assert.equal(d.getElementById('image-viewer-original').href, opener.href);
    d.getElementById('image-viewer-close').click();
    assert.equal(d.getElementById('nombre').value, 'Gustavo');
    dom.window.close();
});

test('El zoom permite consultar el tamaño original y se restablece al cerrar', () => {
    const dom = setupViewer(), d = dom.window.document;
    d.querySelector('[data-image-preview]').click();
    const viewer = d.getElementById('image-viewer');
    const zoom = d.getElementById('image-viewer-zoom');
    assert.equal(zoom.disabled, true);
    d.getElementById('image-viewer-image').dispatchEvent(new dom.window.Event('load'));
    zoom.click();
    assert.equal(viewer.classList.contains('is-zoomed'), true);
    assert.equal(zoom.getAttribute('aria-pressed'), 'true');
    assert.equal(viewer.querySelector('.image-viewer__body').tabIndex, 0);
    zoom.click();
    assert.equal(viewer.classList.contains('is-zoomed'), false);
    zoom.click();
    viewer.close();
    assert.equal(viewer.classList.contains('is-zoomed'), false);
    assert.equal(zoom.getAttribute('aria-pressed'), 'false');
    assert.equal(viewer.querySelector('.image-viewer__body').hasAttribute('tabindex'), false);
    dom.window.close();
});
