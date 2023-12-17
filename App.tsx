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
  const [id,setId]=useState();
 

  useEffect(() => {
    const fetchData = async () => {
      console.log(id);
      try {
        const response = await axios.get(
          `https://todo-backend-daem.vercel.app/get-all-todos/${id}`,
        ); 
       
        setApiData(response.data.todo);
        // console.log("this is in the app side",response.data.todo); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          options={{headerShown: false}}
          component={props => (
            <LoginScreen
              {...props}
             setId={setId}
              navigation={props.navigation}
            />
          )}
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
              id={id}
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
              id={id}
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
