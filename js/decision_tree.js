// decision_tree.js - Diagrama interactivo y ejemplo práctico de Árbol de Decisión

document.addEventListener('DOMContentLoaded', () => {
    renderSimpleDecisionTreeDiagram();
    renderFruitClassifierExample();
});

// Diagrama interactivo: "¿Fruta comestible?" (sí/no)
function renderSimpleDecisionTreeDiagram(selectedPath = []) {
    const container = document.getElementById('diagrama-arbol');
    container.innerHTML = `
        <h4 style="margin-bottom:1.2em;">Diagrama Interactivo: <span style="color:#38e4ae">¿Fruta comestible?</span></h4>
        <div style="display:flex;justify-content:center;align-items:center;gap:2em;flex-wrap:wrap;">
            <div id="tree-viz"></div>
            <form id="fruit-form" style="display:flex;flex-direction:column;gap:1.2em;align-items:flex-start;min-width:220px;background:#f7f9fb;border-radius:14px;padding:1.2em 1.5em;box-shadow:0 2px 12px rgba(79,140,255,0.07);">
                <label style="font-weight:600;">Color:
                    <select id="fruit-color" style="margin-left:0.5em;">
                        <option value="verde">Verde</option>
                        <option value="rojo">Rojo</option>
                        <option value="amarillo">Amarillo</option>
                    </select>
                </label>
                <label style="font-weight:600;">Tamaño:
                    <select id="fruit-size" style="margin-left:0.5em;">
                        <option value="grande">Grande</option>
                        <option value="pequeño">Pequeño</option>
                    </select>
                </label>
                <button type="submit" style="font-weight:600;">Clasificar</button>
                <div id="resultado-fruta" style="margin:0.7em 0 0 0;font-size:1.15em;font-weight:bold;"></div>
            </form>
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
        const color = document.getElementById('fruit-color').value;
        const size = document.getElementById('fruit-size').value;
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
        document.getElementById('fruit-color').value = color;
        document.getElementById('fruit-size').value = size;
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
        </div>
    `;
}
