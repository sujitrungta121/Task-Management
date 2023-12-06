import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import Dots from '../common/Dots';
import DotFile from './DotFile';
import InputFile from './InputFile';

const TomorrowTask = ({
  projects,
  setProjects,
  heading,
  filterType,
  searchQuery,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [inputText, setInputText] = useState('');
  const [clicked, setClicked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openedDotFileIndex, setOpenedDotFileIndex] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [highlightedTaskId, setHighlightedTaskId] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const data = ['Move to Tomorrow', 'Highlights', 'Edit', 'Delete'];

  const handleInputChange = text => {
    setInputText(text);
  };

  const handleAddTask = () => {
    if (inputText.trim()) {
      const newTask = {
        id: Date.now(),
        task: inputText,
        isChecked: false,
        dueDate: today, // Set the due date to tomorrow
      };

      const updatedProjects = [...projects];
      const projectIndex = updatedProjects.findIndex(
        project => project.name === heading,
      );
      if (projectIndex !== -1) {
        // Check if the task already exists before adding it
        const taskExists = updatedProjects[projectIndex].todayTasks.some(
          task =>
            task.task === newTask.task && task.dueDate === newTask.dueDate,
        );

        if (!taskExists) {
          updatedProjects[projectIndex].todayTasks.push(newTask);
          setProjects(updatedProjects);
          setInputText('');
        } else {
          console.log('Task already exists!');
        }
      }
    } else {
      setIsChecked(!isChecked);
    }
  };

  const handleCheckBoxClick = (projectId, taskId) => {
    const updatedProjects = [...projects];
    const projectIndex = updatedProjects.findIndex(
      project => project.name === projectId,
    );
    if (
      projectIndex !== -1 &&
      updatedProjects[projectIndex].todayTasks &&
      updatedProjects[projectIndex].todayTasks.length > 0
    ) {
      const updatedTasks = [...updatedProjects[projectIndex].todayTasks];
      const taskIndex = updatedTasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex].isChecked = !updatedTasks[taskIndex].isChecked;
        updatedProjects[projectIndex].todayTasks = updatedTasks;
        setProjects(updatedProjects);
      }
    }
  };

  const handleFileVisible = () => {
    setClicked(false);
  };
  const handleDotClick = index => {
    setOpenedDotFileIndex(index);
    setClicked(!clicked);
  };

  const handleFilterSelection = (filter, index) => {
    if (filter === 'Edit') {
      setEditTaskId(index);
      setInputText(filteredTasks.find(task => task.id === index).task);
      handleFileVisible(false);
    } else if (filter === 'Delete') {
      const taskToDelete = filteredTasks.find(task => task.id === index);
      if (taskToDelete) {
        handleDeleteTask(project.name, taskToDelete.id);
      }
    } else if (filter === 'Highlights') {
      if (!highlightedTaskId.includes(index)) {
        setHighlightedTaskId([...highlightedTaskId, index]);
        handleFileVisible(false);
      } else if (highlightedTaskId.includes(index)) {
        const updatedState = highlightedTaskId.filter(id => id !== index);
        setHighlightedTaskId(updatedState);
        handleFileVisible(false);
      }
    } else if (filter === 'Move to Tomorrow') {
      console.log('move to tomorrow');
      handleFileVisible(false);
    }
  };
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // projects.forEach(project => {
  //   project.tasks.forEach(task => {
  //     if (task.dueDate.toDateString() === today.toDateString()) {
  //       project.tasks.push(task);
  //     } else if (task.dueDate.toDateString() === tomorrow.toDateString()) {
  //       project.tomorrowTasks.push(task);
  //     }
  //   });
  // });
  const project = projects.find(project => project.name === heading);

  useEffect(() => {
    const filterTasks = () => {
      let tasks = [];

      if (filterType === 'Complete') {
        console.log('complete is clicked');
        tasks = projects.reduce((accumulator, project) => {
          const tasksWithChecked = project.todayTasks.filter(
            task => task.isChecked,
          );
          accumulator.push(...tasksWithChecked);
          return accumulator;
        }, []);
      } else if (filterType === 'OutStanding') {
        tasks = project.todayTasks.filter(task =>
          highlightedTaskId.includes(task.id),
        );
      } else {
        tasks = project.todayTasks;
      }

      return tasks;
    };

    const filtered = filterTasks();
    setFilteredTasks(filtered);
  }, [projects, filterType, searchQuery, highlightedTaskId]);

  const handleUpdateTask = () => {
    if (inputText.trim() && editTaskId !== null) {
      const updatedProjects = projects.map(project => {
        if (project.name === heading) {
          const updatedTasks = project.todayTasks.map(task => {
            if (task.id === editTaskId) {
              return {...task, task: inputText};
            }
            return task;
          });
          return {...project, todayTasks: updatedTasks};
        }
        return project;
      });

      setProjects(updatedProjects);
      setInputText('');
      setEditTaskId(null);
    }
  };

  const handleDeleteTask = (projectId, taskId) => {
    const updatedProjects = projects.map(project => {
      if (project.name === projectId) {
        const updatedTasks = project.todayTasks.filter(
          task => task.id !== taskId,
        );
        return {...project, todayTasks: updatedTasks};
      }
      return project;
    });

    setProjects(updatedProjects);
  };

  return (
    <View style={{height: '100%', maxHeight: 900}}>
      {/* <View style={styles.inputBox}>
        <View style={styles.firstBody}>
          <TouchableOpacity
            onPress={() => handleAddTask()}
            accessible={true}
            accessibilityRole={'checkbox'}
            accessibilityState={{checked: checked}}>
            <View style={[styles.checkBox, checked && styles.checkedBox]}>
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
      </View> */}

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={({item}) => (
          <View
            style={[
              styles.tasksContainer,
              highlightedTaskId.includes(item.id) &&
                styles.highlightedTaskContainer,
            ]}>
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                columnGap: 20,
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={() => handleCheckBoxClick(project.name, item.id)}>
              <View
                style={[styles.checkBox, item.isChecked && styles.checkedBox]}>
                {item.isChecked && <Text style={styles.tick}>&#10003;</Text>}
              </View>
              {!editTaskId || editTaskId !== item.id ? (
                <Text
                  style={[
                    styles.taskText,
                    item.isChecked && styles.lineThrough,
                  ]}>
                  {item.task}
                </Text>
              ) : (
                <TextInput
                  style={styles.editInput}
                  value={inputText}
                  onChangeText={handleInputChange}
                  onBlur={handleUpdateTask}
                />
              )}
            </TouchableOpacity>

            <Pressable onPress={() => handleDotClick(item.id)}>
              <Dots />
            </Pressable>

            {clicked && openedDotFileIndex === item.id && (
              <View style={styles.dotFileContainer}>
                <DotFile
                  data={data}
                  onClick={filter => handleFilterSelection(filter, item.id)}
                />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default TomorrowTask;
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
    zIndex: 1,
    opacity: 1,
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
    top: '100%',
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    zIndex: 20,
    width: '50%',
    padding: 8,
    // height: '100%',
  },
  tasksContainer: {
    // position: 'relative',
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FFF',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    zIndex: 1,
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
