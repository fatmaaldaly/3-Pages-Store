import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductsScreen from '../screens/ProductsScreen';
import { useAppDispatch } from '../store';
import { clearAuth } from '../store/authSlice';
import { removeItem } from '../utils/mmkv';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';


const Tab = createBottomTabNavigator();

export default function Tabs({ navigation }: any) {
  const dispatch = useAppDispatch();
  const handleSignOut = async () => {
    dispatch(clearAuth());
    await removeItem('accessToken');
    navigation.replace('Login'); 
};


  return (
      <Tab.Navigator
        screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#009C95',
        }}
      >
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ tabBarLabel: 'Products' }}
      />
      <Tab.Screen
        name="SignOut"
        component={ProductsScreen} 
        options={{ tabBarLabel: 'Sign Out' }}
        listeners={({ navigation, route }: { navigation: BottomTabNavigationProp<any>; route: RouteProp<any> }) => ({
          tabPress: (e: any) => {
            e.preventDefault(); 
            handleSignOut();    
          },
        })}
      />
    </Tab.Navigator>
  );
  
}






