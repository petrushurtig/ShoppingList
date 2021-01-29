import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

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

  return (
    <View style={styles.container}>
      <TextInput
      ref={initialFocus}
      placeholder='Product'
      onChangeText={(product) => setProduct(product)}
      value={product}
      style={{
       marginTop:30,
       fontSize: 18,
       width: 200,
       borderColor:'gray',
       borderWidth: 1}} />
       <TextInput
       ref={clear}
       placeholder='Amount'
       style={{
        marginTop: 5,
        marginBottom: 5, fontSize:18,
        width: 200,
        borderColor:'gray',
        borderWidth:1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
       />
      <View style={{flexDirection:'row'}}>
      <Button title="Add" onPress={saveItem}></Button>
      </View>
      <Text style={{marginTop: 30, fontSize:20, fontWeight: 'bold', color: 'blue'}}>Items to buy</Text>
      <FlatList 
      style={{marginLeft: '5%'}}
      keyExtractor={item => item.id.toString()}
      data={shoppinglist}
      ItemSeparatorComponent={listSeparator}
      renderItem={({item}) => <View style={styles.listContainer}><Text style={{fontSize: 20}}>{item.product}, {item.amount}</Text>
      <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> Bought</Text></View>}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
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
