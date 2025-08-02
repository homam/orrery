// === CELESTIAL BODY CREATION ===
export class CelestialBodyCreator {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.textureLoader = sceneManager.textureLoader;
    }

    createSun() {
        const sunTexture = this.textureLoader.load('https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/sunmap.jpg');
        const sunGeometry = new THREE.SphereGeometry(6, 64, 64);
        const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sceneManager.scene.add(sun);
        
        return sun;
    }

    createPlanets(solarSystemData) {
        for (const name in solarSystemData) {
            const data = solarSystemData[name];
            const planetGroup = new THREE.Group();
            this.sceneManager.scene.add(planetGroup);

            const planetTexture = this.textureLoader.load(data.textureUrl);
            const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
            const material = new THREE.MeshStandardMaterial({ map: planetTexture });
            const planet = new THREE.Mesh(geometry, material);
            planet.userData.name = data.name;
            planetGroup.add(planet);
            
            data.mesh = planet; 

            // Create rings if planet has them
            if (data.hasRings) {
                this.createPlanetaryRings(planet, data);
            }

            // Create moons if planet has them
            if (data.hasMoon) {
                this.createMoon(planet, data);
            }
            
            this.sceneManager.celestialObjects.push({ group: planetGroup, data: data });
        }
    }

    createPlanetaryRings(planet, data) {
        const ringGeometry = new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.5, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xaaaadd, 
            side: THREE.DoubleSide, 
            transparent: true, 
            opacity: 0.6 
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI * 0.4;
        planet.add(ring);
    }

    createMoon(planet, data) {
        const moonTexture = this.textureLoader.load(data.moonTextureUrl);
        const moonGroup = new THREE.Group();
        const moonGeometry = new THREE.SphereGeometry(data.radius * 0.27, 16, 16);
        const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.x = data.radius + 1.5;
        moonGroup.add(moon);
        planet.add(moonGroup);
        data.moonGroup = moonGroup;
    }
} 