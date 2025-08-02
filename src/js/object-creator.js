// === OBJECT CREATION ===
export class ObjectCreator {
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

            const orbitGeometry = new THREE.RingGeometry(data.visualScale - 0.1, data.visualScale + 0.1, 128);
            const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0.2, transparent: true });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            this.sceneManager.scene.add(orbit);

            if (data.hasRings) {
                const ringGeometry = new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.5, 64);
                const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaadd, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI * 0.4;
                planet.add(ring);
            }

            if (data.hasMoon) {
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
            
            this.sceneManager.celestialObjects.push({ group: planetGroup, data: data });
        }
    }

    async createStarsAndConstellations(OrbitalMechanics) {
        const starDataUrl = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/stars.6.json';
        const constellationDataUrl = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/constellations.lines.json';
        const sphereRadius = 2000;

        try {
            const [starData, constellationData] = await Promise.all([
                fetch(starDataUrl).then(res => res.json()),
                fetch(constellationDataUrl).then(res => res.json())
            ]);

            // --- Create Stars ---
            const starVertices = [];
            const starSizes = [];

            starData.features.forEach(star => {
                const mag = star.properties.mag;
                if (mag > 6.0) return;

                const ra = OrbitalMechanics.toRadians(star.geometry.coordinates[0]);
                const dec = OrbitalMechanics.toRadians(star.geometry.coordinates[1]);

                // Convert RA/Dec to 3D coordinates (equatorial system)
                // RA is longitude (0-360°), Dec is latitude (-90° to +90°)
                // Standard astronomical coordinate system: X points to vernal equinox, Z points to north celestial pole
                let x = sphereRadius * Math.cos(dec) * Math.cos(ra);
                let y = sphereRadius * Math.cos(dec) * Math.sin(ra);
                let z = sphereRadius * Math.sin(dec);
                
                // Transform from equatorial to ecliptic coordinates
                // Ecliptic is tilted by ~23.5° relative to celestial equator
                const eclipticObliquity = OrbitalMechanics.toRadians(23.439);
                const xEcl = x;
                const yEcl = y * Math.cos(eclipticObliquity) - z * Math.sin(eclipticObliquity);
                const zEcl = y * Math.sin(eclipticObliquity) + z * Math.cos(eclipticObliquity);
                
                // Flip coordinates to match Earth's perspective (inside-out view)
                x = -xEcl;
                y = zEcl; // Match planet coordinate system
                z = yEcl;
                
                starVertices.push(x, y, z);
                starSizes.push((6.5 - mag) * 10.0);
                

            });

            const starGeometry = new THREE.BufferGeometry();
            starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

            const starMaterial = new THREE.ShaderMaterial({
                uniforms: { color: { value: new THREE.Color(0xffffff) } },
                vertexShader: `
                    attribute float size;
                    void main() {
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    void main() {
                        if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
                        gl_FragColor = vec4(color, 1.0);
                    }
                `,
                transparent: true
            });

            const stars = new THREE.Points(starGeometry, starMaterial);
            this.sceneManager.scene.add(stars);

            // --- Create Constellations ---
            const constellationGroup = new THREE.Group();
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: 0x6688ff,
                opacity: 0.5, 
                transparent: true,
                depthTest: true,
                depthWrite: false,
                linewidth: 2
            });



            // Create constellation lines from coordinate data
            if (constellationData.type === 'FeatureCollection') {
                constellationData.features.forEach(constellation => {
                    if (constellation.geometry && constellation.geometry.coordinates) {
                        constellation.geometry.coordinates.forEach(lineString => {
                            // Each lineString is an array of coordinate pairs [ra, dec]
                            const points = [];
                            
                            lineString.forEach(coord => {
                                const ra = OrbitalMechanics.toRadians(coord[0]);
                                const dec = OrbitalMechanics.toRadians(coord[1]);
                                
                                // Convert to equatorial coordinates first
                                let x = sphereRadius * Math.cos(dec) * Math.cos(ra);
                                let y = sphereRadius * Math.cos(dec) * Math.sin(ra);
                                let z = sphereRadius * Math.sin(dec);
                                
                                // Transform from equatorial to ecliptic coordinates
                                const eclipticObliquity = OrbitalMechanics.toRadians(23.439);
                                const xEcl = x;
                                const yEcl = y * Math.cos(eclipticObliquity) - z * Math.sin(eclipticObliquity);
                                const zEcl = y * Math.sin(eclipticObliquity) + z * Math.cos(eclipticObliquity);
                                
                                // Flip coordinates to match Earth's perspective (inside-out view)
                                x = -xEcl;
                                y = zEcl; // Match planet coordinate system
                                z = yEcl;
                                
                                points.push(new THREE.Vector3(x, y, z));
                            });
                            
                            if (points.length >= 2) {
                                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                                const line = new THREE.Line(geometry, lineMaterial);
                                constellationGroup.add(line);
                            }
                        });
                    }
                });
            } else {
                console.log('Unexpected constellation data structure:', constellationData);
            }
            
            constellationGroup.renderOrder = 1; 
            this.sceneManager.scene.add(constellationGroup);

        } catch (error) {
            console.error("Failed to load celestial data:", error);
        }
    }
} 