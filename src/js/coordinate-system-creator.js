// === COORDINATE SYSTEM CREATION ===
export class CoordinateSystemCreator {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
    }

    createCoordinateSystem() {
        const axisLength = 50;
        const axisWidth = 0.2;
        
        // Create coordinate axes group
        const coordinateSystem = new THREE.Group();
        
        // Slick colors with better contrast
        const xColor = 0xff6b6b; // Coral red
        const yColor = 0x4ecdc4; // Turquoise
        const zColor = 0x45b7d1; // Sky blue
        const negativeColor = 0x2c3e50; // Dark blue-gray for negative axes
        
        // Helper function to create axis with arrowhead
        const createAxis = (color, negativeColor, direction, rotation, position) => {
            // Positive axis
            const axisGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength, 12);
            const axisMaterial = new THREE.MeshBasicMaterial({ color: color });
            const axis = new THREE.Mesh(axisGeometry, axisMaterial);
            axis.rotation.copy(rotation);
            axis.position.copy(position);
            coordinateSystem.add(axis);
            
            // Positive arrowhead
            const arrowGeometry = new THREE.ConeGeometry(axisWidth * 2.5, axisWidth * 6, 12);
            const arrow = new THREE.Mesh(arrowGeometry, axisMaterial);
            arrow.rotation.copy(rotation);
            arrow.position.copy(position).add(direction.clone().multiplyScalar(axisLength / 2 + axisWidth * 3));
            coordinateSystem.add(arrow);
            
            // Negative axis
            const negAxisGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength, 12);
            const negAxisMaterial = new THREE.MeshBasicMaterial({ color: negativeColor });
            const negAxis = new THREE.Mesh(negAxisGeometry, negAxisMaterial);
            negAxis.rotation.copy(rotation);
            negAxis.position.copy(position).add(direction.clone().multiplyScalar(-axisLength / 2));
            coordinateSystem.add(negAxis);
            
            // Negative arrowhead
            const negArrowGeometry = new THREE.ConeGeometry(axisWidth * 2.5, axisWidth * 6, 12);
            const negArrow = new THREE.Mesh(negArrowGeometry, negAxisMaterial);
            negArrow.rotation.copy(rotation);
            negArrow.rotateY(Math.PI); // Flip arrow direction
            negArrow.position.copy(position).add(direction.clone().multiplyScalar(-axisLength / 2 - axisWidth * 3));
            coordinateSystem.add(negArrow);
        };
        
        // Create all 6 axes (+X, -X, +Y, -Y, +Z, -Z)
        createAxis(xColor, negativeColor, new THREE.Vector3(1, 0, 0), new THREE.Euler(0, 0, Math.PI / 2), new THREE.Vector3(axisLength / 2, 0, 0));
        createAxis(xColor, negativeColor, new THREE.Vector3(-1, 0, 0), new THREE.Euler(0, 0, Math.PI / 2), new THREE.Vector3(-axisLength / 2, 0, 0));
        createAxis(yColor, negativeColor, new THREE.Vector3(0, 1, 0), new THREE.Euler(0, 0, 0), new THREE.Vector3(0, axisLength / 2, 0));
        createAxis(yColor, negativeColor, new THREE.Vector3(0, -1, 0), new THREE.Euler(0, 0, 0), new THREE.Vector3(0, -axisLength / 2, 0));
        createAxis(zColor, negativeColor, new THREE.Vector3(0, 0, 1), new THREE.Euler(Math.PI / 2, 0, 0), new THREE.Vector3(0, 0, axisLength / 2));
        createAxis(zColor, negativeColor, new THREE.Vector3(0, 0, -1), new THREE.Euler(Math.PI / 2, 0, 0), new THREE.Vector3(0, 0, -axisLength / 2));
        
        // Add axis labels
        this.addAxisLabels(coordinateSystem, axisLength);
        
        // Add coordinate system to scene
        this.sceneManager.scene.add(coordinateSystem);
        
        return coordinateSystem;
    }
    
    addAxisLabels(coordinateSystem, axisLength) {
        const labelDistance = axisLength + 8;
        
        // Create simple text labels using HTML elements positioned in 3D space
        const createLabel = (text, color, position) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 64;
            canvas.height = 32;
            
            context.fillStyle = color;
            context.font = '24px Arial';
            context.textAlign = 'center';
            context.fillText(text, 32, 24);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.position.copy(position);
            sprite.scale.set(4, 2, 1);
            
            return sprite;
        };
        
        // Add positive axis labels
        coordinateSystem.add(createLabel('+X', '#ff6b6b', new THREE.Vector3(labelDistance, 0, 0)));
        coordinateSystem.add(createLabel('+Y', '#4ecdc4', new THREE.Vector3(0, labelDistance, 0)));
        coordinateSystem.add(createLabel('+Z', '#45b7d1', new THREE.Vector3(0, 0, labelDistance)));
        
        // Add negative axis labels
        coordinateSystem.add(createLabel('-X', '#2c3e50', new THREE.Vector3(-labelDistance, 0, 0)));
        coordinateSystem.add(createLabel('-Y', '#2c3e50', new THREE.Vector3(0, -labelDistance, 0)));
        coordinateSystem.add(createLabel('-Z', '#2c3e50', new THREE.Vector3(0, 0, -labelDistance)));
    }
} 