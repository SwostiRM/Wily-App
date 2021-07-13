import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class MyHeader extends React.Component{
  render(){
    return (
      <SafeAreaProvider>
    <Header
placement="right"
  leftComponent={{ text: 'WIRELESS LIBRARY', style: { color: '#000',marginTop:10 } }}
  rightComponent={<Image style={{width:50, height:50}} source={require("./assets/booklogo.png")}/>}
 
  backgroundColor="yellow"
/>
      </SafeAreaProvider>
    );
  }
  
}