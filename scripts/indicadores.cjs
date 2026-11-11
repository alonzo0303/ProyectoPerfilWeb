'use strict';
const fs = require('node:fs');
const states = new Set(['nueva', 'contactada', 'propuesta', 'ganada', 'perdida']);
function summarize(data) {
    if (!Array.isArray(data.oportunidades) || !Array.isArray(data.tickets)) throw new Error('Se necesitan las listas oportunidades y tickets.');
    const ids = new Set();
    const etapas = Object.fromEntries([...states].map(s => [s, 0]));
    const monedas = {};
    for (const item of data.oportunidades) {
        if (typeof item.id !== 'string' || !item.id.trim() || ids.has(item.id)) throw new Error('Cada oportunidad necesita un id único.');
        ids.add(item.id);
        if (!states.has(item.estado)) throw new Error('Estado de oportunidad no permitido.');
        etapas[item.estado]++;
        if (item.estado !== 'ganada') continue;
        if (!/^[A-Z]{3}$/.test(item.moneda || '')) throw new Error('Indica la moneda de tres letras en cada venta ganada.');
        for (const key of ['ingreso', 'costo']) if (typeof item[key] !== 'number' || !Number.isFinite(item[key]) || item[key] < 0) throw new Error('Ingreso y costo deben ser números no negativos.');
        const total = monedas[item.moneda] ||= {ingreso: 0, costo: 0};
        total.ingreso += item.ingreso;
        total.costo += item.costo;
    }
    const resolved = [];
    const ticketIds = new Set();
    let abiertos = 0;
    for (const item of data.tickets) {
        if (typeof item.id !== 'string' || !item.id.trim() || ticketIds.has(item.id)) throw new Error('Cada ticket necesita un id único.');
        ticketIds.add(item.id);
        const created = Date.parse(item.creado);
        if (!Number.isFinite(created)) throw new Error('Fecha de creación de ticket inválida.');
        if (item.resuelto == null) { abiertos++; continue; }
        const end = Date.parse(item.resuelto);
        if (!Number.isFinite(end) || end < created) throw new Error('La resolución debe ser posterior a la creación.');
        resolved.push((end - created) / 3600000);
    }
    for (const total of Object.values(monedas)) {
        total.margen = total.ingreso - total.costo;
        total.margen_porcentaje = total.ingreso ? total.margen / total.ingreso * 100 : null;
    }
    const cerradas = etapas.ganada + etapas.perdida;
    return {
        oportunidades: data.oportunidades.length,
        etapas,
        tasa_cierre_sobre_cerradas: cerradas ? etapas.ganada / cerradas * 100 : null,
        importes_por_moneda: monedas,
        soporte: {abiertos, resueltos: resolved.length, horas_resolucion_media: resolved.length ? resolved.reduce((a,b) => a+b, 0) / resolved.length : null}
    };
}
if (require.main === module) {
    try {
        const file = process.argv[2];
        if (!file) throw new Error('Uso: npm run indicadores -- ruta-al-archivo.json');
        console.log(JSON.stringify(summarize(JSON.parse(fs.readFileSync(file, 'utf8'))), null, 2));
    } catch (error) {
        console.error(`No se generaron indicadores: ${error.message}`);
        process.exitCode = 1;
    }
}
module.exports = {summarize};
