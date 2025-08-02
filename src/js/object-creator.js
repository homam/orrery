// === OBJECT CREATION FACADE ===
import { CelestialBodyCreator } from './celestial-body-creator.js';
import { CoordinateSystemCreator } from './coordinate-system-creator.js';
import { OrbitVisualizer } from './orbit-visualizer.js';
import { StarFieldCreator } from './star-field-creator.js';

export class ObjectCreator {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        
        // Initialize specialized creators
        this.celestialBodyCreator = new CelestialBodyCreator(sceneManager);
        this.coordinateSystemCreator = new CoordinateSystemCreator(sceneManager);
        this.orbitVisualizer = new OrbitVisualizer(sceneManager);
        this.starFieldCreator = new StarFieldCreator(sceneManager);
    }

    createSun() {
        const sun = this.celestialBodyCreator.createSun();
        
        // Create coordinate system with Sun at center
        this.coordinateSystemCreator.createCoordinateSystem();
        
        return sun;
    }

    createPlanets(solarSystemData) {
        this.celestialBodyCreator.createPlanets(solarSystemData);
        
        // Create elliptical orbits for each planet
        for (const name in solarSystemData) {
            const data = solarSystemData[name];
            this.orbitVisualizer.createEllipticalOrbit(data);
        }
    }

    async createStarsAndConstellations(OrbitalMechanics) {
        await this.starFieldCreator.createStarsAndConstellations(OrbitalMechanics);
    }
} 