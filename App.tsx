import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Main from './src/components/main';
import Projects from './src/components/Projects';
import LoginScreen from './src/components/Login';
import SignupScreen from './src/components/SignUp';
import axios from "axios";

const Stack = createNativeStackNavigator();

const App = () => {
  const specifiedDate=new Date();

  const [apiData, setApiData] = useState([]);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://todo-backend-daem.vercel.app/get-all-todos/6576aaae6c2e044a510b424e',
        ); 
       
        setApiData(response.data.todo);
        // console.log("this is in the app side",response.data.todo); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          options={{headerShown: false}}
          component={LoginScreen}
        />
        <Stack.Screen
          name="signup"
          options={{headerShown: false}}
          component={SignupScreen}
        />
        <Stack.Screen
          name="main"
          options={{headerShown: false}}
          component={props => (
            <Main
              {...props}
              projects={apiData}
              setProjects={setApiData}
              navigation={props.navigation}
            />
          )}
        />

        <Stack.Screen
          name="projects"
          options={{headerShown: false}}
          component={props => (
            <Projects
              {...props}
              projects={apiData}
              setProjects={setApiData}
              navigation={props.navigation}
            />
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
