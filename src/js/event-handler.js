// === EVENT HANDLING ===
export class EventHandler {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.sceneManager.onWindowResize(), false);
        window.addEventListener('click', (event) => this.onPlanetClick(event), false);

        const modal = document.getElementById('planet-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const generateFactBtn = document.getElementById('generate-fact-btn');

        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        generateFactBtn.addEventListener('click', () => {
            if (this.sceneManager.selectedPlanetName) {
                this.getPlanetFact(this.sceneManager.selectedPlanetName);
            }
        });
    }

    onPlanetClick(event) {
        event.preventDefault();
        this.sceneManager.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.sceneManager.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        this.sceneManager.raycaster.setFromCamera(this.sceneManager.mouse, this.sceneManager.camera);
        const intersects = this.sceneManager.raycaster.intersectObjects(this.sceneManager.scene.children, true);
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.userData.name) {
                this.sceneManager.selectedPlanetName = intersects[i].object.userData.name;
                document.getElementById('modal-title').textContent = this.sceneManager.selectedPlanetName;
                document.getElementById('modal-content').textContent = `Click the button to learn a fun fact about ${this.sceneManager.selectedPlanetName}!`;
                document.getElementById('planet-modal').classList.remove('hidden');
                return;
            }
        }
    }

    async getPlanetFact(planetName) {
        const modalContent = document.getElementById('modal-content');
        const generateBtn = document.getElementById('generate-fact-btn');
        
        modalContent.textContent = 'Asking the cosmos for a fact...';
        generateBtn.disabled = true;
        generateBtn.classList.add('opacity-50', 'cursor-not-allowed');

        const prompt = `Tell me a short, interesting, and fun fact about the planet ${planetName}.`;
        const apiKey = ""; // API key is handled by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) { throw new Error(`API request failed with status ${response.status}`); }

            const result = await response.json();
            const text = result.candidates[0].content.parts[0].text;
            modalContent.textContent = text;

        } catch (error) {
            console.error("Gemini API Error:", error);
            modalContent.textContent = "Sorry, couldn't retrieve a fact. The cosmos is quiet right now. Please try again.";
        } finally {
            generateBtn.disabled = false;
            generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
} 