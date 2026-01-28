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
        // I. TIME / RHYTHM (The Breathing Core - Interwoven Knot)
        this.layers.time = new THREE.Group();
        const knotGeo = new THREE.TorusKnotGeometry(0.7, 0.03, 128, 16, 3, 4);
        const knotMat = new THREE.MeshBasicMaterial({
            color: 0xff3ebf,
            wireframe: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i < 2; i++) {
            const knot = new THREE.Mesh(knotGeo, knotMat);
            knot.rotation.y = i * Math.PI / 2;
            this.layers.time.add(knot);
        }
        this.scene.add(this.layers.time);

        // II. COSMOS (Flowing Energy Streams)
        const streamCount = 2000;
        const streamGeo = new THREE.BufferGeometry();
        const streamPos = new Float32Array(streamCount * 3);
        const streamLife = new Float32Array(streamCount);
        for (let i = 0; i < streamCount; i++) {
            streamPos[i * 3] = (Math.random() - 0.5) * 40;
            streamPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
            streamPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
            streamLife[i] = Math.random();
        }
        streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));
        this.layers.cosmos = new THREE.Points(streamGeo, new THREE.PointsMaterial({
            color: 0xffbe3e,
            size: 0.05,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        }));
        this.layers.cosmos.userData = { life: streamLife };
        this.scene.add(this.layers.cosmos);

        // III. GEO + CLIMATE (The Interwoven Shell - Blue Sphere)
        const geoGeo = new THREE.IcosahedronGeometry(3.0, 2);
        const geoMat = new THREE.MeshPhongMaterial({
            color: 0x3eadff,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        this.layers.geo = new THREE.Mesh(geoGeo, geoMat);
        this.scene.add(this.layers.geo);

        // IV. BIO (Helical Interweaving)
        this.layers.bio = new THREE.Group();
        for (let i = 0; i < 8; i++) {
            const points = [];
            for (let j = 0; j <= 50; j++) {
                const angle = (j / 50) * Math.PI * 4;
                const r = 2.0 + Math.sin(angle * 0.5) * 0.6;
                points.push(new THREE.Vector3(
                    Math.cos(angle + i) * r,
                    (j / 25 - 1) * 3,
                    Math.sin(angle + i) * r
                ));
            }
            const curve = new THREE.CatmullRomCurve3(points);
            const tube = new THREE.Mesh(
                new THREE.TubeGeometry(curve, 64, 0.02, 8, false),
                new THREE.MeshBasicMaterial({ color: 0x3eff8b, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending })
            );
            this.layers.bio.add(tube);
        }
        this.scene.add(this.layers.bio);

        // V. SOCIAL (Interweaving Nodes)
        this.layers.social = new THREE.Group();
        const nodeGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0xff3e3e, blending: THREE.AdditiveBlending });
        for (let i = 0; i < 30; i++) {
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.userData = {
                speed: 0.02 + Math.random() * 0.05
            };
            this.layers.social.add(node);
        }
        this.scene.add(this.layers.social);

        // VI. META (Global Field - Aura)
        const metaGeo = new THREE.IcosahedronGeometry(8, 4);
        const metaMat = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 }, harmony: { value: 0.88 } },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float harmony;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
                    vec3 color = mix(vec3(0.0, 0.6, 1.0), vec3(0.5, 0.0, 1.0), sin(time)*0.5+0.5);
                    gl_FragColor = vec4(color, intensity * harmony);
                }
            `,
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        this.layers.meta = new THREE.Mesh(metaGeo, metaMat);
        this.scene.add(this.layers.meta);
    }

    addLights() {
        this.scene.add(new THREE.AmbientLight(0x404040));
        const p1 = new THREE.PointLight(0xff3ebf, 2, 20);
        p1.position.set(5, 5, 5);
        this.scene.add(p1);
    }


    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(state) {
        const t = this.clock.getElapsedTime();

        // I. TIME - Breathing and interweaving knots
        const breathe = 1 + Math.sin(t * (state.time.pulse / 5)) * 0.2;
        this.layers.time.scale.set(breathe, breathe, breathe);
        this.layers.time.children.forEach((knot, i) => {
            knot.rotation.y += 0.01 * (i + 1);
            knot.rotation.z += 0.005;
        });

        // II. COSMOS - Flowing particles
        const streamPos = this.layers.cosmos.geometry.attributes.position.array;
        const streamLife = this.layers.cosmos.userData.life;
        for (let i = 0; i < streamLife.length; i++) {
            streamLife[i] += 0.005 * (state.cosmos.solarFlux / 100);
            if (streamLife[i] > 1) {
                streamLife[i] = 0;
            }
            const angle = streamLife[i] * Math.PI * 4;
            const r = 10 * (1 - streamLife[i]);
            streamPos[i * 3] = Math.cos(angle + i) * r;
            streamPos[i * 3 + 1] = Math.sin(angle * 0.5) * r;
            streamPos[i * 3 + 2] = Math.sin(angle + i) * r;
        }
        this.layers.cosmos.geometry.attributes.position.needsUpdate = true;

        // III. GEO - Sphere rotation
        this.layers.geo.rotation.y = t * 0.1;
        this.layers.geo.rotation.z = Math.sin(t * 0.5) * 0.2;

        // IV. BIO - Interweaving Spirals
        this.layers.bio.rotation.y = -t * 0.2 * state.bio.growthRate;
        this.layers.bio.children.forEach((tube, i) => {
            tube.scale.setScalar(1 + Math.sin(t + i) * 0.1);
        });

        // V. SOCIAL - Interweaving nodes
        this.layers.social.children.forEach((node, i) => {
            const angle = t * node.userData.speed * (state.social.anxiety + 1) + i;
            node.position.x = Math.cos(angle) * (2.5 + Math.sin(t * 0.5) * 1);
            node.position.y = Math.sin(angle * 1.5) * 2;
            node.position.z = Math.sin(angle) * (2.5 + Math.cos(t * 0.5) * 1);
        });

        // VI. META
        if (this.layers.meta.material.uniforms) {
            this.layers.meta.material.uniforms.time.value = t;
            this.layers.meta.material.uniforms.harmony.value = state.meta.harmony;
        }

        this.camera.position.x = Math.sin(t * 0.2) * 3;
        this.camera.position.z = 8 + Math.cos(t * 0.2) * 1.5;
        this.camera.lookAt(0, 0, 0);
    }




    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
