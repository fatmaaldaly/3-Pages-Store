import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Category, deleteProduct, fetchAllCategories, fetchAllProducts, Product } from '../api/products';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store/index';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import { useThemeContext } from '../context/ThemeContext';
import { useTheme } from '@react-navigation/native';
import { Switch } from 'react-native';


export default function ProductsScreen() {
  const queryClient = useQueryClient();
  const isSuperAdmin = useAppSelector((state) => state.auth.isSuperAdmin);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { colors } = useTheme();

  
  const { data, isLoading, isFetching, refetch } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchAllProducts, 
    networkMode: 'offlineFirst',
  });
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchAllCategories, 
    networkMode: 'offlineFirst',
  });
  
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isConnected, setIsConnected] = useState(true);
  
  
  useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    const connected = state.isConnected ?? true;
    setIsConnected(connected);
  });
    return () => unsubscribe();
  }, []);


  const mutation = useMutation({
  mutationFn: (id: number) => deleteProduct(id),
  onSuccess: (_, id) => {
    queryClient.setQueryData<Product[]>(['products'], (old) =>
      old ? old.filter((p) => p.id !== id) : []
    );
  },
  });


  const handleCategorySelect = (slug: string) => {
      setSelectedCategory(slug);
      if (slug) {
        navigation.navigate('Category', { category: slug });
      }
  };
  console.log('categories:', categories);


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Products</Text>
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
      

      <Dropdown
        style={styles.dropdown}
        data={categories.map(c => ({ label: c.name.name, value: c.name.slug }))}
        labelField="label"
        valueField="value"
        placeholder="-- Select a category --" 
        placeholderStyle={{
         color: isDarkMode ? '#aaa' : '#555', 
         fontSize: 14,
         fontStyle: 'italic',
        }}
        value={selectedCategory}
        onChange={item => handleCategorySelect(item.value)}
      />

      
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
              //   <TouchableOpacity
              //     style={styles.deleteButton}
              //     onPress={() =>
              //     Alert.alert(
              //       'Confirm Delete',
              //       'Delete this product?',
              //       [
              //        { text: 'Cancel', style: 'cancel' },
              //        {
              //          text: 'Delete',
              //          style: 'destructive',
              //          onPress: () => {
              //            setTimeout(() => {
              //              mutation.mutate(item.id);
              //            }, 200);
              //          },
              //        },
              //       ],
              //       { cancelable: true }
              //       )
              //   }
              // >
              // <Text style={styles.deleteText}>Delete</Text>
              // </TouchableOpacity>
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
      <Toast/>
    </View>

  );
}


const styles = StyleSheet.create({
  header: {
    padding: 15,
    backgroundColor: '#009C95',
    flexDirection: 'row',        
    alignItems: 'center',        
    justifyContent: 'space-between', 
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop:20
   
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop:30
   
  },
  pickerContainer: {
    paddingHorizontal: 15,
    marginTop:0,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
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
},

  image: { width: 170, height: 200, marginBottom: 5, borderRadius: 5 },
  title: { fontSize: 14, marginBottom: 10, padding: 10 },

  offlineBanner: {
  backgroundColor: 'white',
  padding: 8,
  alignItems: 'center',
},
  offlineText: { 
  color: 'black', 
  fontWeight: 'bold' 
 },

  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    margin: 12,
  },

   deleteButton: {
    backgroundColor: '#009C95',
    padding: 8, 
    borderRadius: 5, 
    paddingVertical:8, 
    alignItems:'center',
    width: 80   
  },

  deleteText:{
    color: '#fff',
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
    fontWeight:'bold'

  }

});






