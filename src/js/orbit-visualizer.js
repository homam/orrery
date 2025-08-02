// === ORBIT VISUALIZATION ===
export class OrbitVisualizer {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
    }

    createEllipticalOrbit(data) {
        // Create elliptical orbit using the same orbital mechanics as planet positioning
        const points = [];
        const segments = 128;
        
        // Use the same orbital parameters and transformations as planet positioning
        const a = data.a.val; // Semi-major axis
        const e = data.e.val; // Eccentricity
        const N = data.N.val * Math.PI / 180; // Longitude of ascending node
        const i = data.i.val * Math.PI / 180; // Inclination
        const w = data.w.val * Math.PI / 180; // Argument of pericenter
        
        // Scale factor to match visual scale
        const scale = data.visualScale / a;
        
        for (let j = 0; j <= segments; j++) {
            const angle = (j / segments) * 2 * Math.PI;
            
            // Calculate position on ellipse using the same method as orbital mechanics
            const r = a * (1 - e * e) / (1 + e * Math.cos(angle));
            const x_orb = r * Math.cos(angle);
            const y_orb = r * Math.sin(angle);
            
            // Apply the same orbital orientation transformations as planet positioning
            const cos_w = Math.cos(w);
            const sin_w = Math.sin(w);
            const cos_N = Math.cos(N);
            const sin_N = Math.sin(N);
            const cos_i = Math.cos(i);
            const sin_i = Math.sin(i);
            
            const x_ecl = (cos_w * cos_N - sin_w * sin_N * cos_i) * x_orb + (-sin_w * cos_N - cos_w * sin_N * cos_i) * y_orb;
            const y_ecl = (cos_w * sin_N + sin_w * cos_N * cos_i) * x_orb + (-sin_w * sin_N + cos_w * cos_N * cos_i) * y_orb;
            const z_ecl = (sin_w * sin_i) * x_orb + (cos_w * sin_i) * y_orb;
            
            // Apply visual scale and use same coordinate system as planet positioning
            points.push(new THREE.Vector3(
                x_ecl * scale,
                z_ecl * scale, // Match coordinate system used in orbital mechanics
                y_ecl * scale
            ));
        }
        
        // Create line geometry for the orbit
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const orbitMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffffff, 
            opacity: 0.25, 
            transparent: true,
            depthTest: true,
            depthWrite: false
        });
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        this.sceneManager.scene.add(orbit);
        
        return orbit;
    }
} 