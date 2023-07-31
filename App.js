import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert} from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from './color'
import { useState,useEffect } from 'react';

const STORAGE_KEY = "@toDos";
const STORAGE_SECTION = "@section";

export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText]= useState('');
  const [updateText , setUpdateText] = useState('');
  const [toDos , setToDos] = useState({});
  const trabel = async() => {
    setWorking(false);
    await AsyncStorage.setItem(STORAGE_SECTION, 'false');
  }
  const work = async() => {
    setWorking(true);
    await AsyncStorage.setItem(STORAGE_SECTION, 'true');
  }
  const setWork = async() => {
    const Stroageworking = await AsyncStorage.getItem(STORAGE_SECTION);
    Stroageworking === 'true' ? setWorking(true) : setWorking(false);
  }
  useEffect(()=>{setWork();},[])

  const onChangeText = (payload) => setText(payload);
  const onChangeUpdateText = (payload) => setUpdateText(payload)

  const saveToDos = async(toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave))
  }

  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    setToDos(JSON.parse(s)); 
  }
  useEffect(()=>{loadToDos();}
  ,[])

  const addTodo = async() => {
    if(text === ""){
      return
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: {text, work: working, completed: false, updated: false}
    }
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText('');
  }
  const updateArea = (id,text) => {
    const newToDos = {
      ...toDos,
      [id]: {
        ...toDos[id],
        updated: !toDos[id].updated,
      }
    }
    setUpdateText(text);
    setToDos(newToDos);
    saveToDos(newToDos);
    console.log(newToDos);
  }
  const updateTodo = async(id) => {
    if(updateText ===""){
      return
    }
    const newToDos = {
      ...toDos,
      [id]: {
        ...toDos[id],
        text: updateText,
        updated: false
      }
    }
    setToDos(newToDos);
    saveToDos(newToDos);
    setUpdateText('');
  }
  const deleteTodo = async(id) => {
    Alert.alert("Delete To do","Are You Sure?",[
      {text: "cancel"},
      {text: "i'm sure", onPress: () => {
        const newToDos = {
          ...toDos
        };
        delete newToDos[id];
        setToDos(newToDos);
        saveToDos(newToDos);
      }}
    ]);
    return
  }
  const completedTodo = (id) => {
    const newToDos = {
      ...toDos,
      [id]: {
        ...toDos[id],
        completed: !toDos[id].completed
      }
    }
    setToDos(newToDos);
    saveToDos(newToDos);
  }
  return (
    <View style={styles.container}>
      <StatusBar style='auto'/>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.gray}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={trabel}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.gray}}>Travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput 
          onSubmitEditing={addTodo}
          onChangeText={onChangeText}
          returnKeyType='done'
          value={text}
          placeholder={working ? "Add a To Do" : "where do you want a go?"}
          style={styles.input}/>
        <ScrollView>
          {
            Object.keys(toDos).map((key) =>
              toDos[key].work === working ? (
                <View key={key} style={styles.todo}>
                  {
                    toDos[key].updated ?
                    <TextInput
                      onSubmitEditing={()=>updateTodo(key)}
                      onChangeText={onChangeUpdateText}
                      returnKeyType='done'
                      value={updateText}
                      style={styles.input}
                    />
                    :
                    <Text style={toDos[key].completed ? styles.todoCompletedText : styles.todoText}>{toDos[key].text}</Text>
                  }
                  <View style={styles.todoTextList}>
                    <TouchableOpacity>
                      <Text style={styles.todoText} onPress={()=>completedTodo(key)}>완료</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={styles.todoText} onPress={()=>updateArea(key,toDos[key].text)}>수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> deleteTodo(key)}>
                      <Fontisto name="trash" size={18} color="white"></Fontisto>
                    </TouchableOpacity>
                  </View>
                </View> ): null
              )
          }
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100
  },
  btnText: {
    fontSize: 44,
    fontWeight: '600'
  },
  input:{
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18
  },
  todo: {
    backgroundColor: theme.todoBg,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  todoTextList:{
    flexDirection: 'row',
    gap: 8
  },
  todoCompletedText:{
    color: 'gray',
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: 'line-through'
  },
  todoText:{
    color: 'white',
    fontSize: 16,
    fontWeight: "500"
  }
});
