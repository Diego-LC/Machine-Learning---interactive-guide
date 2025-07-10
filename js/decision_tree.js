// decision_tree.js - Diagrama interactivo y ejemplo práctico de Árbol de Decisión

document.addEventListener('DOMContentLoaded', () => {
    renderSimpleDecisionTreeDiagram();
    renderFruitClassifierExample();
});

// Diagrama interactivo: "¿Fruta comestible?" (sí/no)
function renderSimpleDecisionTreeDiagram(selectedPath = []) {
    const container = document.getElementById('diagrama-arbol');
    container.innerHTML = `
        <div class="diagram">
            <h4 style="margin-bottom:1.2em;">Diagrama Interactivo: <span style="color:#38e4ae">¿Fruta comestible?</span></h4>
            <div style="display:flex;justify-content:center;align-items:center;gap:2em;flex-wrap:wrap;">
                <div id="tree-viz"></div>
                <form id="fruit-form" class="form-fruta">
                    <div class="grupo-opciones">
                        <label class="label-grupo">Color fruta:</label>
                        <div class="opciones-color">
                            <input type="radio" name="fruit-color" id="color-verde" value="verde" checked>
                            <label for="color-verde" class="color-cuadro verde"></label>
                            <input type="radio" name="fruit-color" id="color-rojo" value="rojo">
                            <label for="color-rojo" class="color-cuadro rojo"></label>
                            <input type="radio" name="fruit-color" id="color-amarillo" value="amarillo">
                            <label for="color-amarillo" class="color-cuadro amarillo"></label>
                        </div>
                    </div>
                    <div class="grupo-opciones">
                        <label class="label-grupo">Tamaño:</label>
                        <div class="opciones-tamano">
                            <input type="radio" name="fruit-size" id="tamano-grande" value="grande" checked>
                            <label for="tamano-grande" class="tamano-cuadro grande">Grande</label>
                            <input type="radio" name="fruit-size" id="tamano-pequeno" value="pequeño">
                            <label for="tamano-pequeno" class="tamano-cuadro pequeno">Pequeño</label>
                        </div>
                    </div>
                    <button type="submit">Clasificar</button>
                    <div id="resultado-fruta">
                        <b>Resultado:</b>
                    </div>
                </form>
            </div>
        </div>
    `;
    const width = 700, height = 320;
    const svg = d3.select('#tree-viz').append('svg')
        .attr('width', width)
        .attr('height', height);
    // Árbol fijo: ¿Color? -> ¿Tamaño? -> Hoja
    const treeData = {
        name: '¿Color verde?',
        id: 'root',
        children: [
            {
                name: 'Sí', id: 'si-color',
                children: [
                    { name: 'Comestible', tipo: 'comestible', id: 'comestible1' }
                ]
            },
            {
                name: 'No', id: 'no-color',
                children: [
                    {
                        name: '¿Tamaño grande?', id: 'tamano',
                        children: [
                            { name: 'Sí', id: 'si-tamano', children: [{ name: 'No comestible', tipo: 'nocome', id: 'nocome' }] },
                            { name: 'No', id: 'no-tamano', children: [{ name: 'Comestible', tipo: 'comestible', id: 'comestible2' }] }
                        ]
                    }
                ]
            }
        ]
    };
    const root = d3.hierarchy(treeData);
    // Árbol horizontal
    const treeLayout = d3.tree().size([height - 40, width - 180]);
    treeLayout(root);
    // Links
    svg.selectAll('path.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d => `M${d.source.y+90},${d.source.x+20} C${d.source.y+140},${d.source.x+20} ${d.target.y+40},${d.target.x+20} ${d.target.y+90},${d.target.x+20}`)
        .attr('stroke', d => {
            // Resalta si está en el camino seleccionado
            if (selectedPath.length > 0 && isLinkInPath(d, selectedPath)) return '#ffb300';
            return '#4f8cff';
        })
        .attr('stroke-width', d => (selectedPath.length > 0 && isLinkInPath(d, selectedPath)) ? 4 : 2)
        .attr('fill', 'none');
    // Nodes
    svg.selectAll('circle')
        .data(root.descendants())
        .enter()
        .append('circle')
        .attr('cx', d => d.y + 90)
        .attr('cy', d => d.x + 20)
        .attr('r', 52)
        .attr('fill', d => {
            if (!d.children && d.data.tipo === 'comestible') return '#b2ffb2';
            if (!d.children && d.data.tipo === 'nocome') return '#ffd6d6';
            return '#38e4ae';
        })
        .attr('stroke', d => (selectedPath.length > 0 && selectedPath.includes(d.data.id)) ? '#ffb300' : '#4f8cff')
        .attr('stroke-width', d => (selectedPath.length > 0 && selectedPath.includes(d.data.id)) ? 5 : 3);
    // Labels
    svg.selectAll('foreignObject')
        .data(root.descendants())
        .enter()
        .append('foreignObject')
        .attr('x', d => d.y + 90 - 50)
        .attr('y', d => d.x + 20 - 30)
        .attr('width', 100)
        .attr('height', 60)
        .append('xhtml:div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('height', '60px')
        .style('width', '100px')
        .style('text-align', 'center')
        .style('font-size', d => d.depth === 0 ? '1.13em' : '1.05em')
        .style('font-weight', d => d.depth === 0 ? 'bold' : 'normal')
        .style('color', d => {
            if (!d.children && d.data.tipo === 'comestible') return '#1a4d1a';
            if (!d.children && d.data.tipo === 'nocome') return '#a80000';
            return '#fff';
        })
        .text(d => d.data.name);
    // Etiquetas de ramas (Sí/No)
    svg.selectAll('branch-label')
        .data(root.links())
        .enter()
        .append('text')
        .attr('x', d => (d.source.y + d.target.y) / 2 + 90)
        .attr('y', d => (d.source.x + d.target.x) / 2 + 20 - 18)
        .attr('text-anchor', 'middle')
        .attr('font-size', '1em')
        .attr('fill', '#4f8cff')
        .attr('font-weight', 'bold')
        .text(d => d.target.data.name === 'Sí' || d.target.data.name === 'No' ? d.target.data.name : '');

    // Formulario de clasificación
    document.getElementById('fruit-form').onsubmit = (e) => {
        e.preventDefault();
        const color = document.querySelector('input[name="fruit-color"]:checked').value;
        const size = document.querySelector('input[name="fruit-size"]:checked').value;
        let res, path = ['root'];
        let colorRes = '';
        if (color === 'verde') {
            path.push('si-color', 'comestible1');
            res = 'Comestible';
            colorRes = 'style="color:#1a4d1a;background:#b2ffb2;padding:0.1em 0.5em;border-radius:5px;"';
        } else if (size === 'grande') {
            path.push('no-color', 'tamano', 'si-tamano', 'nocome');
            res = 'No comestible';
            colorRes = 'style="color:#a80000;background:#ffd6d6;padding:0.1em 0.5em;border-radius:5px;"';
        } else {
            path.push('no-color', 'tamano', 'no-tamano', 'comestible2');
            res = 'Comestible';
            colorRes = 'style="color:#1a4d1a;background:#b2ffb2;padding:0.1em 0.5em;border-radius:5px;"';
        }
        document.getElementById('resultado-fruta').innerHTML = `<b>Resultado:</b> <span ${colorRes}>${res}</span>`;
        // Redibujar resaltando el camino
        renderSimpleDecisionTreeDiagram(path);
        // Mantener selección en el formulario
        document.querySelector(`input[name='fruit-color'][value='${color}']`).checked = true;
        document.querySelector(`input[name='fruit-size'][value='${size}']`).checked = true;
    };

    // Si hay resultado previo, mostrarlo
    if (selectedPath.length > 0) {
        let res = selectedPath.includes('nocome') ? 'No comestible' : 'Comestible';
        let colorRes = selectedPath.includes('nocome')
            ? 'style="color:#a80000;background:#ffd6d6;padding:0.1em 0.5em;border-radius:5px;"'
            : 'style="color:#1a4d1a;background:#b2ffb2;padding:0.1em 0.5em;border-radius:5px;"';
        document.getElementById('resultado-fruta').innerHTML = `<b>Resultado:</b> <span ${colorRes}>${res}</span>`;
    }

    // Función para saber si un enlace está en el camino seleccionado
    function isLinkInPath(link, pathArr) {
        return pathArr.includes(link.source.data.id) && pathArr.includes(link.target.data.id);
    }
}

function renderFruitClassifierExample() {
    const div = document.getElementById('ejemplo-arbol');
    div.innerHTML = `
        <div class="card-ejemplo" style="background:#f7f9fb;border-radius:14px;padding:1.5em 1.5em 1em 1.5em;box-shadow:0 2px 12px rgba(79,140,255,0.07);margin-top:2.2em;">
            <span style="font-size:1em;color:#4f8cff;font-weight:600;">Fragmento del código del árbol de decisión:</span>
            <div style="background:#eaf1fb;border-radius:8px;padding:0.7em 1em 0.7em 1em;margin-top:0.5em;overflow-x:auto;">
                <pre style="margin:0;"><code id="codigo-arbol" style="font-size:1em;">// Árbol de decisión simple para frutas\nfunction esComestible(color, tamaño) {\n    if (color === 'verde') return 'Comestible';\n    else if (tamaño === 'grande') return 'No comestible';\n    else return 'Comestible';\n}</code></pre>
            </div>
            <button id="btn-explicacion-codigo" style="margin-top:1em;background:#4f8cff;color:#fff;border:none;padding:0.5em 1.2em;border-radius:7px;font-weight:600;cursor:pointer;">Ver explicación</button>
            <div id="explicacion-codigo" class="explicacion-colapsable">
                <b>¿Cómo funciona el código?</b><br>
                La función <code>esComestible(color, tamaño)</code> simula un árbol de decisión sencillo:
                <ul style="margin-top:0.5em;">
                    <li>Si el color es <b>verde</b>, la fruta siempre es considerada <span style='color:#1a4d1a;background:#b2ffb2;padding:0.1em 0.4em;border-radius:4px;'>comestible</span>.</li>
                    <li>Si el color no es verde y el tamaño es <b>grande</b>, la fruta es <span style='color:#a80000;background:#ffd6d6;padding:0.1em 0.4em;border-radius:4px;'>no comestible</span>.</li>
                    <li>En cualquier otro caso, la fruta es <span style='color:#1a4d1a;background:#b2ffb2;padding:0.1em 0.4em;border-radius:4px;'>comestible</span>.</li>
                </ul>
                <span style="font-size:0.98em;color:#888;">Este ejemplo muestra cómo un árbol de decisión toma decisiones simples a partir de preguntas sobre los atributos de un objeto.</span>
            </div>
        </div>
    `;
    // Mostrar/ocultar explicación con animación
    const btn = document.getElementById('btn-explicacion-codigo');
    const exp = document.getElementById('explicacion-codigo');
    btn.onclick = () => {
        exp.classList.toggle('explicacion-visible');
        if (exp.classList.contains('explicacion-visible')) {
            btn.textContent = 'Ocultar explicación';
        } else {
            btn.textContent = 'Ver explicación';
        }
    };
}
