// === URL PARAMETER UTILITIES ===
export class URLParams {
    static getSliderValue() {
        const urlParams = new URLSearchParams(window.location.search);
        const daysParam = urlParams.get('days');
        
        if (daysParam !== null) {
            const days = parseInt(daysParam);
            // Validate the range: 0 to 25932 (Jan 1, 1960 to Dec 31, 2030)
            if (!isNaN(days) && days >= 0 && days <= 25932) {
                return days;
            }
        }
        
        // Default to Jan 1, 2000 (14610 days after Jan 1, 1960)
        return 14610;
    }

    static updateSliderValue(days) {
        const url = new URL(window.location);
        url.searchParams.set('days', days.toString());
        
        // Update URL without adding to browser history
        window.history.replaceState({}, '', url);
    }

    static getDateFromDays(days) {
        const sliderEpoch = new Date('1960-01-01T12:00:00Z');
        const currentDate = new Date(sliderEpoch.getTime() + days * 24 * 60 * 60 * 1000);
        return currentDate;
    }

    static getDaysFromDate(date) {
        const sliderEpoch = new Date('1960-01-01T12:00:00Z');
        const days = Math.round((date.getTime() - sliderEpoch.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(0, Math.min(25932, days)); // Clamp to valid range
    }

    // Camera position methods using spherical coordinates
    static getCameraPosition() {
        const urlParams = new URLSearchParams(window.location.search);
        const distance = parseFloat(urlParams.get('cam_dist')) || 130;
        const azimuth = parseFloat(urlParams.get('cam_az')) || 0;
        const elevation = parseFloat(urlParams.get('cam_el')) || 60;
        
        // Validate ranges
        const validDistance = Math.max(10, Math.min(1000, distance));
        const validAzimuth = ((azimuth % 360) + 360) % 360; // Normalize to 0-360
        const validElevation = Math.max(-90, Math.min(90, elevation));
        
        return {
            distance: validDistance,
            azimuth: validAzimuth,
            elevation: validElevation
        };
    }

    static updateCameraPosition(distance, azimuth, elevation) {
        const url = new URL(window.location);
        url.searchParams.set('cam_dist', distance.toFixed(1));
        url.searchParams.set('cam_az', azimuth.toFixed(1));
        url.searchParams.set('cam_el', elevation.toFixed(1));
        
        // Update URL without adding to browser history
        window.history.replaceState({}, '', url);
    }

    // Convert spherical coordinates to Cartesian coordinates
    static sphericalToCartesian(distance, azimuth, elevation) {
        const azimuthRad = (azimuth * Math.PI) / 180;
        const elevationRad = (elevation * Math.PI) / 180;
        
        const x = distance * Math.cos(elevationRad) * Math.sin(azimuthRad);
        const y = distance * Math.sin(elevationRad);
        const z = distance * Math.cos(elevationRad) * Math.cos(azimuthRad);
        
        return { x, y, z };
    }

    // Convert Cartesian coordinates to spherical coordinates
    static cartesianToSpherical(x, y, z) {
        const distance = Math.sqrt(x * x + y * y + z * z);
        const azimuth = Math.atan2(x, z) * 180 / Math.PI;
        const elevation = Math.asin(y / distance) * 180 / Math.PI;
        
        return {
            distance: distance,
            azimuth: ((azimuth % 360) + 360) % 360,
            elevation: elevation
        };
    }
} 