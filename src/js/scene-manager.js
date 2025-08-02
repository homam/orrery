// === SCENE MANAGEMENT ===
import { URLParams } from './url-params.js';

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.textureLoader = new THREE.TextureLoader();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedPlanetName = '';
        this.celestialObjects = [];
        this.lastCameraUpdate = 0;
        this.cameraUpdateThrottle = 100; // Update URL every 100ms
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
        
        // Initialize camera position from URL parameters
        this.setupCameraFromURL();
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Set up camera position URL synchronization
        this.setupCameraURLSync();

        this.setupLighting();
    }

    setupCameraFromURL() {
        const cameraPos = URLParams.getCameraPosition();
        const cartesian = URLParams.sphericalToCartesian(
            cameraPos.distance,
            cameraPos.azimuth,
            cameraPos.elevation
        );
        
        this.camera.position.set(cartesian.x, cartesian.y, cartesian.z);
        this.camera.lookAt(this.scene.position);
    }

    setupCameraURLSync() {
        // Update URL when camera changes
        this.controls.addEventListener('change', () => {
            const now = Date.now();
            if (now - this.lastCameraUpdate > this.cameraUpdateThrottle) {
                const spherical = URLParams.cartesianToSpherical(
                    this.camera.position.x,
                    this.camera.position.y,
                    this.camera.position.z
                );
                
                URLParams.updateCameraPosition(
                    spherical.distance,
                    spherical.azimuth,
                    spherical.elevation
                );
                
                this.lastCameraUpdate = now;
            }
        });

        // Handle URL changes for camera position
        window.addEventListener('popstate', () => {
            this.setupCameraFromURL();
        });
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1.5, 600);
        this.scene.add(pointLight);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
} 