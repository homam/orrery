# Solar System Orrery - Modular JavaScript Structure

This project has been refactored from a single HTML file with inline JavaScript into a modular structure with separate JavaScript files.

## Project Structure

```
src/
├── index.html              # Main HTML file with UI elements
└── js/
    ├── main.js                    # Main application entry point
    ├── orbital-mechanics.js       # Orbital calculations and physics
    ├── solar-system-data.js       # Planet definitions and orbital parameters
    ├── scene-manager.js           # Three.js scene setup and management
    ├── object-creator.js          # Creation of sun, planets, stars, constellations
    ├── event-handler.js           # Click events and UI interactions
    └── animation-controller.js    # Main animation loop and time handling
```

## Module Breakdown

### 1. `orbital-mechanics.js`
- **Purpose**: Handles accurate orbital mechanics calculations
- **Exports**: `OrbitalMechanics` object with position calculation functions
- **Key Functions**: 
  - `toRadians()` - Convert degrees to radians
  - `normalizeAngle()` - Normalize angles to 0-360 range
  - `calculatePosition()` - Calculate planet positions using orbital elements

### 2. `solar-system-data.js`
- **Purpose**: Contains all planet data and orbital parameters
- **Exports**: `solarSystemData` object with planet definitions
- **Data Includes**: 
  - Planet names, radii, textures
  - Orbital elements (N, i, w, a, e, M)
  - Visual scales and special features (rings, moons)

### 3. `scene-manager.js`
- **Purpose**: Manages Three.js scene, camera, renderer, and controls
- **Exports**: `SceneManager` class
- **Key Features**:
  - Scene initialization
  - Camera and renderer setup
  - Lighting configuration
  - Window resize handling
  - Raycasting for planet selection

### 4. `object-creator.js`
- **Purpose**: Creates all 3D objects in the scene
- **Exports**: `ObjectCreator` class
- **Key Functions**:
  - `createSun()` - Creates the sun with texture
  - `createPlanets()` - Creates all planets with orbits, rings, moons
  - `createStarsAndConstellations()` - Creates star field and constellation lines

### 5. `event-handler.js`
- **Purpose**: Handles user interactions and UI events
- **Exports**: `EventHandler` class
- **Key Features**:
  - Planet click detection
  - Modal window management
  - Gemini API integration for planet facts
  - Window resize handling

### 6. `animation-controller.js`
- **Purpose**: Manages the main animation loop and time progression
- **Exports**: `AnimationController` class
- **Key Features**:
  - Time slider integration
  - Planet position updates
  - Planet rotation animations
  - Date display updates

### 7. `main.js`
- **Purpose**: Application entry point that coordinates all modules
- **Exports**: `SolarSystemOrrery` class
- **Key Features**:
  - Imports all other modules
  - Initializes the application
  - Coordinates module interactions

## Benefits of Modular Structure

1. **Maintainability**: Each module has a single responsibility
2. **Reusability**: Modules can be reused in other projects
3. **Testability**: Individual modules can be tested in isolation
4. **Readability**: Code is organized by functionality
5. **Scalability**: Easy to add new features or modify existing ones

## Usage

The application is started by loading `index.html` in a web browser. The HTML file loads the required Three.js libraries and then imports the main JavaScript module, which initializes the entire application.

## Dependencies

- Three.js (loaded via CDN)
- OrbitControls (loaded via CDN)
- Tailwind CSS (loaded via CDN)
- Google Fonts (Inter font family) 