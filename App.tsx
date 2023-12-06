import React, {useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Main from './src/components/main';
import Projects from './src/components/Projects';
import LoginScreen from './src/components/Login';
import SignupScreen from './src/components/SignUp';

const Stack = createNativeStackNavigator();

const App = () => {
  const specifiedDate=new Date();
  const [projects, setProjects] = useState([
    {
      name: 'Solar Project',
     todayTasks: [
        {
          id: 1,
          isChecked: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 1',
         
        },
        {
          id: 2,
          isChecked: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 2',
         
        },
        {
          id: 3,
          isChecked: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 3',
          
        },
        
      ],
      tomorrowTasks: [
        {
          id: 1,
          checkedIs: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 1',
         
        },
        {
          id: 2,
          checkedIs: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 2',
         
        },
        {
          id: 3,
          checkedIs: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 3',
          
        },
        
      ],
    
    },
    {
      name: 'Personal Project',
     todayTasks: [
        {
          id: 1,
          isChecked: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 1',
        
        },
        {
          id: 2,
          isChecked: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 2',
        
        },
        {
          id: 3,
          isChecked: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 3',
       
        },
        
      ],
      tomorrowTasks: [
        {
          id: 1,
          checkedIs: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 1',
         
        },
        {
          id: 2,
          checkedIs: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 2',
         
        },
        {
          id: 3,
          checkedIs: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 3',
          
        },
        
      ],
    
    },
    {
      name: 'My Project',
     todayTasks: [
        {
          id: 1,
          isChecked: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Sujit',
        
        },

        {
          id: 2,
          isChecked: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 2',

        },
        {
          id: 3,
          isChecked: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 3',
        },
        
      ],
      tomorrowTasks: [
        {
          id: 1,
          checkedIs: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 1',
         
        },
        {
          id: 2,
          checkedIs: false,
          isHighLight:false,
         dueDate: specifiedDate,
          task: 'Task 2',
         
        },
        // {
        //   id: 3,
        //   isChecked: false,
        //   isHighLight:false,
        //  dueDate: specifiedDate,
        //   task: 'Task 3',
          
        // },
        
      ],
    
    },
  ]);
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
              projects={projects}
              setProjects={setProjects}
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
              projects={projects}
              setProjects={setProjects}
              navigation={props.navigation}
            />
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
