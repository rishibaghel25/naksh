# Installation Guide

## Install React Native Maps

You need to install `react-native-maps` to enable the map-based location picker:

```bash
npm install react-native-maps
```

### For Expo (Recommended)

If you're using Expo (which you are), install the Expo version:

```bash
npx expo install react-native-maps
```

### Configuration

No additional configuration is needed for Expo. The package will work out of the box.

### For Android (if building standalone)

If you plan to build a standalone Android app, you'll need to add your Google Maps API key to `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

### For iOS (if building standalone)

iOS uses Apple Maps by default, so no API key is needed.

## After Installation

1. Stop your development server (Ctrl+C)
2. Clear the cache: `npx expo start -c`
3. Restart the app

## Testing the Location Picker

1. Sign up for a new account
2. When you reach the "Birth Location" field, tap on it
3. You'll be taken to a map screen where you can:
   - Search for a location using the search bar
   - Tap anywhere on the map to select a location
   - Confirm your selection

The app uses OpenStreetMap's free geocoding API (Nominatim), so no API keys are required for basic functionality.
