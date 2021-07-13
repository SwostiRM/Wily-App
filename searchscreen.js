import React from 'react';
import { StyleSheet, Text, View,FlatList ,TextInput,TouchableOpacity} from 'react-native';
import db from '../config'
export default class SearchScreen extends React.Component{
  constructor(){
  super()
  this.state={
  allTransactions:[],
  search:"",
  lastVisibleTransit:null
  }
  }

fetchMoreTransactions=async()=>{
var searchWord=this.state.search.toUpperCase()
var Alphabet1=searchWord.split("")[0]
if(Alphabet1==="B"){
var query=await db.collection("Transaction").where("BookId","==",searchWord).startAfter(this.state.lastVisibleTransit).limit(10).get()
query.docs.map(doc=>{
this.setState({
allTransactions:[...this.state.allTransactions,doc.data()],
lastVisibleTransit:doc
})
})
}else if(Alphabet1==="S"){
  var query=await db.collection("Transaction").where("StudentId","==",searchWord).startAfter(this.state.lastVisibleTransit).limit(10).get()
  query.docs.map(doc=>{
  this.setState({
  allTransactions:[...this.state.allTransactions,doc.data()],
  lastVisibleTransit:doc
  })
  })
}
}







searchTransactions=async(search)=>{
var searchWord=search.toUpperCase()
var Alphabet1=searchWord.split("")[0]
if(Alphabet1==="B"){
var query=await db.collection("Transaction").where("BookId","==",searchWord).limit(10).get()
query.docs.map(doc=>{
this.setState({
allTransactions:[...this.state.allTransactions,doc.data()],
lastVisibleTransit:doc
})
})
}else if(Alphabet1==="S"){
  var query=await db.collection("Transaction").where("StudentId","==",searchWord).limit(10).get()
  query.docs.map(doc=>{
  this.setState({
  allTransactions:[...this.state.allTransactions,doc.data()],
  lastVisibleTransit:doc
  })
  })
}
}

  render(){
    return (
      <View>
      <TextInput
      onChangeText={(text)=>{
        this.setState({
         search:text
        })
      }}
      placeholder="Search for Books or Students"
      style={{marginTop:50,borderWidth:2,borderColor:'black',borderRadius:5,width:350,height:50}}
    />
    <TouchableOpacity style={{marginTop:10,borderWidth:2,borderColor:'black',
      borderRadius:5,width:180,height:50,alignItems:'center',justifyContent:'center',
    backgroundColor:'yellow'}} onPress={()=>{this.searchTransactions(this.state.search)}}>
      <Text>SEARCH</Text>
      </TouchableOpacity>
      <FlatList
        data={this.state.allTransactions}
        renderItem={({item})=>{
         return(
           <View style={{borderBottomWidth:2}}>
           <Text>{"Book Id : "+item.BookId } </Text>
           <Text>{"Student Id : "+item.StudentId } </Text>
           <Text>{"Date : "+item.Date.toDate() } </Text>
           <Text>{"Transaction Type : "+item.Message}</Text>
           </View>
         )
        }}
        keyExtractor={(item,index) => index.toString()}
        onEndReached={this.fetchMoreTransactions}
        onEndReachedThreshold={0.7}
        
      />


      
      </View>
    );
  }
  
}