import React, { useState , useEffect} from 'react'
import "./App.css";

function App() {
  const [userWork , setUserWork] = useState("");
  const [count , setCount] = useState(1);

  const [tasks , setTasks] = useState([]);

  //making local storage so that data persists in the page even after loading
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    console.log(savedTasks);
    setTasks(savedTasks);
    if (savedTasks.length > 0) {
      const lastTaskId = savedTasks[savedTasks.length - 1].id;
      setCount(lastTaskId + 1);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  //move task to working section
  const  moveToWorking = (taskId) => {
    const updateTask = tasks.map((task) => 
      task.id == taskId ? {...task , status:'working'} : task
  ); 
  setTasks(updateTask);
  localStorage.setItem("tasks", JSON.stringify(updateTask)); // Store immediately
  }

  //move to completed section
  const moveToCompleted = (taskId) => {
    const completeTask = tasks.map((task) => 
    task.id === taskId ? {...task , status:'completed'} : task
    ); 
    setTasks(completeTask);
    localStorage.setItem("tasks" , JSON.stringify(completeTask));
  }

  //remove task
  const removeTask = (taskId) => {
    const updatedTask = tasks.filter((tasks) =>
    tasks.id !== taskId ); setTasks(updatedTask);
  }

  //filtering task based on working and completed
  const workingTask = tasks.filter((task) => task.status === 'working');
  const completedTask = tasks.filter((task) => task.status === 'completed');


  const handleSubmit = (e) => {
    e.preventDefault(); //prevent page reload

    if(userWork.trim() === ""){
      alert('No Task Added');
      return ;
    }

    const newTask = { id: count, task: userWork, status: 'working' };
    const updatedTasks = [...tasks, newTask]; // Create updated tasks list
    setTasks(updatedTasks); // Update state with the new task
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save to localStorage immediately
    setUserWork(''); // Clear the input field
    setCount(count + 1); // Update count for next task

  }
  return (
    <div className='Container'>
      <div className='Container-box'>
        <form onSubmit={handleSubmit}>
        <h1>To Do List</h1>
        <div className='form-inputs'>
          <label htmlFor="username">Task No {count} </label>
          <input type="text" 
                 id='username'
                 value={userWork}
                 onChange={(e) => setUserWork(e.target.value)}
                 placeholder='Enter your task'
          />
          </div>
          <button type='submit'>Submit</button>
        </form> 

        <div className='Task-List'>
          <div className='Completed'>
            <h2>Completed Tasks</h2>
            {completedTask.length === 0 ? (
              <p>No tasks are completed yet.</p>
            ) : (
              <ul>
                {completedTask.map((task) => (
                  <li key={task.id}>
                    <strong>Task No {task.id}:</strong> {task.task}
                    <button onClick={() => removeTask(task.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='Working'>
            <h2>Working Task</h2>
            {workingTask.length === 0 ? (
              <p>No working task</p>
            ) : (
              <ul>
                {workingTask.map((task) => (
                  <li key={task.id}>
                      <strong>Task No {task.id}</strong> {task.task}
                      <button onClick={() => moveToCompleted(task.id)}>Completed</button>
                      <button onClick={() => removeTask(task.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
