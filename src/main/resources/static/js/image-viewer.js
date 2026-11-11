'use strict';

(() => {
    const viewer = document.getElementById('image-viewer');
    // El enlace a la imagen original sigue funcionando sin soporte de <dialog>.
    if (!viewer || typeof viewer.showModal !== 'function') return;

    const image = document.getElementById('image-viewer-image');
    const title = document.getElementById('image-viewer-title');
    const close = document.getElementById('image-viewer-close');
    const original = document.getElementById('image-viewer-original');
    const zoom = document.getElementById('image-viewer-zoom');
    const body = viewer.querySelector('.image-viewer__body');
    const zoomHelp = document.getElementById('image-viewer-zoom-help');
    const status = document.getElementById('image-viewer-status');
    let opener;
    let scrollWasLocked = false;

    function resetZoom() {
        viewer.classList.remove('is-zoomed');
        zoom.setAttribute('aria-pressed', 'false');
        zoom.textContent = 'Ver al 100 %';
        zoomHelp.hidden = true;
        body.removeAttribute('tabindex');
        body.removeAttribute('role');
        body.removeAttribute('aria-label');
        body.scrollLeft = 0;
        body.scrollTop = 0;
    }
    image.addEventListener('load', () => {
        status.hidden = true;
        zoom.disabled = false;
    });
    image.addEventListener('error', () => {
        if (!viewer.open) return;
        resetZoom();
        zoom.disabled = true;
        image.hidden = true;
        status.textContent = 'No se pudo cargar la imagen. Puedes abrir la imagen original o cerrar esta vista.';
        status.hidden = false;
    });

    document.querySelectorAll('[data-image-preview]').forEach(link => {
        link.addEventListener('click', event => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            const thumbnail = link.querySelector('img');
            if (!thumbnail || viewer.open) return;
            // Si falla la apertura nativa, el enlace conserva su navegación normal.
            try { viewer.showModal(); } catch { return; }
            event.preventDefault();
            opener = link;
            scrollWasLocked = document.documentElement.classList.contains('image-viewer-open');
            document.documentElement.classList.add('image-viewer-open');
            title.textContent = link.dataset.imageTitle || 'Imagen ampliada';
            image.alt = thumbnail.alt;
            resetZoom();
            zoom.disabled = true;
            image.hidden = false;
            status.textContent = 'Cargando imagen…';
            status.hidden = false;
            original.href = link.href;
            image.src = thumbnail.currentSrc || thumbnail.src;
            close.focus({preventScroll: true});
        });
    });

    zoom.addEventListener('click', () => {
        if (viewer.classList.contains('is-zoomed')) { resetZoom(); return; }
        viewer.classList.add('is-zoomed');
        zoom.setAttribute('aria-pressed', 'true');
        zoom.textContent = 'Ajustar a pantalla';
        zoomHelp.hidden = false;
        body.setAttribute('tabindex', '0');
        body.setAttribute('role', 'region');
        body.setAttribute('aria-label', 'Imagen al tamaño original. Usa las flechas para desplazarte.');
        body.scrollLeft = (body.scrollWidth - body.clientWidth) / 2;
        body.scrollTop = (body.scrollHeight - body.clientHeight) / 2;
    });
    // Mantener Tab y Mayús+Tab dentro de los controles del visor.
    viewer.addEventListener('keydown', event => {
        if (event.key !== 'Tab') return;
        if (event.shiftKey && document.activeElement === close) {
            event.preventDefault();
            original.focus();
        } else if (!event.shiftKey && document.activeElement === original) {
            event.preventDefault();
            close.focus();
        }
    });
    close.addEventListener('click', () => viewer.close());
    // Escape se gestiona de forma nativa, con foco atrapado en el diálogo modal.
    viewer.addEventListener('click', event => {
        if (event.target !== viewer) return;
        const bounds = viewer.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
    });
    viewer.addEventListener('close', () => {
        if (!scrollWasLocked) document.documentElement.classList.remove('image-viewer-open');
        resetZoom();
        zoom.disabled = true;
        image.removeAttribute('src');
        original.removeAttribute('href');
        status.hidden = true;
        if (opener?.isConnected) opener.focus({preventScroll: true});
        opener = undefined;
    });
})();
