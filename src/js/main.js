// === MAIN APPLICATION ===
import { OrbitalMechanics } from './orbital-mechanics.js';
import { solarSystemData } from './solar-system-data.js';
import { SceneManager } from './scene-manager.js';
import { ObjectCreator } from './object-creator.js';
import { EventHandler } from './event-handler.js';
import { AnimationController } from './animation-controller.js';

class SolarSystemOrrery {
    constructor() {
        this.sceneManager = new SceneManager();
        this.objectCreator = new ObjectCreator(this.sceneManager);
        this.eventHandler = new EventHandler(this.sceneManager);
        this.animationController = new AnimationController(this.sceneManager, OrbitalMechanics);
    }

    async init() {
        // Initialize scene
        this.sceneManager.init();
        
        // Create objects
        this.objectCreator.createSun();
        this.objectCreator.createPlanets(solarSystemData);
        await this.objectCreator.createStarsAndConstellations(OrbitalMechanics);
        
        // Start animation
        this.animationController.animate();
    }
}

// Initialize the application
const app = new SolarSystemOrrery();
app.init(); 