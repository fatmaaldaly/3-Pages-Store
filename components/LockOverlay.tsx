import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { biometricUnlock } from '../utils/biometricUnlock';


export default function LockOverlay({ onUnlock }: { onUnlock: () => void }) {
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = async () => {
    setUnlocking(true);
    const success = await biometricUnlock();
    setUnlocking(false);
    if (success) {
      onUnlock();
    } else {
      Alert.alert('Failed', 'Authentication failed. Try again.');
    }

  };


//   return (
//     <View style={styles.overlay}>
//       <Text style={styles.title}>Locked</Text>
//       <TouchableOpacity onPress={handleUnlock} style={styles.button} disabled={unlocking}>
//         <Text style={styles.buttonText}>{unlocking ? 'Checking...' : 'Unlock'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.85)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },

//   title: {
//     color: 'white',
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },

//   button: {
//     backgroundColor: '#009C95',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 10,
//   },

//   buttonText: { 
//     color: 'white', 
//     fontSize: 18, 
//     fontWeight: 'bold' 
//   },

// });

return (
    <View style={styles.overlay}>
      <Text style={styles.title}>Locked</Text>

      <TouchableOpacity onPress={handleUnlock} style={styles.button} disabled={unlocking}>
        {unlocking ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Unlock</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#009C95',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});