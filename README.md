3 Pages Store

Setup Steps and How to Run

```bash
# Create a new Expo project
npx create-expo-app store --template expo-template-blank-typescript
cd store

# Install dependencies
npm install

# Run the app
npx expo start
```

Approach

Architecture:

- Used React Navigation for navigation, Redux Toolkit for managing authentication state,
  and React Query for efficient data fetching and caching.

Data Persistence:

- Implemented MMKV with an AsyncStorage fallback to ensure compatibility with Expo Go on iOS.
  This allows query caching and session data to persist even after app restarts or offline usage.

Authentication:

- Implemented login using DummyJSON (/auth/login) and token storage with MMKV/AsyncStorage.
  On relaunch, if a valid token exists, the user is prompted with a biometric or passcode unlock.

Auto-lock:

- The app automatically locks after 10 seconds of inactivity or when moved to the background.
  A LockOverlay appears, requiring biometric/passcode unlock to resume.

Category screen:

- I implemented a dropdown list for the categories. When a user presses on a category, it opens the Category Screen showing only products from that category.

Superadmin

- Username: emilys
- Password: emilyspass

Notes

- I wasn’t able to test biometrics (Face ID / Fingerprint) because Expo Go on iOS doesn’t support it.
  Instead, I used the passcode fallback for testing the biometric unlock flow.

- I implemented MMKV with an AsyncStorage fallback since MMKV doesn’t work with Expo Go on iOS.

If I had more time, I would:

- Improve the UI design and add animations.
- Add a search bar to allow users search for a specific product quickly.
- Add a vibration effect when performing specific actions, to make the user experience more interactive and responsive.
- Add unit & integration tests.
