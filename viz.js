/**
 * IBONARIUM · VIZ.JS
 * Unified Matrix Visualization
 */

class MatrixViz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        this.layers = {};
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;
        this.camera.position.y = 1;
        this.camera.lookAt(0, 0, 0);

        this.createLayers();
        this.addLights();

        window.addEventListener('resize', () => this.onResize());
        this.animate();
    }

    createLayers() {
        // I. TIME / RHYTHM (Base pulse - Lowest Layer)
        const timeGeometry = new THREE.BufferGeometry();
        const timePoints = [];
        for (let i = 0; i < 3000; i++) {
            timePoints.push((Math.random() - 0.5) * 12, -3, (Math.random() - 0.5) * 8);
        }
        timeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(timePoints, 3));
        const timeMaterial = new THREE.PointsMaterial({
            color: 0xff3ebf,
            size: 0.03,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        this.layers.time = new THREE.Points(timeGeometry, timeMaterial);
        this.scene.add(this.layers.time);

        // II. COSMOS (Background field)
        const cosmosGeometry = new THREE.BufferGeometry();
        const cosmosPoints = [];
        for (let i = 0; i < 8000; i++) {
            cosmosPoints.push((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 15, -10);
        }
        cosmosGeometry.setAttribute('position', new THREE.Float32BufferAttribute(cosmosPoints, 3));
        const cosmosMaterial = new THREE.PointsMaterial({
            color: 0xffbe3e,
            size: 0.02,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        this.layers.cosmos = new THREE.Points(cosmosGeometry, cosmosMaterial);
        this.scene.add(this.layers.cosmos);

        // III. GEO + CLIMATE (Atmospheric waves - Mid Layer)
        const geoGeometry = new THREE.PlaneGeometry(16, 12, 100, 100);
        const geoMaterial = new THREE.MeshPhongMaterial({
            color: 0x3eadff,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        this.layers.geo = new THREE.Mesh(geoGeometry, geoMaterial);
        this.layers.geo.rotation.x = -Math.PI / 2.2;
        this.layers.geo.position.y = -1;
        this.scene.add(this.layers.geo);

        // IV. BIO (Growth patterns - Living Layer)
        const bioGroup = new THREE.Group();
        for (let i = 0; i < 40; i++) {
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.005, 0.005, 1, 4),
                new THREE.MeshBasicMaterial({
                    color: 0x3eff8b,
                    transparent: true,
                    opacity: 0.7,
                    blending: THREE.AdditiveBlending
                })
            );
            stem.position.set((Math.random() - 0.5) * 12, -1, (Math.random() - 0.5) * 6);
            bioGroup.add(stem);
        }
        this.layers.bio = bioGroup;
        this.scene.add(this.layers.bio);

        // V. SOCIAL (Chaotic interference - Top Layer)
        const socialGeometry = new THREE.IcosahedronGeometry(3, 3);
        const socialMaterial = new THREE.MeshBasicMaterial({
            color: 0xff3e3e,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        this.layers.social = new THREE.Mesh(socialGeometry, socialMaterial);
        this.layers.social.position.z = 2;
        this.scene.add(this.layers.social);

        // VI. META (Global field - Container)
        const metaGeometry = new THREE.SphereGeometry(8, 64, 64);
        const metaMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                harmony: { value: 0.88 }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float harmony;
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    float dist = length(vPosition);
                    float pulse = sin(dist * 0.5 - time * 2.0) * 0.5 + 0.5;
                    float alpha = (1.0 - harmony) * 0.1 + pulse * 0.05;
                    vec3 color = mix(vec3(0.0, 0.95, 1.0), vec3(0.44, 0.0, 1.0), pulse);
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        this.layers.meta = new THREE.Mesh(metaGeometry, metaMaterial);
        this.scene.add(this.layers.meta);
    }


    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x00f2ff, 1);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(state) {
        const t = this.clock.getElapsedTime();

        // I. TIME - Pulse size based on state.time.pulse
        const timeScale = 1 + Math.sin(t * state.time.pulse) * 0.1;
        this.layers.time.scale.set(timeScale, timeScale, timeScale);

        // II. COSMOS - Rotation based on solarFlux
        this.layers.cosmos.rotation.y += 0.001 * (state.cosmos.solarFlux / 100);

        // III. GEO - Displacement based on magneticStress
        const positions = this.layers.geo.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            positions[i + 2] = Math.sin(x * 0.5 + t) * Math.cos(y * 0.5 + t) * (state.geo.magneticStress / 20);
        }
        this.layers.geo.geometry.attributes.position.needsUpdate = true;

        // IV. BIO - Growth height
        this.layers.bio.children.forEach((stem, i) => {
            const h = state.bio.growthRate * (1 + Math.sin(t + i));
            stem.scale.y = h;
            stem.position.y = -2 + h / 2;
        });

        // V. SOCIAL - Chaotic movement
        this.layers.social.rotation.x += 0.01 * state.social.anxiety;
        this.layers.social.rotation.y += 0.012 * state.social.anxiety;
        const socialScale = 1 + Math.random() * 0.05 * state.social.anxiety;
        this.layers.social.scale.set(socialScale, socialScale, socialScale);

        // VI. META - Influence uniform
        if (this.layers.meta.material.uniforms) {
            this.layers.meta.material.uniforms.time.value = t;
            this.layers.meta.material.uniforms.harmony.value = state.meta.harmony;
        }

        // Global camera movement
        this.camera.position.x = Math.sin(t * 0.2) * 0.5;
        this.camera.lookAt(0, 0, 0);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
