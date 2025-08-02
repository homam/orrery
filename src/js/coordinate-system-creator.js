// === COORDINATE SYSTEM CREATION ===
export class CoordinateSystemCreator {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
    }

    createCoordinateSystem() {
        const axisLength = 80; // Extended from 30 to reach beyond Saturn (9.55 AU) to around Uranus (19.18 AU)
        const axisWidth = 0.08; // Reduced from 0.2
        
        // Create coordinate axes group
        const coordinateSystem = new THREE.Group();
        
        // Muted, subtle colors with transparency
        const xColor = 0xff6b6b; // Coral red
        const yColor = 0x4ecdc4; // Turquoise
        const zColor = 0x45b7d1; // Sky blue
        const negativeColor = 0x34495e; // Darker, more subtle for negative axes
        
        // Helper function to create axis with arrowhead
        const createAxis = (color, negativeColor, direction, rotation, position) => {
            // Positive axis with transparency
            const axisGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength, 8);
            const axisMaterial = new THREE.MeshBasicMaterial({ 
                color: color, 
                transparent: true, 
                opacity: 0.6 
            });
            const axis = new THREE.Mesh(axisGeometry, axisMaterial);
            axis.rotation.copy(rotation);
            axis.position.copy(position);
            coordinateSystem.add(axis);
            
            // Smaller, more subtle positive arrowhead
            const arrowGeometry = new THREE.ConeGeometry(axisWidth * 1.5, axisWidth * 3, 8);
            const arrow = new THREE.Mesh(arrowGeometry, axisMaterial);
            arrow.rotation.copy(rotation);
            arrow.position.copy(position).add(direction.clone().multiplyScalar(axisLength / 2 + axisWidth * 1.5));
            coordinateSystem.add(arrow);
            
            // Negative axis with more transparency
            const negAxisGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength, 8);
            const negAxisMaterial = new THREE.MeshBasicMaterial({ 
                color: negativeColor, 
                transparent: true, 
                opacity: 0.4 
            });
            const negAxis = new THREE.Mesh(negAxisGeometry, negAxisMaterial);
            negAxis.rotation.copy(rotation);
            negAxis.position.copy(position).add(direction.clone().multiplyScalar(-axisLength / 2));
            coordinateSystem.add(negAxis);
            
            // Smaller negative arrowhead
            const negArrowGeometry = new THREE.ConeGeometry(axisWidth * 1.5, axisWidth * 3, 8);
            const negArrow = new THREE.Mesh(negArrowGeometry, negAxisMaterial);
            negArrow.rotation.copy(rotation);
            negArrow.rotateY(Math.PI); // Flip arrow direction
            negArrow.position.copy(position).add(direction.clone().multiplyScalar(-axisLength / 2 - axisWidth * 1.5));
            coordinateSystem.add(negArrow);
        };
        
        // Create all 6 axes (+X, -X, +Y, -Y, +Z, -Z)
        createAxis(xColor, negativeColor, new THREE.Vector3(1, 0, 0), new THREE.Euler(0, 0, Math.PI / 2), new THREE.Vector3(axisLength / 2, 0, 0));
        createAxis(xColor, negativeColor, new THREE.Vector3(-1, 0, 0), new THREE.Euler(0, 0, Math.PI / 2), new THREE.Vector3(-axisLength / 2, 0, 0));
        createAxis(yColor, negativeColor, new THREE.Vector3(0, 1, 0), new THREE.Euler(0, 0, 0), new THREE.Vector3(0, axisLength / 2, 0));
        createAxis(yColor, negativeColor, new THREE.Vector3(0, -1, 0), new THREE.Euler(0, 0, 0), new THREE.Vector3(0, -axisLength / 2, 0));
        createAxis(zColor, negativeColor, new THREE.Vector3(0, 0, 1), new THREE.Euler(Math.PI / 2, 0, 0), new THREE.Vector3(0, 0, axisLength / 2));
        createAxis(zColor, negativeColor, new THREE.Vector3(0, 0, -1), new THREE.Euler(Math.PI / 2, 0, 0), new THREE.Vector3(0, 0, -axisLength / 2));
        
        // Add subtle axis labels
        this.addAxisLabels(coordinateSystem, axisLength);
        
        // Add coordinate system to scene
        this.sceneManager.scene.add(coordinateSystem);
        
        return coordinateSystem;
    }
    
    addAxisLabels(coordinateSystem, axisLength) {
        const labelDistance = axisLength + 4; // Reduced distance
        
        // Create subtle text labels using HTML elements positioned in 3D space
        const createLabel = (text, color, position) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 48; // Smaller canvas
            canvas.height = 24; // Smaller canvas
            
            // Add subtle background for better readability
            context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            context.fillRect(0, 0, 48, 24);
            
            context.fillStyle = color;
            context.font = '16px Arial'; // Smaller font
            context.textAlign = 'center';
            context.fillText(text, 24, 16);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ 
                map: texture,
                transparent: true,
                opacity: 0.8
            });
            const sprite = new THREE.Sprite(material);
            sprite.position.copy(position);
            sprite.scale.set(2, 1, 1); // Smaller scale
            
            return sprite;
        };
        
        // Add positive axis labels with more subtle colors
        coordinateSystem.add(createLabel('+X', '#ff6b6b', new THREE.Vector3(labelDistance, 0, 0)));
        coordinateSystem.add(createLabel('+Y', '#4ecdc4', new THREE.Vector3(0, labelDistance, 0)));
        coordinateSystem.add(createLabel('+Z', '#45b7d1', new THREE.Vector3(0, 0, labelDistance)));
        
        // Add negative axis labels with very subtle colors
        coordinateSystem.add(createLabel('-X', '#95a5a6', new THREE.Vector3(-labelDistance, 0, 0)));
        coordinateSystem.add(createLabel('-Y', '#95a5a6', new THREE.Vector3(0, -labelDistance, 0)));
        coordinateSystem.add(createLabel('-Z', '#95a5a6', new THREE.Vector3(0, 0, -labelDistance)));
    }
} 