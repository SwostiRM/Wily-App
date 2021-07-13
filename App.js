import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import TransitScreen from './screens/transitscreen'
import SearchScreen from './screens/searchscreen'
import WelcomeScreen from './screens/welcomescreen'
import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'

export default class App extends React.Component{
  render(){
    return (
      <AppContainer/>
    );
  }
  
}

const TabNavigator=createBottomTabNavigator({
TRANSIT:{screen:TransitScreen},
SEARCH:{screen:SearchScreen},
},{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:()=>{
      var routeName=navigation.state.routeName;
      if(routeName==="TRANSIT"){
        return(
          <Image
          style={{width:30,height:30}}
          source={require("./assets/book.png")}
          />
        )
      }else {   return(
        <Image
        style={{width:30,height:30}}
        source={require("./assets/searchingbook.png")}
        />
      )

      }
    }
  })
}
)
const SwitchNavigator=createSwitchNavigator({
WELCOME:{screen:WelcomeScreen},
TabNavigator:{screen:TabNavigator}
})
const AppContainer=createAppContainer(SwitchNavigator)