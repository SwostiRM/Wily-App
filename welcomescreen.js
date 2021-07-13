import React from 'react';
import { StyleSheet, Text, View,TextInput, Alert ,TouchableOpacity} from 'react-native';
import firebase from "firebase"
import MyHeader from '../MyHeader';

export default class WelcomeScreen extends React.Component{
constructor(){
super()
this.state={
id:"",
password:""
}
}
logIn=async(id,password)=>{
if(id && password){
try{
const response= await firebase.auth().signInWithEmailAndPassword(id,password)
if(response){
this.props.navigation.navigate("TRANSIT")
}
}
catch(error){
switch(error.code){
case "auth/user-not-found":
Alert.alert("User is not found")
break
case "auth/invalid-user":
Alert.alert("Your Email id or Password is wrong")
break
}
}
}else{
Alert.alert("Please enter your Email id and Password to proceed")
}
}
  render(){
    return (
      <View style={{alignItems:'center', justifyContent:'center'}}>
      <MyHeader/>
   <TextInput
      onChangeText={(text)=>{
        this.setState({
          id:text
        })
      }}
      placeholder="Enter Email"
      style={{marginTop:50,borderWidth:2,borderColor:'black',borderRadius:5,width:350,height:50}}
      />
      <TextInput
      onChangeText={(text)=>{
        this.setState({
        password:text
        })
      }}
      placeholder="Enter Password"
      secureTextEntry={true}
      style={{marginTop:50,borderWidth:2,borderColor:'black',borderRadius:5,width:350,height:50}}
      />
       <TouchableOpacity style={{marginTop:10,borderWidth:2,borderColor:'black',
      borderRadius:5,width:180,height:50,alignItems:'center',justifyContent:'center',
    backgroundColor:'yellow'}} onPress={()=>{this.logIn(this.state.id,  this.state.password)}}>
      <Text>LOG IN</Text>
      </TouchableOpacity>
      </View>
    );
  }
  
}