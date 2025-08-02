// === ANIMATION CONTROLLER ===
import { URLParams } from './url-params.js';

export class AnimationController {
    constructor(sceneManager, OrbitalMechanics) {
        this.sceneManager = sceneManager;
        this.OrbitalMechanics = OrbitalMechanics;
        this.setupSlider();
    }

    setupSlider() {
        const slider = document.getElementById('time-slider');
        
        // Initialize slider with URL parameter value
        const initialDays = URLParams.getSliderValue();
        slider.value = initialDays;
        
        // Update URL when slider changes
        slider.addEventListener('input', (event) => {
            const days = parseInt(event.target.value);
            URLParams.updateSliderValue(days);
        });

        // Handle URL changes (back/forward buttons, manual URL changes)
        window.addEventListener('popstate', () => {
            const days = URLParams.getSliderValue();
            slider.value = days;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const daysSince1960 = parseFloat(document.getElementById('time-slider').value);
        const currentDate = URLParams.getDateFromDays(daysSince1960);
        document.getElementById('date-display').textContent = `Date: ${currentDate.toISOString().split('T')[0]}`;

        const j2000Epoch = new Date('2000-01-01T12:00:00Z');
        const daysSinceJ2000 = (currentDate.getTime() - j2000Epoch.getTime()) / (1000 * 60 * 60 * 24);

        this.sceneManager.celestialObjects.forEach(obj => {
            const { group, data } = obj;
            const position = this.OrbitalMechanics.calculatePosition(data, daysSinceJ2000);
            group.position.x = position.x * (data.visualScale / data.a.val);
            group.position.y = position.y * (data.visualScale / data.a.val);
            group.position.z = position.z * (data.visualScale / data.a.val);
            data.mesh.rotation.y += 0.005;
            if (data.moonGroup) { data.moonGroup.rotation.y += 0.03; }
        });

        this.sceneManager.render();
    }
} 