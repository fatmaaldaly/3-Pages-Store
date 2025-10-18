import * as LocalAuthentication from 'expo-local-authentication';


export async function biometricUnlock() {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!compatible || !enrolled) {
      console.log('Biometrics not available, fallback to password');
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock with Biometrics',
      fallbackLabel: 'Enter Password',
      disableDeviceFallback: false,
    });
    return result.success;

  } catch (err) {
    console.log('Biometric error:', err);
    return false;
  }
}
