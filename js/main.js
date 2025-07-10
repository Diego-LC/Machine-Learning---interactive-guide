// main.js - Lógica general e inicialización de la web educativa

document.addEventListener('DOMContentLoaded', () => {
    cargarTeoriaArboles();
    cargarTeoriaRL();
    cargarComparativa();
    cargarReferencias();
    // Tabs interactivas
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
});

function cargarTeoriaArboles() {
    const div = document.getElementById('teoria-arboles');
    div.innerHTML = `
        <div class="card-teoria">
            <h3>¿Qué es un Árbol de Decisión?</h3>
            <p>Un <b>árbol de decisión</b> es un modelo predictivo que utiliza una estructura de árbol para tomar decisiones. Sus componentes principales son:</p>
            <div class="conceptos-arbol">
                <div class="concepto-tarjeta" style="--color:#38e4ae;">
                    <div class="icono-concepto"><svg width="32" height="32"><circle cx="16" cy="16" r="13" fill="#38e4ae" stroke="#4f8cff" stroke-width="3"/></svg></div>
                    <div class="titulo-concepto">Nodo</div>
                    <div class="desc-concepto">Punto donde se evalúa una <b>pregunta</b> o atributo.</div>
                </div>
                <div class="concepto-tarjeta" style="--color:#4f8cff;">
                    <div class="icono-concepto"><svg width="32" height="32"><path d="M4 16 L28 16" stroke="#4f8cff" stroke-width="4"/><polygon points="28,16 22,12 22,20" fill="#4f8cff"/></svg></div>
                    <div class="titulo-concepto">Rama</div>
                    <div class="desc-concepto">Camino que conecta nodos y representa una posible decisión (<b>Sí</b> o <b>No</b>).</div>
                </div>
                <div class="concepto-tarjeta" style="--color:#ffb300;">
                    <div class="icono-concepto"><svg width="32" height="32"><circle cx="16" cy="16" r="13" fill="#fff" stroke="#ffb300" stroke-width="3"/><text x="16" y="22" text-anchor="middle" font-size="18" fill="#ffb300">?</text></svg></div>
                    <div class="titulo-concepto">Decisión</div>
                    <div class="desc-concepto">Resultado de la evaluación en un nodo, que determina la siguiente rama a seguir.</div>
                </div>
                <div class="concepto-tarjeta" style="--color:#b2ffb2;">
                    <div class="icono-concepto"><svg width="32" height="32"><rect x="6" y="6" width="20" height="20" rx="7" fill="#b2ffb2" stroke="#1a4d1a" stroke-width="3"/></svg></div>
                    <div class="titulo-concepto">Hoja</div>
                    <div class="desc-concepto">Nodo final que da la <b>predicción</b> o clasificación (<span style="background:#b2ffb2;color:#1a4d1a;padding:0.1em 0.4em;border-radius:4px;">Comestible</span> o <span style="background:#ffd6d6;color:#a80000;padding:0.1em 0.4em;border-radius:4px;">No comestible</span>).</div>
                </div>
            </div>
        </div>
    `;
}

function cargarTeoriaRL() {
    const div = document.getElementById('teoria-rl');
    div.innerHTML = `
        <div class="card-teoria">
            <h3>¿Qué es el Reinforcement Learning?</h3>
            <p>El <b>Aprendizaje por Refuerzo</b> es una técnica donde un <b>agente</b> aprende a tomar decisiones mediante la interacción con un <b>entorno</b>, recibiendo <b>recompensas</b> o penalizaciones según sus acciones. Los conceptos clave son:</p>
            <ul>
                <li><b>Agente:</b> El que toma decisiones y aprende.</li>
                <li><b>Entorno:</b> El mundo con el que interactúa el agente.</li>
                <li><b>Recompensa:</b> Retroalimentación que indica el éxito de una acción.</li>
                <li><b>Política:</b> Estrategia que sigue el agente para decidir sus acciones.</li>
            </ul>
        </div>
    `;
}

function cargarComparativa() {
    const div = document.getElementById('comparativa');
    div.innerHTML = `
        <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#eaf1fb;"><th></th><th>Árboles de Decisión</th><th>Reinforcement Learning</th></tr>
            <tr><td><b>Ventajas</b></td><td>Fácil de interpretar, rápido para clasificación, útil con datos tabulares.</td><td>Aprende de la experiencia, útil en entornos dinámicos, adapta estrategias.</td></tr>
            <tr><td><b>Limitaciones</b></td><td>Puede sobreajustar, no maneja bien relaciones complejas.</td><td>Requiere mucho tiempo de entrenamiento, puede ser inestable.</td></tr>
            <tr><td><b>Aplicaciones</b></td><td>Diagnóstico médico, crédito, segmentación de clientes.</td><td>Robótica, juegos, optimización de procesos.</td></tr>
        </table>
        <p style="margin-top:1em;"><b>Recomendación:</b> Los árboles de decisión son ideales para introducirse en ML y problemas de clasificación simples. El RL es excelente para explorar la toma de decisiones en entornos cambiantes y experimentales.</p>
    `;
}

function cargarReferencias() {
    const ul = document.getElementById('lista-referencias');
    ul.innerHTML = `
        <li><a href="https://es.wikipedia.org/wiki/%C3%81rbol_de_decisi%C3%B3n" target="_blank">Árbol de decisión - Wikipedia</a></li>
        <li><a href="https://es.wikipedia.org/wiki/Aprendizaje_por_refuerzo" target="_blank">Aprendizaje por refuerzo - Wikipedia</a></li>
        <li><a href="https://scikit-learn.org/stable/modules/tree.html" target="_blank">Scikit-learn: Árboles de Decisión</a></li>
        <li><a href="https://spinningup.openai.com/es/latest/" target="_blank">OpenAI Spinning Up: RL</a></li>
        <li><a href="https://www.youtube.com/watch?v=Ev8YbxPu_bQ" target="_blank">Video: Decision Trees & RL (StatQuest)</a></li>
    `;
}
