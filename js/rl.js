// rl.js - Visualización interactiva y ejemplo de Reinforcement Learning

document.addEventListener('DOMContentLoaded', () => {
    renderRLVisualization();
    renderRLExample();
});

// Visualización: Laberinto simple RL
function renderRLVisualization() {
    const div = document.getElementById('visualizacion-rl');
    div.innerHTML = `
        <h4 style="margin-bottom:1.2em;">Visualización Interactiva: <span style="color:#4f8cff">Laberinto RL</span></h4>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div style="display:flex;justify-content:center;align-items:center;width:100%;">
                <canvas id="maze-canvas" width="320" height="320" style="background:#fffbe7;border:2.5px solid #4f8cff;border-radius:16px;box-shadow:0 2px 12px rgba(79,140,255,0.07);margin-top:1em;"></canvas>
            </div>
            <div id="rl-status-cards" style="display:flex;gap:1.2em;justify-content:center;margin-top:1.2em;"></div>
            <div style="display:flex;flex-direction:row;gap:2.5em;justify-content:center;align-items:flex-start;width:100%;margin-top:2em;">
                <div class="rl-controls-group" style="background:#f7f9fb;border-radius:16px;padding:1.2em 1.5em;box-shadow:0 2px 12px rgba(79,140,255,0.07);display:flex;flex-direction:column;gap:1.2em;align-items:center;min-width:600px;max-width:700px;">
                    <button id="start-rl" style="background:linear-gradient(90deg,#4f8cff 60%,#38e4ae 100%);color:#fff;border:none;padding:0.6em 1.5em;border-radius:9px;font-weight:700;font-size:1.08em;box-shadow:0 2px 8px rgba(79,140,255,0.09);margin-top:0.5em;letter-spacing:0.01em;transition:background 0.18s,box-shadow 0.18s,transform 0.18s;">Iniciar Aprendizaje</button>
                    <div style="display:flex;flex-direction:row;gap:2.2em;justify-content:center;width:100%;">
                        <div style="display:flex;flex-direction:column;align-items:center;min-width:140px;">
                            <label style="font-weight:600;color:#4f8cff;">Tamaño del laberinto <span id="maze-size-label">4</span></label>
                            <input type="range" id="maze-size" min="3" max="7" value="4">
                        </div>
                        <div style="display:flex;flex-direction:column;align-items:center;min-width:140px;">
                            <label style="font-weight:600;color:#ffb300;">Tasa de aprendizaje <span id="alpha-label">0.5</span></label>
                            <input type="range" id="alpha" min="0.1" max="1" step="0.1" value="0.5">
                        </div>
                    </div>
                    <div style="display:flex;flex-direction:row;gap:2.2em;justify-content:center;width:100%;">
                        <div style="display:flex;flex-direction:column;align-items:center;min-width:140px;">
                            <label style="font-weight:600;color:#38e4ae;">Cantidad de episodios <span id="episodes-label">20</span></label>
                            <input type="range" id="episodes" min="5" max="50" step="1" value="20">
                        </div>
                        <div style="display:flex;flex-direction:column;align-items:center;min-width:140px;">
                            <label style="font-weight:600;color:#1a4d1a;">Velocidad <span id="speed-label">200</span> ms</label>
                            <input type="range" id="speed" min="50" max="800" step="10" value="200">
                        </div>
                        <div style="display:flex;flex-direction:column;align-items:center;min-width:140px;">
                            <label style="font-weight:600;color:#b30038;">Obstáculos <span id="obstacles-label">0</span></label>
                            <select id="obstacles" style="padding:0.3em 0.7em;border-radius:7px;border:1.5px solid #b30038;font-size:1em;">
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                    </div>
                    
                </div>
                <div id="rl-graph" style="width:100%;max-width:400px;height:253px;background:#fffbe7;border-radius:12px;box-shadow:0 2px 8px rgba(56,228,174,0.07);border:1.5px solid #38e4ae;display:flex;align-items:center;justify-content:center;"></div>
            </div>
        </div>
    `;
    let size = 4, alpha = 0.5, episodes = 20, speed = 200, obstacles = 0;
    document.getElementById('maze-size').oninput = e => {
        size = +e.target.value;
        document.getElementById('maze-size-label').textContent = size;
        drawMaze(size, obstacles);
    };
    document.getElementById('alpha').oninput = e => {
        alpha = +e.target.value;
        document.getElementById('alpha-label').textContent = alpha;
    };
    document.getElementById('episodes').oninput = e => {
        episodes = +e.target.value;
        document.getElementById('episodes-label').textContent = episodes;
    };
    document.getElementById('speed').oninput = e => {
        speed = +e.target.value;
        document.getElementById('speed-label').textContent = speed;
    };
    document.getElementById('obstacles').oninput = e => {
        obstacles = +e.target.value;
        document.getElementById('obstacles-label').textContent = obstacles;
        drawMaze(size, obstacles);
    };
    drawMaze(size, obstacles, null, true); // Dibuja agente fijo en visualización
    const startBtn = document.getElementById('start-rl');
    let rlRunning = false;
    let rlStopFn = null;
    // Mostrar gráfico vacío con ejes y título por defecto
    renderRLGraph([], episodes);
    // Mostrar cuadros de información siempre, con valores iniciales
    document.getElementById('rl-status-cards').innerHTML = `
        <div class='rl-card rl-card-ep'><span>Episodio</span><b>0</b></div>
        <div class='rl-card rl-card-steps'><span>Pasos</span><b>0</b></div>
        <div class='rl-card rl-card-reward'><span>Recompensa</span><b>0.00</b></div>
    `;
    startBtn.onclick = () => {
        if (!rlRunning) {
            rlRunning = true;
            startBtn.textContent = 'Detener';
            rlStopFn = runRL(size, alpha, episodes, speed, obstacles, () => {
                rlRunning = false;
                startBtn.textContent = 'Iniciar Aprendizaje';
            });
        } else {
            rlRunning = false;
            startBtn.textContent = 'Iniciar Aprendizaje';
            if (typeof rlStopFn === 'function') rlStopFn();
            // Restablecer visualización y estado
            renderRLGraph([], episodes);
            document.getElementById('rl-status-cards').innerHTML = `
                <div class='rl-card rl-card-ep'><span>Episodio</span><b>0</b></div>
                <div class='rl-card rl-card-steps'><span>Pasos</span><b>0</b></div>
                <div class='rl-card rl-card-reward'><span>Recompensa</span><b>0.00</b></div>
            `;
            drawMaze(size, obstacles, null, true);
        }
    };
}

function drawMaze(size, obstacles = 0, obstaclesPos = null) {
    const canvas = document.getElementById('maze-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cell = canvas.width / size;
    // Dibuja la cuadrícula
    ctx.strokeStyle = '#4f8cff';
    for (let i = 0; i <= size; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell, 0);
        ctx.lineTo(i * cell, canvas.height);
        ctx.moveTo(0, i * cell);
        ctx.lineTo(canvas.width, i * cell);
        ctx.stroke();
    }
    // Obstáculos
    let obsArr = obstaclesPos;
    if (!obsArr) {
        obsArr = [];
        if (obstacles > 0) {
            // Genera posiciones fijas para obstáculos, evitando inicio y meta
            let candidates = [];
            for (let x = 0; x < size; x++) {
                for (let y = 0; y < size; y++) {
                    if ((x !== 0 || y !== 0) && (x !== size-1 || y !== size-1)) {
                        candidates.push({x, y});
                    }
                }
            }
            // Selecciona obstáculos en posiciones separadas
            for (let i = 0; i < obstacles; i++) {
                let idx = Math.floor((candidates.length/(obstacles+1))*(i+1));
                obsArr.push(candidates[idx % candidates.length]);
            }
        }
    }
    ctx.fillStyle = '#b30038';
    obsArr.forEach(o => {
        ctx.fillRect(o.x*cell+4, o.y*cell+4, cell-8, cell-8);
        ctx.font = `${Math.floor(cell/2)}px Arial`;
        ctx.fillText('🧱', o.x*cell+cell/4, o.y*cell+cell/1.5);
    });
    // Dibuja el objetivo
    ctx.fillStyle = '#38e4ae';
    ctx.fillRect((size-1)*cell+2, (size-1)*cell+2, cell-4, cell-4);
    ctx.font = `${Math.floor(cell/2)}px Arial`;
    ctx.fillText('🎯', (size-1)*cell+cell/4, (size-1)*cell+cell/1.5);
    // Dibuja el agente solo si se solicita (por defecto sí)
    let drawAgentFixed = true;
    if (arguments.length > 3 && arguments[3] === false) drawAgentFixed = false;
    if (drawAgentFixed) {
        ctx.fillStyle = '#4f8cff';
        ctx.beginPath();
        ctx.arc(cell/2, cell/2, cell/3, 0, 2*Math.PI);
        ctx.fill();
        ctx.font = `${Math.floor(cell/2)}px Arial`;
        ctx.fillText('🤖', cell/4, cell/1.5);
    }
    return obsArr;
}

// Algoritmo Q-learning simplificado para el laberinto
function runRL(size, alpha, episodes, speed, obstacles=0, onFinish) {
    const canvas = document.getElementById('maze-canvas');
    const ctx = canvas.getContext('2d');
    const cell = canvas.width / size;
    let agent = {x:0, y:0};
    const goal = {x:size-1, y:size-1};
    // Obstáculos
    // Genera obstáculos y los guarda en window.rlObstacles para acceso global
    let obstaclesArr = drawMaze(size, obstacles, null, false); // No dibuja agente fijo durante aprendizaje
    window.rlObstacles = obstaclesArr;
    // Para lógica, crea un set de posiciones bloqueadas
    let blocked = new Set(obstaclesArr.map(o => o.x+','+o.y));
    let q = {};
    let running = true;
    let interval = null;
    let stepsHistory = [];
    function stateKey(x, y) { return x+','+y; }
    function bestAction(x, y) {
        const actions = q[stateKey(x,y)] || [0,0,0,0];
        let max = Math.max(...actions);
        let idxs = actions.map((v,i)=>v===max?i:null).filter(v=>v!==null);
        return idxs[Math.floor(Math.random()*idxs.length)];
    }
    function randomAction() { return Math.floor(Math.random()*4); }
    function step(action) {
        let {x, y} = agent;
        let nx = x, ny = y;
        if (action===0 && y>0) ny--; // arriba
        if (action===1 && x<size-1) nx++;// derecha
        if (action===2 && y<size-1) ny++;// abajo
        if (action===3 && x>0) nx--;// izquierda
        // Si la nueva posición es obstáculo, no se mueve
        if (blocked.has(nx+','+ny)) return {x, y};
        return {x: nx, y: ny};
    }
    function drawAgent() {
        // Dibuja el laberinto SIN agente fijo
        drawMaze(size, obstacles, obstaclesArr, false); // No dibuja agente fijo
        // Dibuja solo el agente en la posición actual
        ctx.font = `${Math.floor(cell/2)}px Arial`;
        ctx.fillText('🤖', agent.x*cell+cell/4, agent.y*cell+cell/1.5);
    }
    function updateStatusCards() {
        document.getElementById('rl-status-cards').innerHTML = `
            <div class='rl-card rl-card-ep'><span>Episodio</span><b>${ep}</b></div>
            <div class='rl-card rl-card-steps'><span>Pasos</span><b>${steps}</b></div>
            <div class='rl-card rl-card-reward'><span>Recompensa</span><b>${reward.toFixed(2)}</b></div>
        `;
    }
    function episode() {
        agent = {x:0, y:0};
        steps = 0;
        reward = 0;
        if (interval) clearInterval(interval); // Asegura que no haya intervalos previos
        interval = setInterval(()=>{
            if (!running) {
                clearInterval(interval);
                return;
            }
            let s = stateKey(agent.x, agent.y);
            q[s] = q[s] || [0,0,0,0];
            let action = Math.random()<0.2 ? randomAction() : bestAction(agent.x, agent.y);
            let next = step(action);
            let r = (next.x===goal.x && next.y===goal.y) ? 1 : (blocked.has(next.x+','+next.y)?-1:-0.01);
            reward += r;
            let ns = stateKey(next.x, next.y);
            q[ns] = q[ns] || [0,0,0,0];
            q[s][action] += alpha * (r + 0.9*Math.max(...q[ns]) - q[s][action]);
            agent = next;
            steps++;
            drawAgent();
            updateStatusCards();
            if (agent.x===goal.x && agent.y===goal.y) {
                stepsHistory.push(steps);
                ep++;
                renderRLGraph(stepsHistory, episodes);
                clearInterval(interval); // Detiene el intervalo actual antes de iniciar el siguiente episodio
                if (ep<episodes && running) {
                    setTimeout(episode, speed);
                } else {
                    running = false;
                    if (typeof onFinish === 'function') onFinish();
                }
            }
        }, speed);
    }
    q = {};
    ep = 0;
    running = true;
    stepsHistory = [];
    // Permite detener el aprendizaje desde fuera
    episode();
    // Permite detener el aprendizaje desde fuera
    return function stopRL() {
        running = false;
        if (interval) clearInterval(interval);
        if (typeof onFinish === 'function') onFinish();
    };
}

// Gráfico de aprendizaje RL (debe estar en el ámbito global)
function renderRLGraph(stepsHistory, totalEpisodes) {
    const graphDiv = document.getElementById('rl-graph');
    graphDiv.innerHTML = '';
    if (!stepsHistory || stepsHistory.length === 0) {
        // Mostrar gráfico vacío con ejes y título
        const w = 380, h = 160, pad = 28;
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('width', w);
        svg.setAttribute('height', h);
        svg.innerHTML += `<text x='${w/2}' y='${pad-10}' text-anchor='middle' font-size='1.15em' font-weight='bold' fill='#4f8cff'>Gráfico de Aprendizaje del Agente RL</text>`;
        svg.innerHTML += `<line x1='${pad}' y1='${h-pad}' x2='${w-pad}' y2='${h-pad}' stroke='#38e4ae' stroke-width='2'/>`;
        svg.innerHTML += `<line x1='${pad}' y1='${h-pad}' x2='${pad}' y2='${pad}' stroke='#38e4ae' stroke-width='2'/>`;
        svg.innerHTML += `<text x='${w/2}' y='${h-4}' text-anchor='middle' font-size='1em' fill='#4f8cff'>Episodios</text>`;
        svg.innerHTML += `<text x='8' y='${pad+2}' font-size='1em' fill='#ffb300' transform='rotate(-90 8,${pad+2})'>Pasos</text>`;
        svg.innerHTML += `<rect x='${w-pad-110}' y='${pad+2}' width='16' height='4' fill='#4f8cff'/><text x='${w-pad-90}' y='${pad+8}' font-size='0.95em' fill='#4f8cff'>Línea de aprendizaje</text>`;
        svg.innerHTML += `<circle cx='${w-pad-102}' cy='${pad+22}' r='3.5' fill='#ffb300' stroke='#4f8cff' stroke-width='1.5'/><text x='${w-pad-90}' y='${pad+26}' font-size='0.95em' fill='#ffb300'>Episodio</text>`;
        graphDiv.appendChild(svg);
        return;
    }
    const w = 380, h = 160, pad = 28;
    const maxSteps = Math.max(...stepsHistory);
    const minSteps = Math.min(...stepsHistory);
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    // Título
    svg.innerHTML += `<text x='${w/2}' y='${pad-10}' text-anchor='middle' font-size='1.15em' font-weight='bold' fill='#4f8cff'>Gráfico de Aprendizaje del Agente RL</text>`;
    // Ejes
    svg.innerHTML += `<line x1='${pad}' y1='${h-pad}' x2='${w-pad}' y2='${h-pad}' stroke='#38e4ae' stroke-width='2'/>`;
    svg.innerHTML += `<line x1='${pad}' y1='${h-pad}' x2='${pad}' y2='${pad}' stroke='#38e4ae' stroke-width='2'/>`;
    // Etiquetas de ejes
    svg.innerHTML += `<text x='${w/2}' y='${h-4}' text-anchor='middle' font-size='1em' fill='#4f8cff'>Episodios</text>`;
    svg.innerHTML += `<text x='8' y='${pad+2}' font-size='1em' fill='#ffb300' transform='rotate(-90 8,${pad+2})'>Pasos</text>`;
    // Leyenda
    svg.innerHTML += `<rect x='${w-pad-110}' y='${pad+2}' width='16' height='4' fill='#4f8cff'/><text x='${w-pad-90}' y='${pad+8}' font-size='0.95em' fill='#4f8cff'>Línea de aprendizaje</text>`;
    svg.innerHTML += `<circle cx='${w-pad-102}' cy='${pad+22}' r='3.5' fill='#ffb300' stroke='#4f8cff' stroke-width='1.5'/><text x='${w-pad-90}' y='${pad+26}' font-size='0.95em' fill='#ffb300'>Episodio</text>`;
    // Línea de aprendizaje
    let points = stepsHistory.map((s,i) => {
        const x = pad + ((w-pad*2)*(i/(totalEpisodes-1)));
        const y = h-pad - ((h-pad*2)*((s-minSteps)/(maxSteps-minSteps||1)));
        return `${x},${y}`;
    }).join(' ');
    svg.innerHTML += `<polyline points='${points}' fill='none' stroke='#4f8cff' stroke-width='3'/>`;
    // Puntos
    stepsHistory.forEach((s,i) => {
        const x = pad + ((w-pad*2)*(i/(totalEpisodes-1)));
        const y = h-pad - ((h-pad*2)*((s-minSteps)/(maxSteps-minSteps||1)));
        svg.innerHTML += `<circle cx='${x}' cy='${y}' r='3.5' fill='#ffb300' stroke='#4f8cff' stroke-width='1.5'/>`;
    });
    graphDiv.appendChild(svg);
}

// Fragmento de código RL
function renderRLExample() {
    const div = document.getElementById('ejemplo-rl');
    div.innerHTML = `
        <div class="card-ejemplo" style="background:#f7f9fb;border-radius:14px;padding:1.5em 1.5em 1em 1.5em;box-shadow:0 2px 12px rgba(79,140,255,0.07);margin-top:2.2em;">
            <span style="font-size:1em;color:#4f8cff;font-weight:600;">Fragmento de código Q-learning:</span>
            <div style="background:#eaf1fb;border-radius:8px;padding:0.7em 1em 0.7em 1em;margin-top:0.5em;overflow-x:auto;">
                <pre style="margin:0;"><code id="codigo-rl" style="font-size:1em;">// Q-learning para un laberinto simple\nfor (episodio = 0; episodio < 20; episodio++) {\n    estado = inicio;\n    while (estado != objetivo) {\n        acción = elegirAcción(estado);\n        recompensa, nuevoEstado = ejecutar(acción);\n        Q[estado, acción] += α * (recompensa + γ * max(Q[nuevoEstado]) - Q[estado, acción]);\n        estado = nuevoEstado;\n    }\n}</code></pre>
            </div>
            <button id="btn-explicacion-codigo-rl" style="margin-top:1em;background:#4f8cff;color:#fff;border:none;padding:0.5em 1.2em;border-radius:7px;font-weight:600;cursor:pointer;">Ver explicación</button>
            <div id="explicacion-codigo-rl" class="explicacion-colapsable">
                <b>¿Cómo funciona el código?</b><br>
                El algoritmo <code>Q-learning</code> permite que el agente aprenda a resolver el laberinto mediante prueba y error:<br>
                <ul style="margin-top:0.5em;">
                    <li>En cada <b>episodio</b>, el agente parte desde el inicio y busca llegar al objetivo.</li>
                    <li>En cada paso, elige una acción (moverse) y recibe una <b>recompensa</b> según si avanza o llega al objetivo.</li>
                    <li>La tabla <code>Q</code> se actualiza para mejorar las decisiones futuras, usando la tasa de aprendizaje <b>α</b> y el factor de descuento <b>γ</b>.</li>
                    <li>Con el tiempo, el agente aprende el camino más eficiente.</li>
                </ul>
                <span style="font-size:0.98em;color:#888;">Este ejemplo muestra cómo el agente mejora su desempeño a través de la experiencia y la retroalimentación.</span>
            </div>
        </div>
    `;
    // Mostrar/ocultar explicación con animación
    const btn = document.getElementById('btn-explicacion-codigo-rl');
    const exp = document.getElementById('explicacion-codigo-rl');
    btn.onclick = () => {
        exp.classList.toggle('explicacion-visible');
        if (exp.classList.contains('explicacion-visible')) {
            btn.textContent = 'Ocultar explicación';
        } else {
            btn.textContent = 'Ver explicación';
        }
    };
}
