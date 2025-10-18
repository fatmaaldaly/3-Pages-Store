3 Pages Store

Setup Steps and How to Run

```bash
# Create a new Expo project
npx create-expo-app store --template expo-template-blank-typescript
cd store

# run the app
npx expo start
```

Category screen

- I implemented a dropdown list for the categories.
  When you press on a category, it opens the Category Screen showing only products from that category.

Superadmin

- Username: emilys
- Password: emilyspass

Notes

- I wasn’t able to test biometrics (Face ID / Fingerprint) because Expo Go on iOS doesn’t support it.
  Instead, I used the passcode fallback for testing the biometric unlock flow.

- I implemented MMKV with an AsyncStorage fallback since MMKV doesn’t work with Expo Go on iOS.

If I had more time, I would:

- Improve the UI design and add animations.
- Add a search bar to search for a specific product.
- Add tests
