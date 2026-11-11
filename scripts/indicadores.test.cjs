const {test} = require('node:test');
const assert = require('node:assert/strict');
const {summarize} = require('./indicadores.cjs');

test('Los registros vacíos no inventan porcentajes ni tiempos', () => {
    const report = summarize({oportunidades: [], tickets: []});
    assert.equal(report.oportunidades, 0);
    assert.equal(report.tasa_cierre_sobre_cerradas, null);
    assert.equal(report.soporte.horas_resolucion_media, null);
});
test('Separa monedas, cuenta cierres y calcula tiempos solo de tickets resueltos', () => {
    const report = summarize({oportunidades: [
        {id:'a', estado:'ganada', moneda:'PEN', ingreso:200, costo:80},
        {id:'b', estado:'ganada', moneda:'USD', ingreso:100, costo:40},
        {id:'c', estado:'perdida'}, {id:'d', estado:'propuesta'}
    ], tickets: [
        {id:'t1', creado:'2026-11-01T12:00:00-05:00', resuelto:'2026-11-01T16:00:00-05:00'},
        {id:'t2', creado:'2026-11-01T12:00:00-05:00', resuelto:null}
    ]});
    assert.equal(report.importes_por_moneda.PEN.margen, 120);
    assert.equal(report.importes_por_moneda.USD.ingreso, 100);
    assert.equal(report.soporte.horas_resolucion_media, 4);
    assert.equal(report.soporte.abiertos, 1);
    assert.equal(report.tasa_cierre_sobre_cerradas, 2/3*100);
});
test('Rechaza duplicados, importes inválidos y resolución anterior a la apertura', () => {
    assert.throws(() => summarize({oportunidades:[{id:'a',estado:'nueva'},{id:'a',estado:'nueva'}],tickets:[]}), /único/);
    assert.throws(() => summarize({oportunidades:[{id:'a',estado:'ganada',moneda:'PEN',ingreso:-1,costo:0}],tickets:[]}), /no negativos/);
    assert.throws(() => summarize({oportunidades:[],tickets:[{id:'a',creado:'2026-11-02',resuelto:'2026-11-01'}]}), /posterior/);
});
