import React from 'react';
import { StyleSheet, Text, View , TouchableOpacity, Image, TextInput,ToastAndroid, Alert} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import MyHeader from '../MyHeader';
import db from '../config'
import firebase from 'firebase'

export default class TransitScreen extends React.Component{
constructor(){
super();
this.state={
hasCameraPermissions:null,
scanned:false,
scannedBookId:"",
scannedStudentId:"",
buttonState:'normal'
}
}

getCamerPermission=async(Id)=>{
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  this.setState({
  hasCameraPermissions:status==='granted',buttonState:Id,scanned:false
  })
}
handleBarCodeScanned=({type,data})=>{
if(this.state.buttonState==="Book Id"){
  this.setState({scanned:true,
    scannedBookId:data,buttonState:"normal"})
}
if(this.state.buttonState==="Student Id"){
  this.setState({scanned:true,
    scannedStudentId:data,buttonState:"normal"})
}

}

checkBookEligibility=async()=>{
const BookRef=await db.collection("Books").where("bookId","==",this.state.scannedBookId).get()
var transactionType=""
if(BookRef.docs.length==0){transactionType=false}
else{
BookRef.docs.map(doc=>{
var book=doc.data()
if(book.bookAvailability){
transactionType="Issue"
}else{
transactionType="Return"
}

})
}
return transactionType
}

checkStudentEligibilityforIssue=async()=>{
  const StudentRef=await db.collection("Students").where("studentId","==",this.state.scannedStudentId).get()
  var isStudentEligible=""
  if(StudentRef.docs.length==0){isStudentEligible=false;
  alert("Student Id Does Not Exist")
this.setState({
scannedBookId:"",
scannedStudentId:""
})
}
else{
StudentRef.docs.map(doc=>{var student=doc.data()
if(student.booksIssued>2){
isStudentEligible=false
alert("Student Has Issued 2 Books")
this.setState({
scannedBookId:"",
scannedStudentId:""
})
}else{
isStudentEligible=true
}

})
}
return isStudentEligible
}


checkStudentEligibilityforReturn=async()=>{
  const TransactionRef=await db.collection("Transaction").where("bookId","==",this.state.scannedBookId).limit(1).get();
  var isStudentEligible="";
  TransactionRef.docs.map(doc=>{var lasttransit=doc.data()
  if(lasttransit.StudentId===this.state.scannedStudentId){
  isStudentEligible=true
  }else{isStudentEligible=false;
    alert("Student Id Does Not Match")
    this.setState({
      scannedBookId:"",
      scannedStudentId:""
      })
  }}
  )
  return isStudentEligible
}



handleTransit=async()=>{
  var transactionType=await this.checkBookEligibility();
  if(!transactionType){
  alert("The book id does not exist");
  this.setState({
    scannedBookId:"",
    scannedStudentId:""
  })
  }
  if(transactionType==="Issue"){
   var isStudentEligible=await this.checkStudentEligibilityforIssue();
   if(isStudentEligible){
     this.initiateBookIssue();
     alert("Book has been issued")
   }
  }else if(transactionType==="Return"){
    var isStudentEligible=await this.checkStudentEligibilityforReturn();
    if(isStudentEligible){
      this.initiateBookReturn();
      alert("Book has been returned")
    } 
  }
}

initiateBookIssue=async()=>{
await db.collection("Transaction").add({
"BookId": this.state.scannedBookId,
"StudentId":this.state.scannedStudentId,
"Date":firebase.firestore.Timestamp.now().toDate(),
"Message":'issue'
})
await db.collection("Books").doc(this.state.scannedBookId).update({
"bookAvailability": false
})
await db.collection("Students").doc(this.state.scannedStudentId).update({
"booksIssued":firebase.firestore.FieldValue.increment(1)
})
this.setState({
scannedBookId:"",
scannedStudentId:""
})

}

initiateBookReturn=async()=>{
await db.collection("Transaction").add({
"BookId": this.state.scannedBookId,
"StudentId":this.state.scannedStudentId,
"Date":firebase.firestore.Timestamp.now().toDate(),
"Message":'return'
})
await db.collection("Books").doc(this.state.scannedBookId).update({
"bookAvailability": true
})
await db.collection("Students").doc(this.state.scannedStudentId).update({
"booksIssued":firebase.firestore.FieldValue.increment(-1)
})
this.setState({
scannedBookId:"",
scannedStudentId:""
})

} 


  render(){
    if(this.state.buttonState!=="normal" && this.state.hasCameraPermissions){
    return(<BarCodeScanner
      onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />)
    }else{return (
      <View style={{alignItems:'center',justifyContent:'center', marginTop:100}} >
      <MyHeader/>


     <TextInput 
     onChangeText={(text)=>{
       this.setState({
         scannedBookId:text
       })
     }}
     placeholder=" Book Id"
     style={{marginTop:50,borderWidth:2,borderColor:'black',borderRadius:5,width:350,height:50}}
     value={this.state.scannedBookId}
     />

      <TouchableOpacity style={{marginTop:-50,marginLeft:170,borderWidth:2,borderColor:'black',borderRadius:5,width:180,height:50,alignItems:'center',justifyContent:'center',
    backgroundColor:'yellow'}} onPress={()=>{this.getCamerPermission("Book Id")}}>
      <Text>SCAN QR CODE</Text>
      </TouchableOpacity>
     
      <TextInput
      onChangeText={(text)=>{
        this.setState({
          scannedStudentId:text
        })
      }}
      placeholder=" Student Id"
      style={{marginTop:50,borderWidth:2,borderColor:'black',borderRadius:5,width:350,height:50}}
      value={this.state.scannedStudentId}
      />

      <TouchableOpacity style={{marginTop:-50,marginLeft:170,borderWidth:2,borderColor:'black',
      borderRadius:5,width:180,height:50,alignItems:'center',justifyContent:'center',
    backgroundColor:'yellow'}} onPress={()=>{this.getCamerPermission("Student Id")}}>
      <Text>SCAN QR CODE</Text>
      </TouchableOpacity>

<TouchableOpacity style={{marginTop:50,borderWidth:2,borderColor:'black',borderRadius:5,width:180,height:50,alignItems:'center',justifyContent:'center',
    backgroundColor:'yellow'}} onPress={()=>{this.handleTransit()}}><Text>SUBMIT</Text></TouchableOpacity>


      </View>
    );}
  }
 
}