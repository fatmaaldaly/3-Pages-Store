import NetInfo from '@react-native-community/netinfo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import {Switch, Alert, FlatList, Image, RefreshControl, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { deleteProduct, fetchProductsByCategory, Product } from '../api/products';
import { RootStackParamList } from '../navigation/types';
import { RootState, useAppSelector } from '../store';
import { ThemeProvider, useThemeContext } from '../context/ThemeContext';


type CategoryScreenRouteProp = {
  key: string;
  name: 'Category';
  params: { category: string };
};

export default function CategoryScreen() {
  const queryClient = useQueryClient();
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const category = route.params.category;
  const isSuperAdmin = useAppSelector((state) => state.auth.isSuperAdmin);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const { isDarkMode, toggleTheme } = useThemeContext();

  const { data, isFetching, refetch } = useQuery<Product[], Error>({
    queryKey: ['category', category],
    queryFn: () => fetchProductsByCategory(category),
  });

  const mutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Product[]>(['category', category], (old) =>
        old ? old.filter((p) => p.id !== id) : []
      );
    },
  });


  
  const [isConnected, setIsConnected] = React.useState(true);
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
               <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        <Switch
                  style={{ marginTop: 30 }}
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  thumbColor={isDarkMode ? '#fff' : '#fff'}
                  trackColor={{ false: '#ccc', true: '#444' }}
              />

       
      </View>

      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline mode</Text>
        </View>
      )}

      <FlatList
              data={data ?? []}
              numColumns={2}
              columnWrapperStyle={styles.row}
              refreshing={isFetching}
              onRefresh={refetch}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={[styles.card, { backgroundColor: isDarkMode ? '#332E2E' : '#fff' }]}>
                  <Image source={{ uri: item.thumbnail }} style={styles.image} />
                  <Text 
                  style={[
                    styles.title,
                    { color: isDarkMode ? '#fff' : '#000' } 
                  ]}
                  numberOfLines={2}
                  >
                  {item.title}
                  </Text>

           {isSuperAdmin && (
                         <TouchableOpacity
                                        style={[styles.deleteButton, { opacity: isConnected ? 1 : 0.5 }]}
                                        disabled={!isConnected}
                                        onPress={() =>
                                          Alert.alert(
                                            'Confirm Delete',
                                            'Delete this product?',
                                            [
                                              { text: 'Cancel', style: 'cancel' },
                                              {
                                                text: 'Delete',
                                                style: 'destructive',
                                                onPress: () => {
                                                  setTimeout(() => {
                                                    mutation.mutate(item.id);
                                                  }, 200);
                                                },
                                              },
                                            ],
                                            { cancelable: true }
                                          )
                                        }
                                      >
                                      <Text style={styles.deleteText}>Delete</Text>
                                    </TouchableOpacity>
                         )}
                     </View>
                   )}
                 />
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#009C95',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop:20,
 
  },
  
  headerTitle: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop:30 },
  
    backButton: {
    marginTop:30, 
    backgroundColor:'#fff', 
    borderRadius:5, 
    color:'#009C95', 
    width:70
  },

  backButtonText:{
    color: '#009C95', 
    textAlign: 'center', 
    padding: 5, 
    fontSize: 16, 
    fontWeight: 'bold'
  },

  row: {
  gap: 10,
  marginBottom: 16,
  paddingHorizontal: 10,
  justifyContent: 'space-between',
},

card: {
  flex: 1,
  backgroundColor: 'white',
  borderRadius: 8,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'space-between',
  marginHorizontal: 5,
  minHeight: 260,
  marginTop:10
},

image: {
  width: 170,
  height: 200,
  marginBottom: 5,
  borderRadius: 5,
},

title: {
  fontSize: 14,
  marginBottom: 10,
  padding: 10,
},

deleteButton: {
  backgroundColor: '#009C95',
  padding: 8,
  borderRadius: 5,
  paddingVertical: 8,
  alignItems: 'center',
  width: 80,
},

deleteText: {
  color: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  fontWeight: 'bold',
},

offlineBanner: {
  backgroundColor: 'white',
  padding: 8,
  alignItems: 'center',
},
  offlineText: { 
  color: 'black', 
  fontWeight: 'bold' 
 },


});   
