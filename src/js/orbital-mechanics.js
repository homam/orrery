// === ACCURATE ORBITAL MECHANICS CALCULATION ===
export const OrbitalMechanics = {
    toRadians: (d) => d * Math.PI / 180,
    normalizeAngle: (a) => a - Math.floor(a / 360) * 360,
    calculatePosition: function(planet, d) {
        const N = this.toRadians(this.normalizeAngle(planet.N.val + planet.N.rate * d));
        const i = this.toRadians(this.normalizeAngle(planet.i.val + planet.i.rate * d));
        const w = this.toRadians(this.normalizeAngle(planet.w.val + planet.w.rate * d));
        const a = planet.a.val + planet.a.rate * d;
        const e = planet.e.val + planet.e.rate * d;
        const M_deg = this.normalizeAngle(planet.M.val + planet.M.rate * d);
        const M = this.toRadians(M_deg);
        let E = M;
        for (let k = 0; k < 10; k++) { E = M + e * Math.sin(E); }
        const x_orb = a * (Math.cos(E) - e);
        const y_orb = a * (Math.sqrt(1 - e * e) * Math.sin(E));
        const cos_w = Math.cos(w); const sin_w = Math.sin(w);
        const cos_N = Math.cos(N); const sin_N = Math.sin(N);
        const cos_i = Math.cos(i); const sin_i = Math.sin(i);
        const x_ecl = (cos_w * cos_N - sin_w * sin_N * cos_i) * x_orb + (-sin_w * cos_N - cos_w * sin_N * cos_i) * y_orb;
        const y_ecl = (cos_w * sin_N + sin_w * cos_N * cos_i) * x_orb + (-sin_w * sin_N + cos_w * cos_N * cos_i) * y_orb;
        const z_ecl = (sin_w * sin_i) * x_orb + (cos_w * sin_i) * y_orb;
        return new THREE.Vector3(x_ecl, z_ecl, y_ecl);
    }
}; 