import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';
import EntryPoint from './EntryPoint';
import GLOBAL from './global'

const Stack = createStackNavigator();

const App = () => {const [user, setUser] = useState({})

GLOBAL.userID = this;
GLOBAL.firstContactArr = this;
GLOBAL.secondContactArr = this;
GLOBAL.thirdContactArr = this;
var doPut = false;

useEffect(() => {
    GoogleSignin.configure({
      webClientId: '391210473174-j4bfvv60i9tgfaf1njmg5ud92rvtdbmt.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    });
    isSignedIn()}, [])
    const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo)
      //enter here a find email request
      const email = userInfo.user.email;
      const lastName = userInfo.user.familyName;
      const firstName = userInfo.user.givenName;
      console.log("user id:" + userInfo.user.id)
      
      console.log(email);
      console.log(lastName);
      console.log(firstName);
      //change to email 
      const request = 'http://charlieserver.eastus.cloudapp.azure.com/user/findByQuery?email='.concat(email);
      fetch(request, {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((data) => {
        
        if((data || []).length === 0){
          doPut = true;
          if (doPut){
            var send = {"firstName" :firstName,
                        "lastName"  :lastName,
                        "email"     :email
          }
            //data.firstName = firstName;
            //data.lastName = lastName;
            //data.email = email;
            console.log("We put");
            const request2 = 'http://charlieserver.eastus.cloudapp.azure.com/user/newUser';
            fetch(request2, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(send),
            })
            .then((response) => response.json())
            .then((data) => {
              console.log('Success put:', data); 
              GLOBAL.userID = data._id;
            })
            .catch((error) => {
              console.error('Error put:', error);
            });
           
        }
        }else{
          GLOBAL.userID = data[0]._id;
          console.log("mongo id: " + GLOBAL.userID);
        }
        console.log('Success get: ' + data + " DoPut: " + doPut);
      })
      .catch((error) => {
        console.error('Error get:', error);
      });

      console.log("Put?: " + doPut);

      //enter here put request


    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };
  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!!isSignedIn) {
      getCurrentUserInfo()
    } else {
      console.log('Please Login')
    }
  };
  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      setUser(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser({}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };// signOut()
  return (
    <View style={styles.main}>
      {!user.idToken ? 
        <GoogleSigninButton 
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        /> :  
        <EntryPoint></EntryPoint>
      //   <TouchableOpacity onPress={signOut}>
      //     <Text>Logout</Text>
      //   </TouchableOpacity>
      // 
    }

    </View>
  )
}
  const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default App;