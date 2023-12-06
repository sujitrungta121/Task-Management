import React, {useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Task from './Task';
import Dots from '../common/Dots';
import DotFile from './DotFile';
import filterIcon from '../assets/filter-icon.png';
import upArrow from '../assets/up-arrow.png';
import downArrow from '../assets/downArrow.png';
import NewTask from './NewTask';
import TaskNew from './TaskNew';
import InputFile from './InputFile';
import TomorrowTask from './InputFile';

const TaskDetails = ({heading, searchQuery, projects, setProjects}) => {
  const [clicked, setClicked] = useState(false);
  const [today, setToday] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const data = ['All', 'OutStanding', 'Complete'];
  const handleFilterSelection = selectedFilter => {
    setFilterType(selectedFilter);
    setClicked(false);
  };
  const project = () => {
    const projectnew = projects.filter(project => project.name === heading);
    console.log(projectnew);
    return projectnew;
  };
  const day = new Date();
  const date = day.getDate();
  const month = day.getMonth();
  const monthName = months[month - 1];
  const year = day.getFullYear();
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.date}>
              {date} {monthName} {year}
            </Text>
          </View>
          <View style={styles.subHeading}>
            <Pressable
              style={styles.filterStyle}
              onPress={() => setClicked(!clicked)}>
              <Image source={filterIcon} />
              <Text>Filters</Text>
            </Pressable>
            <Dots />
            <View style={styles.dotContainer}>
              {clicked && (
                <DotFile
                  data={data}
                  style={styles.dotContainer}
                  onClick={handleFilterSelection}
                />
              )}
            </View>
          </View>
        </View>
        <View style={styles.listItem}>
          <TaskNew
            heading={heading}
            filterType={filterType}
            searchQuery={searchQuery}
            projects={projects}
            setProjects={setProjects}
          />
        </View>
      </View>
      <Pressable
        style={styles.viewTodayButton}
        onPress={() => {
          setToday(!today);
          console.log(today);
        }}>
        <Text style={{color: 'white'}}>
          {today ? 'View Today' : 'View Tomorrow'}
        </Text>
        <Image source={today ? upArrow : downArrow} />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    padding: 15,
    rowGap: 30,
  },
  headerSection: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'column',
    display: 'flex',
    rowGap: 10,
  },
  heading: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    marginRight: 10,
  },
  date: {
    fontSize: 15,
  },
  subHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  filterStyle: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CFD8E4',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginRight: 10,
  },
  dotContainer: {
    zIndex: 5,
    position: 'absolute',
    top: 30,
    right: 5,
  },
  listItem: {
    paddingTop: 10,
    // height: '100%',
  },
  viewTodayButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0080FC',
    borderRadius: 24,
    columnGap: 10,
    padding: 12,
    marginHorizontal: 20,
    marginVertical: 10,
    width: '40%',
    position: 'absolute',
    bottom: '1%',
    alignSelf: 'center',
  },
});

export default TaskDetails;
