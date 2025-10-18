import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Switch } from 'react-native';
import { useAppDispatch } from '../store';
import { setUser, setToken } from '../store/authSlice';
import { login, getMe } from '../api/auth';
import { ThemeProvider, useThemeContext } from '../context/ThemeContext';
import Toast from 'react-native-toast-message';


export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await login(username, password);
      dispatch(setToken(data.accessToken));
      console.log("userInfo", data);
      const me = await getMe();
      dispatch(setUser(me));

      navigation.replace('Tabs');
    } catch (err) {
      Toast.show({
      type: 'error',
      text1: 'Login Failed',
      text2: 'Invalid username or password. Please try again.',
      position: 'top',
      visibilityTime: 3000,
      topOffset: 50,
      onPress: () => handleLogin(), 
    });
    } finally {
    setLoading(false);
  }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
    <View style={styles.header}>      
         <Switch
           style={{ marginTop: 30 }}
           value={isDarkMode}
           onValueChange={toggleTheme}
           thumbColor={isDarkMode ? '#fff' : '#fff'}
           trackColor={{ false: '#ccc', true: '#444' }}
          />
      </View>

    <View style={styles.container}>
      
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#009C95"  
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#009C95"  
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      
     <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
      <Text style={styles.loginText}>{loading ? 'Logging in...' : 'Login'}</Text>
     </TouchableOpacity>
    </View>
   </View>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
 header: {
  flexDirection: 'row',
  justifyContent: 'flex-end', 
  alignItems: 'center',
  backgroundColor: '#009C95',
  paddingHorizontal: 16,
  paddingVertical: 10,
  paddingTop:20
  
},

  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 10 
    
  },
  
  title: { 
    fontSize: 24, 
    textAlign: 'center', 
    marginBottom: 20, 
    fontWeight: 'bold', 
    color: '#009C95'
  },
  
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginVertical: 10, 
    borderRadius: 10, 
    color:'#009C95',
    width:300,
    alignSelf:'center'
  },

  loginButton: { 
    marginTop: 20, 
    backgroundColor: '#009C95',  
    borderRadius: 10,
    width:300,
    alignSelf:'center'
  },

  loginText: { 
    color: 'white', 
    textAlign: 'center', 
    padding: 10, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },

});


