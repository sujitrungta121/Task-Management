import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Platform,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import Dots from '../common/Dots';

import upArrow from '../assets/up-arrow.png';
import downArrow from '../assets/downArrow.png';
import Menus from './Menu';
import {hp} from '../common/Responsive';
import TomorrowTask from './Tomorrow';
import axios from 'axios';

const TaskNew = ({
  projects,
  setProjects,
  heading,
  filterType,
  searchQuery,
  today,
  setTomorrow,
  tomorrow,
  id,
  setToday,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [inputText, setInputText] = useState('');
  const [clicked, setClicked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openedDotFileIndex, setOpenedDotFileIndex] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [changeText, setChangeText] = useState('');
  const [task, setTask] = useState([]);
  const data = ['Move to Tomorrow', 'Highlights', 'Edit', 'Delete'];

  const handleInputChange = text => {
    setInputText(text);
  };
  const todayDate = new Date();
  todayDate.setDate(todayDate.getDate());
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);

  const handleAddTask = async () => {
    console.log(todayDate.toLocaleString(), tomorrowDate.toLocaleString());
    const projectIndex = projects.findIndex(
      project => project?.todoName === heading,
    );

    const userId = projects[projectIndex]?.userId;
    const todoId = projects[projectIndex]?._id;

    if (inputText.trim()) {
      try {
        const response = await axios.post(
          'http://todo-backend-daem.vercel.app/post-task-by-todo',
          {
            userId: id,
            todoId: todoId,
            name: inputText,
            Date: today
              ? todayDate.toLocaleString()
              : tomorrowDate.toLocaleString(),
          },
        );
        const newTask = response.data.task;

        const updatedProjects = [...projects];
        updatedProjects[projectIndex].tasks.push(newTask);
        console.log('This is the new Task', response.data.task.Date);
        setProjects(updatedProjects);
        setInputText('');
      } catch (error) {
        console.log('error in adding', error);
      }
    } else {
      setIsChecked(!isChecked);
    }
  };

  const handleCheckBoxClick = (projectId, taskId, event) => {
    console.log(today, 'before clicking');
    const updatedProjects = [...projects];
    const projectIndex = updatedProjects.findIndex(
      project => project.todoName === projectId,
    );

    if (
      projectIndex !== -1 &&
      updatedProjects[projectIndex].tasks &&
      updatedProjects[projectIndex].tasks.length > 0
    ) {
      const updatedTasks = [...updatedProjects[projectIndex].tasks];
      const taskIndex = updatedTasks.findIndex(task => task?._id === taskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex].isChecked = !updatedTasks[taskIndex].isChecked;
        setProjects(updatedProjects);
      }
    }
    console.log(today, 'after clicking');
    if (!today) {
      setToday(false);
      console.log(today, tomorrow, 'after setting');
    }
  };

  const handleFileVisible = () => {
    setClicked(false);
  };
  const handleDotClick = index => {
    setOpenedDotFileIndex(index);
    setClicked(!clicked);
    setVisible(true);
  };

  const handleFilterSelection = (filter, index) => {
    if (filter === 'Edit') {
      setEditTaskId(index);
      setChangeText(filteredTasks.find(task => task?._id === index).name);
      console.log(changeText, 'This is in edit section');

      handleFileVisible(false);
    } else if (filter === 'Delete') {
      const taskToDelete = filteredTasks.find(task => task?._id === index);

      if (taskToDelete) {
        handleDeleteTask(heading, taskToDelete?._id);
      }
    } else if (filter === 'Highlights') {
      const updatedTasks = [...filteredTasks];
      const taskIndex = updatedTasks.findIndex(task => task?._id === index);

      if (taskIndex !== -1) {
        updatedTasks[taskIndex].ishighlight =
          !updatedTasks[taskIndex].ishighlight;
        setFilteredTasks(updatedTasks);
      }
      handleFileVisible(false);
    } else if (filter === 'Move to Tomorrow') {
      const taskToMove = filteredTasks.find(task => task?._id === index);
      console.log(taskToMove, 'this si teh task to move');
      if (taskToMove) {
        handleMoveToTomorrow(taskToMove, index);
      }
      handleFileVisible(false);
    }
  };

  const dateString = todayDate;
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString1 = tomorrowDate;
  const date1 = new Date(dateString);

  const year1 = date.getFullYear();
  const month1 = String(date.getMonth() + 1).padStart(2, '0');
  const day1 = String(date.getDate()).padStart(2, '0');

  const today1 = `${month}/${day}/${year}`;
  const tomorrow1 = `${month1}/${day1}/${year1}`;
  const dateStringNew = tomorrowDate;
  const dateNew = new Date(dateStringNew);

  const formattedDate =
    ('0' + (dateNew.getMonth() + 1)).slice(-2) +
    '/' +
    ('0' + dateNew.getDate()).slice(-2) +
    '/' +
    dateNew.getFullYear() +
    ', ' +
    ('0' + dateNew.getHours()).slice(-2) +
    ':' +
    ('0' + dateNew.getMinutes()).slice(-2) +
    ':' +
    ('0' + dateNew.getSeconds()).slice(-2) +
    ' ' +
    (dateNew.getHours() >= 12 ? 'PM' : 'AM');

  const project = projects.find(project => project?.todoName === heading);

  useEffect(() => {
    const filterTasks = () => {
      let tasks = [];

      if (filterType === 'Complete') {
        tasks = projects.reduce((accumulator, project) => {
          const tasksWithChecked = project?.tasks.filter(
            task => task?.isChecked,
          );
          accumulator.push(...tasksWithChecked);
          return accumulator;
        }, []);
      } else if (filterType === 'OutStanding') {
        tasks = project?.tasks.filter(task => task?.ishighlight);
      } else {
        tasks = project?.tasks;
      }

      const currentDate = new Date();
      const tomorrowDate = new Date();
      tomorrowDate.setDate(currentDate.getDate() + 1);
      const dateToCompare = today ? currentDate : tomorrowDate;
      console.log(today, 'in today tomorrow task');
      tasks = tasks.filter(task => {
        const dateString = task?.Date;

        const dateParts = dateString?.split('/');
        if (dateParts) {
          const month = parseInt(dateParts[0], 10);
          const day = parseInt(dateParts[1], 10);
          const year = parseInt(dateParts[2], 10);
          return (
            year === dateToCompare?.getFullYear() &&
            month === dateToCompare?.getMonth() + 1 &&
            day === dateToCompare?.getDate()
          );
        }
      });

      return tasks;
    };

    const filtered = filterTasks();
    setFilteredTasks(filtered);
  }, [projects, filterType, today]);

  const handleUpdateChange = text => {
    console.log(text);
    setChangeText(text);
  };

  const handleUpdateTask = async id => {
    const taskToUpdate = filteredTasks.find(task => task._id === id);
    if (!taskToUpdate) return;

    try {
      const response = await axios.patch(
        `https://todo-backend-daem.vercel.app/update-task-by-todo/${id}`,
        {
          name: changeText,
        },
      );
      const updatedProjects = projects.map(project => {
        if (project.todoName === heading) {
          const updatedTasks = project.tasks.map(task => {
            if (task._id === id) {
              return {
                ...task,
                name: changeText,
              };
            }
            return task;
          });

          return {
            ...project,
            tasks: updatedTasks,
          };
        }
        return project;
      });

      setProjects(updatedProjects);
      setEditTaskId(null);
      setInputText('');
      setChangeText('');

      console.log('Task updated successfully:', response.data);
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  const handleMoveToTomorrow = async newTask => {
    const taskId = newTask._id;
    console.log(taskId);

    try {
      const response = await axios.patch(
        `https://todo-backend-daem.vercel.app/update-task-by-todo/${taskId}`,
        {
          Date: formattedDate,
        },
      );
      console.log(response.data.updatedTask);
      const updatedTask = response.data.updatedTask;
      const updatedProjects = projects.map(project => {
        if (project.todoName === heading) {
          const updatedTasks = project.tasks.map(task => {
            if (task._id === newTask._id) {
              return {
                ...task,
                Date: formattedDate,
              };
            }
            return task;
          });

          return {
            ...project,
            tasks: updatedTasks,
          };
        }
        return project;
      });

      setProjects(updatedProjects);
      setEditTaskId(null);
      setInputText('');
      setChangeText('');

      console.log('Task moved to tomorrow:', updatedTask);
    } catch (error) {
      console.log('Error moving task to tomorrow:', error);
    }
  };

  const handleInputSubmit = () => {
    if (editTaskId !== null && inputText.trim() !== '') {
      handleUpdateTask();
    } else if (!editTaskId && inputText.trim() !== '') {
      handleAddTask();
    }
  };
  const handleDeleteTask = async (projectId, taskId) => {
    try {
      const response = await axios.delete(
        `https://todo-backend-daem.vercel.app/delete-task-by-todo/${taskId}`,
      );
      console.log(response.data);
      const updatedProjects = projects.map(project => {
        if (project.todoName === projectId) {
          const updatedTasks = project.tasks.filter(
            task => task._id !== taskId,
          );
          return {...project, tasks: updatedTasks};
        }
        return project;
      });
      const updatedFilteredTasks = filteredTasks.filter(
        task => task._id !== taskId,
      );
      setProjects(updatedProjects);
      setFilteredTasks(updatedFilteredTasks);
    } catch (error) {
      console.log('Error in Deleting', error);
    }
  };

  return (
    <View
      style={{
        // height: '100%',
        gap: 10,
      }}>
      <View style={styles.inputBox}>
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
            onSubmitEditing={handleInputSubmit}
          />
        </View>
      </View>
      <ScrollView style={{maxHeight: hp(50)}}>
        <FlatList
          data={filteredTasks}
          keyExtractor={(item, index) =>
            item && item?._id ? item?._id.toString() : index.toString()
          }
          renderItem={({item, index}) => (
            <View
              style={[
                styles.tasksContainer,
                item?.ishighlight ? styles.highlightedTaskContainer : null,
              ]}>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: 20,
                  alignItems: 'center',
                }}
                onPress={() => handleCheckBoxClick(heading, item?._id)}>
                <View
                  style={[
                    styles.checkBox,
                    item?.isChecked && styles.checkedBox,
                  ]}>
                  {item?.isChecked && <Text style={styles.tick}>&#10003;</Text>}
                </View>
                {!editTaskId || editTaskId !== item._id ? (
                  <Text
                    style={[
                      styles.taskText,
                      item?.isChecked && styles.lineThrough,
                    ]}>
                    {item?.name}
                  </Text>
                ) : (
                  <TextInput
                    style={styles.editInput}
                    value={editTaskId === item._id ? changeText : item.name}
                    onChangeText={handleUpdateChange}
                    // onBlur={() => handleUpdateTask(item._id)}
                    onSubmitEditing={() => handleUpdateTask(item._id)}
                  />
                )}
              </TouchableOpacity>

              <Pressable
                style={{position: 'relative'}}
                onPress={() => handleDotClick(item?._id)}>
                <Dots />
              </Pressable>

              {openedDotFileIndex === item?._id && (
                <Menus
                  today={today}
                  visible={visible}
                  dotFileContainer={styles.dotFileContainer}
                  setVisible={setVisible}
                  data={data}
                  onClick={filter => handleFilterSelection(filter, item._id)}
                />
              )}
            </View>
          )}
        />

        <TomorrowTask
          filteredTask={filteredTasks}
          setFilteredTask={setFilteredTasks}
        />
      </ScrollView>
    </View>
  );
};

export default TaskNew;
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
    width: hp(24),
    position: 'absolute',
    bottom: '1%',
    alignSelf: 'center',
  },
  placeholder: {
    fontStyle: 'italic',
    fontSize: 20,
  },
  container: {
    flex: 1,
    padding: 10,
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
    fontSize: 12,
  },
  text: {
    color: 'gray',
  },

  dotFileContainer: {
    position: 'absolute',
    top: '100%',
    left: 10,
    zIndex: 20,
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
    opacity: 5,
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
