import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native';
import Dots from '../common/Dots';
import DotFile from './DotFile';

const Task = ({filterType, searchQuery, projects, setProjects, heading}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [inputText, setInputText] = useState('');
  // const [tasks, setTasks] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [openedDotFileIndex, setOpenedDotFileIndex] = useState(null);

  // Initialize isHighlighted state based on the tasks length
  const [isHighlighted, setIsHighlighted] = useState(
    Array(tasksLength).fill(false),
  );
  const tasksLength = projects.reduce(
    (total, project) => total + project.tasks.length,
    0,
  );
  const [outstandingTasks, setOutstandingTasks] = useState([]);
  const data = ['Move to Tomorrow', 'Highlights', 'Edit', 'Delete'];
  const handleCheckBoxClick = index => {
    if (index === -1) {
      if (inputText.trim()) {
        const newTask = {
          task: inputText,
          isChecked: false,
          dueDate: getTodayDate(),
        };
        // Find the project you want to add the task to (e.g., by heading)
        const projectIndex = projects.findIndex(
          project => project.name === heading,
        );
        if (projectIndex !== -1) {
          const updatedProjects = [...projects];
          updatedProjects[projectIndex].tasks.push(newTask);
          setProjects(updatedProjects);
          setInputText('');
        }
      } else {
        setIsChecked(!isChecked);
      }
    } else {
      const updatedProjects = [...projects];
      const projectIndex = updatedProjects.findIndex(
        project => project.name === heading,
      );
      if (projectIndex !== -1) {
        const updatedTasks = [...updatedProjects[projectIndex].tasks];
        updatedTasks[index].isChecked = !updatedTasks[index].isChecked;
        updatedProjects[projectIndex].tasks = updatedTasks;
        setProjects(updatedProjects);
      }
    }
  };

  const handleInputChange = text => {
    setInputText(text);
  };

  const handleDotClick = index => {
    setOpenedDotFileIndex(index);
    setClicked(!clicked);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // const categorizeTasks = () => {
  //   const today = getTodayDate();
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   const tomorrowDate = tomorrow.toISOString().split('T')[0];

  //   const todayTasks = [];
  //   const tomorrowTasks = [];
  //   projects.map(project =>
  //     project.tasks.map(taskItem => {
  //       const taskDueDate = taskItem.dueDate;
  //       if (taskDueDate === today) {
  //         todayTasks.push(taskItem);
  //       } else if (taskDueDate === tomorrowDate) {
  //         tomorrowTasks.push(taskItem);
  //       }
  //     }),
  //   );

  //   return {todayTasks, tomorrowTasks};
  // };
  const handleHighlight = index => {
    const updatedHighlights = [...isHighlighted];
    updatedHighlights[index] = !updatedHighlights[index];
    setIsHighlighted(updatedHighlights);
  };

  // const {todayTasks, tomorrowTasks} = categorizeTasks();

  const filterTasks = () => {
    const project = projects.find(project => project.name === heading);
    console.log;
    if (!project) {
      return []; // or handle the case when project is not found
    }

    if (filterType === 'Complete') {
      return project.tasks.filter(task => task.isChecked);
    } else if (filterType === 'Outstanding') {
      return outstandingTasks; // Make sure outstandingTasks is properly defined
    }
    console.log(project.tasks);
    // return project.tasks || []; // Return tasks or an empty array if tasks are undefined
  };
  const handleFileVisible = () => {
    setClicked(false);
  };
  const filteredTask = filterTasks();
  const handleFilterSelection = (filter, index) => {
    if (filter === 'Edit') {
      handleEditTask(index);
    } else if (filter === 'Delete') {
      handleDeleteTask(index);
    } else if (filter === 'Highlights') {
      handleHighlight(index);
    } else if (filter === 'Move to Tomorrow') {
      tomorrowTasks.push(projects.tasks[index]);
      const updatedTasks = [...projects.tasks];
      updatedTasks.splice(index, 1);
      // setTasks(updatedTasks);
      setProjects({...projects.tasks, updatedTasks});
    }

    handleFileVisible();
  };

  const handleEditTask = index => {
    const updatedTasks = [...projects.tasks];
    const taskToEdit = updatedTasks[index];
    setInputText(taskToEdit.task);
    setProjects(updatedTasks.filter((_, i) => i !== index));
    setOpenedDotFileIndex(null);
  };

  const handleDeleteTask = index => {
    const updatedTasks = [...projects.tasks];
    updatedTasks.splice(index, 1);
    setProjects({...projects.tasks, updatedTasks});
    setOpenedDotFileIndex(null);
  };

  return (
    <View style={{height: '100%', maxHeight: 900}}>
      <View style={styles.inputBox}>
        <View style={styles.firstBody}>
          <TouchableOpacity
            onPress={() => handleCheckBoxClick(-1)}
            accessible={true}
            accessibilityRole={'checkbox'}
            accessibilityState={{checked: isChecked}}>
            <View style={[styles.checkBox, isChecked && styles.checkedBox]}>
              {isChecked && <Text style={styles.tick}>&#10003;</Text>}
            </View>
          </TouchableOpacity>

          <TextInput
            style={[styles.box, isChecked ? styles.text : null]}
            placeholder="Add New Task..."
            onChangeText={handleInputChange}
            value={inputText}
          />
        </View>
      </View>
      <ScrollView
        style={{
          rowGap: 10,
          overflow: 'scroll',
        }}>
        {filteredTask.map((item, index) => (
          <>
            <View
              key={index}
              style={[
                styles.tasksContainer,
                isHighlighted[index] ? styles.highlightedTaskContainer : null,
              ]}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: 20,
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={() => handleCheckBoxClick(index)}>
                  <View
                    style={[
                      styles.checkBox,
                      item.isChecked && styles.checkedBox,
                    ]}>
                    {item.isChecked && (
                      <Text style={styles.tick}>&#10003;</Text>
                    )}
                  </View>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.taskText,
                    item.isChecked && styles.lineThrough,
                  ]}>
                  {item.task}
                </Text>
              </View>
              <Pressable
                style={{position: 'relative'}}
                onPress={() => handleDotClick(index)}>
                <Dots />
              </Pressable>
            </View>
            {clicked && openedDotFileIndex === index && (
              <View style={styles.dotFileContainer}>
                <DotFile
                  data={data}
                  onClick={filter => handleFilterSelection(filter, index)}
                />
              </View>
            )}
          </>
        ))}
        {/* <View>
          <Text>Tomorrow's task</Text>
        </View> */}
        {/* {tomorrowTasks.map((item, index) => (
          <>
            <View
              key={index}
              style={[
                styles.tasksContainer,
                isHighlighted[index] ? styles.highlightedTaskContainer : null,
              ]}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: 20,
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={() => handleCheckBoxClick(index)}>
                  <View
                    style={[
                      styles.checkBox,
                      item.isChecked && styles.checkedBox,
                    ]}>
                    {item.isChecked && (
                      <Text style={styles.tick}>&#10003;</Text>
                    )}
                  </View>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.taskText,
                    item.isChecked && styles.lineThrough,
                  ]}>
                  {item.task}
                </Text>
              </View>
              <Pressable
                style={{position: 'relative'}}
                onPress={() => handleDotClick(index)}>
                <Dots />
              </Pressable>
            </View>
            {clicked && openedDotFileIndex === index && (
              <View style={styles.dotFileContainer}>
                <DotFile
                  data={data}
                  onClick={filter => handleFilterSelection(filter, index)}
                />
              </View>
            )}
          </>
        ))} */}
      </ScrollView>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({
  inputBox: {
    width: '100%',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingLeft: 18,
    backgroundColor: '#E6E6EC',
  },
  placeholder: {
    fontStyle: 'italic',
    fontSize: 20,
  },
  firstBody: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  highlightedTaskContainer: {
    borderWidth: 1,
    borderColor: '#0080FC',
    backgroundColor: '#EBF5FF',
    borderRadius: 15,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#0080FC',
  },
  tick: {
    color: 'white',
    fontSize: 14,
  },
  text: {
    color: 'gray',
  },

  dotFileContainer: {
    position: 'absolute',
    top: 10,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    zIndex: 1,
    width: '50%',
    padding: 8,
  },
  tasksContainer: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FFF',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    marginTop: 20,

    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  taskText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
    borderRadius: 10,
    padding: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
});
