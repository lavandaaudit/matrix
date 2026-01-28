/**
 * IBONARIUM · APP.JS
 * State management and data synchronization
 */

const IBONARIUM_STATE = {
    time: {
        pulse: 7.83,
        entropy: 0.04,
        acceleration: 1.0
    },
    cosmos: {
        solarFlux: 145,
        gravityNoise: 0.12,
        orbitalPhase: 0.45
    },
    geo: {
        magneticStress: 32,
        thermalGradient: 1.2,
        turbulence: 0.15
    },
    bio: {
        growthRate: 1.2,
        decayRate: 0.05,
        respiration: 0.85
    },
    social: {
        anxiety: 0.2,
        connectivity: 0.95,
        migration: 0.1
    },
    meta: {
        stabilityIndex: 0.92,
        harmony: 0.88,
        collapseRisk: 0.02
    }
};

class IbonariumLab {
    constructor() {
        this.viz = new MatrixViz('matrix-container');
        this.logElement = document.getElementById('terminal-log');
        this.harmonyElement = document.querySelector('#global-harmony .value');
        this.timeElement = document.getElementById('current-time');

        this.init();
    }

    init() {
        this.startDataSimulation();
        this.setupEventListeners();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        this.log("[SYS] Unified Matrix Core active.");
        this.log("[SYS] Monitoring inter-layer influences...");
    }

    log(message) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.logElement.appendChild(line);
        if (this.logElement.childNodes.length > 20) {
            this.logElement.removeChild(this.logElement.firstChild);
        }
        this.logElement.scrollTop = this.logElement.scrollHeight;
    }

    updateClock() {
        const now = new Date();
        this.timeElement.innerText = now.toLocaleTimeString();
    }

    startDataSimulation() {
        setInterval(() => {
            this.evolveState();
            this.updateUI();
            this.viz.update(IBONARIUM_STATE);
        }, 100);
    }

    evolveState() {
        // Simulating inter-layer influences
        // solarFlux ↑ → magneticStress ↑ → growthRate ↓ → anxiety ↑ → entropy ↑

        // 1. Cosmos jitter
        IBONARIUM_STATE.cosmos.solarFlux += (Math.random() - 0.5) * 2;
        IBONARIUM_STATE.cosmos.solarFlux = Math.max(100, Math.min(250, IBONARIUM_STATE.cosmos.solarFlux));

        // 2. Cosmic influence on Geo
        const fluxEffect = (IBONARIUM_STATE.cosmos.solarFlux - 150) / 50;
        IBONARIUM_STATE.geo.magneticStress += fluxEffect * 0.5 + (Math.random() - 0.5);
        IBONARIUM_STATE.geo.magneticStress = Math.max(20, Math.min(100, IBONARIUM_STATE.geo.magneticStress));

        // 3. Geo influence on Bio
        const geoStress = IBONARIUM_STATE.geo.magneticStress / 50;
        IBONARIUM_STATE.bio.growthRate = 1.5 - geoStress * 0.5 + (Math.random() - 0.5) * 0.05;

        // 4. Bio/Geo influence on Social
        IBONARIUM_STATE.social.anxiety = (geoStress + (1 - IBONARIUM_STATE.bio.growthRate)) / 2;

        // 5. Meta calculation
        IBONARIUM_STATE.meta.harmony = 1 - (IBONARIUM_STATE.social.anxiety * 0.5 + (1 - IBONARIUM_STATE.meta.stabilityIndex) * 0.5);
        IBONARIUM_STATE.time.entropy = 0.04 + IBONARIUM_STATE.social.anxiety * 0.1;

        // Random events logging
        if (Math.random() > 0.99) {
            this.log(`[ALERT] Cosmic flare detected. SolarFlux at ${IBONARIUM_STATE.cosmos.solarFlux.toFixed(1)}`);
        }
        if (IBONARIUM_STATE.social.anxiety > 0.6 && Math.random() > 0.98) {
            this.log(`[WARNING] Social anxiety rising. Field deformation imminent.`);
        }
    }

    updateUI() {
        // Update stats in panels
        document.getElementById('stats-meta').innerText = `Stability: ${(IBONARIUM_STATE.meta.stabilityIndex * 100).toFixed(0)}% | Harmony: ${IBONARIUM_STATE.meta.harmony.toFixed(2)}`;
        document.getElementById('stats-social').innerText = `Anxiety: ${IBONARIUM_STATE.social.anxiety > 0.5 ? 'High' : 'Low'} | Connectivity: ${IBONARIUM_STATE.social.connectivity.toFixed(2)}`;
        document.getElementById('stats-bio').innerText = `Growth: ${IBONARIUM_STATE.bio.growthRate.toFixed(2)}x | Respiration: ${IBONARIUM_STATE.bio.respiration.toFixed(2)}`;
        document.getElementById('stats-geo').innerText = `MagSTRESS: ${IBONARIUM_STATE.geo.magneticStress.toFixed(1)}nT | Turbulence: ${IBONARIUM_STATE.geo.turbulence.toFixed(2)}`;
        document.getElementById('stats-cosmos').innerText = `SolarFlux: ${IBONARIUM_STATE.cosmos.solarFlux.toFixed(0)} | Orbit: ${IBONARIUM_STATE.cosmos.orbitalPhase.toFixed(2)}`;
        document.getElementById('stats-time').innerText = `Pulse: ${IBONARIUM_STATE.time.pulse.toFixed(2)}Hz | Entropy: ${IBONARIUM_STATE.time.entropy.toFixed(3)}`;

        this.harmonyElement.innerText = IBONARIUM_STATE.meta.harmony.toFixed(2);

        // Update charts (simple bars)
        const bars = document.querySelectorAll('#entropy-chart .bar');
        bars.forEach(bar => {
            const h = 20 + Math.random() * 60 * IBONARIUM_STATE.time.entropy * 10;
            bar.style.height = `${Math.min(100, h)}%`;
        });
    }

    setupEventListeners() {
        document.getElementById('save-state').addEventListener('click', () => {
            this.log("[CMD] Snapshot saved to local storage.");
            localStorage.setItem('ibonarium_snapshot', JSON.stringify({
                date: new Date().toISOString(),
                state: IBONARIUM_STATE
            }));
            gsap.to('body', { backgroundColor: '#101020', duration: 0.1, yoyo: true, repeat: 1 });
        });

        document.getElementById('compare-days').addEventListener('click', () => {
            this.log("[CMD] Comparing with historical data (Jan 2026)...");
            this.log("[RESULT] Average stability increased by 4.2% since singularity.");
        });

        // Layer highlighting
        document.querySelectorAll('.layer-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                const layer = item.getAttribute('data-layer');
                this.highlightLayer(layer);
            });
            item.addEventListener('mouseleave', () => {
                this.resetLayers();
            });
        });
    }

    highlightLayer(layerName) {
        document.querySelectorAll('.layer-item').forEach(i => i.classList.remove('active'));
        document.querySelector(`[data-layer="${layerName}"]`).classList.add('active');

        // Highlight in 3D (visual logic)
        Object.keys(this.viz.layers).forEach(k => {
            if (k === layerName) {
                if (this.viz.layers[k].material) this.viz.layers[k].material.opacity = 0.8;
                if (this.viz.layers[k].children) {
                    this.viz.layers[k].children.forEach(c => c.material.opacity = 0.8);
                }
            } else {
                if (this.viz.layers[k].material) this.viz.layers[k].material.opacity = 0.1;
                if (this.viz.layers[k].children) {
                    this.viz.layers[k].children.forEach(c => c.material.opacity = 0.1);
                }
            }
        });
    }

    resetLayers() {
        Object.keys(this.viz.layers).forEach(k => {
            if (this.viz.layers[k].material) this.viz.layers[k].material.opacity = 0.3;
            if (this.viz.layers[k].children) {
                this.viz.layers[k].children.forEach(c => c.material.opacity = 0.5);
            }
        });
        document.querySelector(`[data-layer="meta"]`).classList.add('active');
    }
}

window.onload = () => {
    window.app = new IbonariumLab();
};
