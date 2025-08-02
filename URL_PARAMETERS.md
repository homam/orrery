# URL Parameters for Solar System Orrery

The orrery now supports URL parameters to share specific views and dates. This allows users to bookmark and share exact positions and times.

## Parameters

### Time Parameters
- **`days`**: Days since January 1, 1960 (0-25932)
  - `0` = January 1, 1960
  - `14610` = January 1, 2000 (default)
  - `25932` = December 31, 2030

### Camera Parameters
- **`cam_dist`**: Distance from center (10-1000)
  - `10` = Very close
  - `130` = Default distance
  - `1000` = Very far
- **`cam_az`**: Azimuth angle in degrees (0-360)
  - `0` = Front view
  - `90` = Right side
  - `180` = Behind
  - `270` = Left side
- **`cam_el`**: Elevation angle in degrees (-90 to 90)
  - `-90` = Looking straight down
  - `0` = Level view
  - `90` = Looking straight up

## Examples

### Time Only
```
src/index.html?days=18262
```
Shows the solar system on January 1, 2020

### Camera Only
```
src/index.html?cam_dist=200&cam_az=45&cam_el=30
```
Shows a side view from 200 units away

### Combined
```
src/index.html?days=14610&cam_dist=150&cam_az=90&cam_el=20
```
Shows January 1, 2000 from a side view

## Features

- **No History Pollution**: URL updates don't create browser history entries
- **Real-time Updates**: Parameters update as you move the slider or camera
- **Validation**: Invalid parameters are automatically corrected to valid ranges
- **Throttling**: Camera updates are throttled to prevent excessive URL changes
- **Browser Navigation**: Back/forward buttons work correctly with parameter changes

## Implementation Details

The system uses spherical coordinates for camera position, which are more intuitive for sharing than Cartesian coordinates. The conversion between spherical and Cartesian coordinates is handled automatically.

URL updates use `history.replaceState()` to avoid polluting the browser history, ensuring that users can navigate back to their original page without getting stuck in parameter changes. 