# Location Picker Guide

## Overview

The new location picker allows users to select their birth location from an interactive map instead of typing it manually. This provides:
- More accurate coordinates for astrological calculations
- Better user experience
- Reduced typos and errors

## User Flow

```
Signup Screen
    ↓
[Tap "Birth Location" field]
    ↓
Location Picker Screen
    ↓
[Search or tap on map]
    ↓
[Confirm Location]
    ↓
Back to Signup Screen
(Location filled in)
```

## Features

### 1. Search Functionality
- Type any city, address, or landmark
- Press "Search" or hit Enter
- Map automatically zooms to the location
- Address is displayed below the map

### 2. Manual Selection
- Tap anywhere on the map
- A marker appears at that location
- Address is automatically looked up
- Coordinates are captured

### 3. Location Display
- Shows full address of selected location
- Updates in real-time as you select different spots
- Truncates long addresses for readability

### 4. Confirmation
- "Confirm Location" button saves the selection
- Returns to signup screen with location filled
- Both address and coordinates are saved

## Technical Implementation

### Components Used
- `react-native-maps` - Map display and interaction
- `MapView` - Main map component
- `Marker` - Location pin on map
- `Region` - Map viewport control

### APIs Used
- **Nominatim (OpenStreetMap)** - Free geocoding service
  - Forward geocoding: Search → Coordinates
  - Reverse geocoding: Coordinates → Address
  - No API key required
  - Rate limit: ~1 request per second

### Data Stored
When a location is selected, the following is saved:
```typescript
{
  address: "New York, NY, USA",           // Human-readable
  latitude: 40.7128,                       // Precise coordinate
  longitude: -74.0060                      // Precise coordinate
}
```

## Code Structure

### LocationPickerScreen.tsx
```
├── Search Bar (top)
│   ├── Text Input
│   └── Search Button
├── Map View (center)
│   ├── User Location
│   ├── Selected Marker
│   └── Tap Handler
├── Location Info (bottom)
│   └── Selected Address Display
└── Action Buttons (bottom)
    ├── Cancel
    └── Confirm Location
```

### Integration Points

1. **SignupScreen.tsx**
   - Replaced TextInput with TouchableOpacity
   - Opens LocationPicker on tap
   - Receives location data via callback

2. **AuthStack.tsx**
   - Added LocationPicker route
   - Configured with header
   - Passes callback parameter

3. **authService.ts**
   - Updated SignupBirthData interface
   - Saves coordinates to database
   - Handles optional coordinate fields

## Styling

### Design Principles
- Clean, modern interface
- Consistent with app theme
- Clear visual hierarchy
- Accessible touch targets

### Color Scheme
- Primary: `#4F46E5` (Indigo)
- Background: `#F8F9FA` (Light gray)
- Text: `#1A1A2E` (Dark)
- Borders: `#E5E7EB` (Light gray)

## Error Handling

### Network Errors
- Graceful fallback if geocoding fails
- User-friendly error messages
- Retry capability

### Invalid Selections
- Prevents confirmation without location
- Validates coordinate ranges
- Handles edge cases

## Future Enhancements

Possible improvements:
- Current location detection
- Recent locations history
- Favorite locations
- Offline map caching
- Multiple map styles
- Distance measurement
- Timezone auto-detection

## Accessibility

- Large touch targets (44x44 minimum)
- Clear labels and placeholders
- Keyboard navigation support
- Screen reader compatible
- High contrast text

## Performance

- Lazy loading of map tiles
- Debounced search input
- Optimized marker rendering
- Minimal re-renders
- Efficient state management

## Testing Checklist

- [ ] Search for major cities
- [ ] Tap on map to select location
- [ ] Verify address display
- [ ] Confirm location saves correctly
- [ ] Cancel returns without saving
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Test with slow network
- [ ] Test with no network (should show error)
- [ ] Verify coordinates are accurate

## Troubleshooting

### Map doesn't load
- Check internet connection
- Verify react-native-maps is installed
- Clear cache and restart

### Search doesn't work
- Check internet connection
- Try different search terms
- Wait between searches (rate limit)

### Location not saving
- Check Supabase connection
- Verify database schema
- Check console for errors

## Resources

- [React Native Maps Docs](https://github.com/react-native-maps/react-native-maps)
- [Nominatim API Docs](https://nominatim.org/release-docs/latest/api/Overview/)
- [OpenStreetMap](https://www.openstreetmap.org/)
