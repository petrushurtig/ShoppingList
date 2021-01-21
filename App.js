import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';

export default function App() {
  const [data, setData] = useState([]);
  const [text, setText] = useState();
  const add = () => {
    setData([...data, {key: text}]);
    setText();
  }
  const clear = () => {
    setData([])
  }
  return (
    <View style={styles.container}>
      <TextInput
      onChangeText={text => setText(text)}
      value={text}
      style={{
        width: 200, 
        height:45, 
        margin: 20, 
        borderColor: 'black', 
        borderWidth:1}} />
      <View style={{flexDirection:'row'}}>
      <Button title="Add" onPress={add}></Button>
      <Button title="Clear" onPress={clear}></Button>
      </View>
      <Text style={{marginTop: 30, fontSize:20, fontWeight: 'bold', color: 'blue'}}>Shopping List</Text>
      <FlatList data={data} renderItem={({item}) => <Text>{item.key}</Text>}/>
    
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
});
