import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
import Navbar from './Navbar';
import TaskDetails from './TaskDetails';

const Main = ({navigation, route, projects, setProjects}) => {
  const {projectName} = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <SafeAreaView style={{height: '100%', maxHeight: 1000}}>
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
