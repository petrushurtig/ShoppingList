import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Header, Input, Button, Icon, ListItem, ThemeProvider } from 'react-native-elements';

const db = SQLite.openDatabase('shoppinglistdb.db');

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppinglist, setShoppinglist] = useState([]);

  const initialFocus = useRef(null);
  const clear = useRef(null);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, product text, amount text);');
    }, null, updateList);
}, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppinglist (product, amount) values (?, ?);', [product, amount]);
    }, null, updateList
    )
    
  }
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) => 
      setShoppinglist(rows._array)
      );
    });
    initialFocus.current.focus();
    initialFocus.current.clear();
   clear.current.clear();
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql('delete from shoppinglist where id = ?;', [id]);
      }, null, updateList
    )
  }
  
  const listSeparator = () => {
    return (
      <View
      style={{
        height: 5,
        width: '80%',
        backgroundColor: '#fff',
        marginLeft: '10%'
      }}
      />
    );
  };
  const renderItem = ({ item }) => (
    <ListItem bottomDivider >
      <ListItem.Content >
        <ListItem.Title onLongPress={() => deleteItem(item.id)} style={{fontSize:20, fontWeight:'bold'}}>{item.product}</ListItem.Title>
        <ListItem.Subtitle style={{fontSize:17}}>{item.amount}</ListItem.Subtitle>
      </ListItem.Content>
      <Icon size={30} color="red" type='material' name='delete' onPress={() => deleteItem(item.id)} /> 
    </ListItem>
  )

  return (
    <ThemeProvider>
      <Header
      centerComponent={{text: 'SHOPPING LIST', style: {color: '#fff'} }} />
    <View style={styles.container}>
      <View style={{ margin: 20, height:30, width:'80%'}}>
        <Input
        ref={initialFocus}
        placeholder='Product'
        label='Product'
        onChangeText={(product) => setProduct(product)}
        value={product}
        />
      </View>
      <View style={{margin: 20, height:30, width:'80%'}}>
          <Input
             ref={clear}
             placeholder='Amount'
             label='Amount'
             onChangeText={(amount) => setAmount(amount)}
             value={amount}
          />
       </View>
       <View style={{ marginVertical: 20, height:40}}>
        <Button raised icon={{type:'material', name: 'add', color: 'white', size: 30,}} onPress={saveItem} />
       </View>
       
        <FlatList 
          style={{margin: '5%', width:'80%'}}
          keyExtractor={item => item.id.toString()}
          data={shoppinglist}
          ItemSeparatorComponent={listSeparator}
          renderItem = {renderItem}
         />
      <StatusBar style="auto" />
       </View>
       </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'blue',
    borderTopWidth: 1
  }
});
