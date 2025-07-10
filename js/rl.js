// rl.js - Visualización interactiva y ejemplo de Reinforcement Learning

document.addEventListener('DOMContentLoaded', () => {
    renderRLVisualization();
    renderRLExample();
});

// Visualización: Laberinto simple RL
function renderRLVisualization() {
    const div = document.getElementById('visualizacion-rl');
    div.innerHTML = `
        <h4>Visualización Interactiva: Laberinto RL</h4>
        <div id="maze-controls">
            <label>Tamaño del laberinto: <span id="maze-size-label">4</span></label>
            <input type="range" id="maze-size" min="3" max="7" value="4">
            <label>Tasa de aprendizaje: <span id="alpha-label">0.5</span></label>
            <input type="range" id="alpha" min="0.1" max="1" step="0.1" value="0.5">
            <button id="start-rl">Iniciar Aprendizaje</button>
        </div>
        <canvas id="maze-canvas" width="320" height="320" style="background:#fff;border:1px solid #4f8cff;margin-top:1em;"></canvas>
        <div id="rl-status"></div>
    `;
    let size = 4, alpha = 0.5;
    document.getElementById('maze-size').oninput = e => {
        size = +e.target.value;
        document.getElementById('maze-size-label').textContent = size;
        drawMaze(size);
    };
    document.getElementById('alpha').oninput = e => {
        alpha = +e.target.value;
        document.getElementById('alpha-label').textContent = alpha;
    };
    drawMaze(size);
    document.getElementById('start-rl').onclick = () => runRL(size, alpha);
}

function drawMaze(size) {
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
    // Dibuja el objetivo
    ctx.fillStyle = '#38e4ae';
    ctx.fillRect((size-1)*cell+2, (size-1)*cell+2, cell-4, cell-4);
    // Dibuja el agente
    ctx.fillStyle = '#4f8cff';
    ctx.beginPath();
    ctx.arc(cell/2, cell/2, cell/3, 0, 2*Math.PI);
    ctx.fill();
}

// Algoritmo Q-learning simplificado para el laberinto
document.rlQTable = {};
function runRL(size, alpha) {
    const canvas = document.getElementById('maze-canvas');
    const ctx = canvas.getContext('2d');
    const cell = canvas.width / size;
    let agent = {x:0, y:0};
    const goal = {x:size-1, y:size-1};
    let q = {};
    let steps = 0, episodes = 0;
    let running = true;
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
        if (action===0 && y>0) y--; // arriba
        if (action===1 && x<size-1) x++;// derecha
        if (action===2 && y<size-1) y++;// abajo
        if (action===3 && x>0) x--;// izquierda
        return {x, y};
    }
    function drawAgent() {
        drawMaze(size);
        ctx.fillStyle = '#ffb300';
        ctx.beginPath();
        ctx.arc(agent.x*cell+cell/2, agent.y*cell+cell/2, cell/3, 0, 2*Math.PI);
        ctx.fill();
    }
    function episode() {
        agent = {x:0, y:0};
        steps = 0;
        let interval = setInterval(()=>{
            if (!running) return clearInterval(interval);
            let s = stateKey(agent.x, agent.y);
            q[s] = q[s] || [0,0,0,0];
            let action = Math.random()<0.2 ? randomAction() : bestAction(agent.x, agent.y);
            let next = step(action);
            let reward = (next.x===goal.x && next.y===goal.y) ? 1 : -0.01;
            let ns = stateKey(next.x, next.y);
            q[ns] = q[ns] || [0,0,0,0];
            q[s][action] += alpha * (reward + 0.9*Math.max(...q[ns]) - q[s][action]);
            agent = next;
            steps++;
            drawAgent();
            if (agent.x===goal.x && agent.y===goal.y) {
                episodes++;
                document.getElementById('rl-status').innerHTML = `Episodio: ${episodes}, Pasos: ${steps}`;
                if (episodes<20) setTimeout(episode, 400);
                else running = false;
                clearInterval(interval);
            }
        }, 200);
    }
    q = {};
    episodes = 0;
    running = true;
    episode();
}

// Fragmento de código RL
function renderRLExample() {
    const div = document.getElementById('ejemplo-rl');
    div.innerHTML = `
        <h4>Fragmento de Código: Q-learning</h4>
        <pre><code id="codigo-rl">
// Q-learning para un laberinto simple
for (episodio = 0; episodio < 20; episodio++) {
    estado = inicio;
    while (estado != objetivo) {
        acción = elegirAcción(estado);
        recompensa, nuevoEstado = ejecutar(acción);
        Q[estado, acción] += α * (recompensa + γ * max(Q[nuevoEstado]) - Q[estado, acción]);
        estado = nuevoEstado;
    }
}
        </code></pre>
    `;
}
