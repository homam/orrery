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
} 