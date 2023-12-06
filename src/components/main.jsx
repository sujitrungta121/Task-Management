import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Navbar from './Navbar';
import TaskDetails from './TaskDetails';
import Task from './Task';

const Main = ({navigation, route, projects, setProjects}) => {
  const {projectName} = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <SafeAreaView style={{height: '100%'}}>
      <Navbar
        projects={projects}
        navigation={navigation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <TaskDetails
        heading={projectName}
        SearchQuery={searchQuery}
        projects={projects}
        setProjects={setProjects}
      />
    </SafeAreaView>
  );
};
export default Main;
