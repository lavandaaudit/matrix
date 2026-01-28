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

    async fetchData() {
        try {
            // 1. GEO DATA - Real weather in Kyiv (as Lab HQ)
            const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=30.52&current=temperature_2m,wind_speed_10m,magnetic_field');
            const weatherData = await weatherRes.json();

            if (weatherData.current) {
                IBONARIUM_STATE.geo.thermalGradient = weatherData.current.temperature_2m;
                IBONARIUM_STATE.geo.turbulence = weatherData.current.wind_speed_10m / 50;
                this.log(`[API] Geo-data synced: Temp ${weatherData.current.temperature_2m}°C`);
            }

            // 2. SOCIAL DATA - Bitcoin Volatility as a proxy for digital anxiety
            const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
            const cryptoData = await cryptoRes.json();

            if (cryptoData.bitcoin) {
                const change = Math.abs(cryptoData.bitcoin.usd_24h_change);
                IBONARIUM_STATE.social.anxiety = Math.min(1, change / 10);
                IBONARIUM_STATE.social.connectivity = 0.8 + (Math.random() * 0.2);
                this.log(`[API] Social-sync: Market volatility reflects anxiety at ${(IBONARIUM_STATE.social.anxiety * 100).toFixed(1)}%`);
            }

            // 3. COSMOS - Simulated Space Weather (NOAA data often needs keys or has complex paths, keeping it high-precision simulated for now)
            IBONARIUM_STATE.cosmos.solarFlux = 140 + Math.random() * 20;
            this.log(`[API] Cosmos-layer aligned with solar cycle 25.`);

        } catch (error) {
            this.log("[ERROR] API sync failed. Using local resonance buffer.");
            console.error(error);
        }
    }

    startDataSimulation() {
        // Initial fetch
        this.fetchData();
        // Sync with APIs every 30 seconds
        setInterval(() => this.fetchData(), 30000);

        // Fast render/evolve loop (10fps for smooth visual transitions)
        setInterval(() => {
            this.evolveState();
            this.updateUI();
            this.viz.update(IBONARIUM_STATE);
        }, 100);
    }

    evolveState() {
        // Subtle internal jitter for visual fluidity between API updates
        IBONARIUM_STATE.time.entropy = 0.04 + IBONARIUM_STATE.social.anxiety * 0.1;
        IBONARIUM_STATE.meta.harmony = 1 - (IBONARIUM_STATE.social.anxiety * 0.4 + (1 - IBONARIUM_STATE.meta.stabilityIndex) * 0.3);

        // Dynamic growth based on harmony
        IBONARIUM_STATE.bio.growthRate = 1.0 + (IBONARIUM_STATE.meta.harmony * 0.5);

        if (Math.random() > 0.995) {
            this.log(`[SYS] Matrix Harmony recalibrating: ${IBONARIUM_STATE.meta.harmony.toFixed(3)}`);
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
