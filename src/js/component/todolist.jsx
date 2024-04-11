import React, { useState, useEffect } from "react";

const TodoList = () => {
    const [inputValue, setInputValue] = useState("");
    const [tasks, setTasks] = useState([]);
    const [userName, setUserName] = useState("");
    const [users, setUsers] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [selectedUser, setSelectedUser] = useState("");

    // Crear usuario (POST)
    function createUser() {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: userName })
        };
        fetch(`https://playground.4geeks.com/todo/users/${userName}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                // Actualiza el estado de usuarios con los nuevos datos
                setUsers([...users, data]);
            })
            .catch(error => console.error('Error creating user:', error));
    }

    // Función para manejar el cambio en el input de nombre de usuario
    const handleUserNameChange = (e) => {
        setUserName(e.target.value); // Actualiza el estado userName con el valor del input
    };

    // Mostrar usuarios de la API (GET)
    function showUsers() {
        fetch("https://playground.4geeks.com/todo/users?offset=0&limit=100")
            .then(response => response.json())
            .then(data => {
                // Actualiza el estado de usuarios con los datos obtenidos
                setUsers(data.users);
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    // Crear tareas (POST)
    function createTask() {
        // Verifica si selectedUser está vacío
        if (!selectedUser) {
            console.error('No user selected');
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: newTask, username: selectedUser }) // Se asocia la tarea con el usuario correspondiente
        };
        fetch(`https://playground.4geeks.com/todo/todos/${selectedUser}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                // Agrega la nueva tarea al estado tasks
                setTasks([...tasks, data]);
                // Limpia el input de nueva tarea
                setNewTask("");
            })
            .catch(error => console.error('Error creating task:', error));
    }

    // Mostrar tareas desde la API (GET)
    function showTasks() {
        fetch(`https://playground.4geeks.com/todo/users/${userName}`)
            .then(response => response.json())
            .then(data => {
                // Verifica si data.todos está definido antes de actualizar el estado
                if (data.todos) {
                    // Actualiza el estado de tareas con los datos obtenidos
                    setTasks(data.todos);
                } else {
                    // Si data.todos no está definido, inicializa tasks como un array vacío
                    setTasks([]);
                }
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Mostrar tareas del usuario seleccionado desde la API (GET)
    function showUserTasks(user) {
        if (!user) {
            console.error('No user selected');
            return;
        }
        fetch(`https://playground.4geeks.com/todo/users/${user}`)
            .then(response => response.json())
            .then(data => {
                // Actualiza el estado de tareas con los datos obtenidos
                setTasks(data.todos);
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Función para manejar el cambio en el input de la nueva tarea
    const handleNewTask = (e) => {
        setNewTask(e.target.value); // Actualiza el estado newTask con el valor del input
    };

    // Función para manejar el cambio en el input
    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Actualiza el estado inputValue con el valor del input
    };

    // Función para manejar la tecla presionada en el input 
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && newTask.trim() !== "") {
            createTask(); // Llama a la función createTask si la tecla presionada es "Enter" y hay una nueva tarea ingresada
        }
    };

    // Función para eliminar una tarea
const handleDeleteTask = (taskId, index) => {
    // Realizar la solicitud DELETE a la API
    fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Si la solicitud fue exitosa, actualiza el estado local eliminando la tarea
            const newTasks = [...tasks];
            newTasks.splice(index, 1);
            setTasks(newTasks);
        } else {
            throw new Error('Failed to delete task');
        }
    })
    .catch(error => console.error('Error deleting task:', error));
};

    // Cargar usuarios al montar el componente
    useEffect(() => {
        showUsers();
    }, []);

    return (
        <>
            <h1>ToDoS</h1>
            
            <div className="usuarios">

                <div className="create-user">
                    <h2>New user?</h2>
                    <input
                        type="text"
                        placeholder="Type a user name"
                        value={userName}
                        onChange={handleUserNameChange}
                        onKeyDown={handleKeyDown} // Agregar el evento onKeyDown
                    />
                    <button className="btn button-create-user" onClick={createUser}>Create user</button>
                    
                </div>
                <div className="users-text">
                <p>Select a User:</p>
                <select onChange={(e) => { setSelectedUser(e.target.value); showUserTasks(e.target.value); }}>
                    <option value="">User</option>
                    {users.map(user => (
                        <option key={user.id} value={user.name}>{user.name}</option>
                    ))}
                </select>
                </div>
            </div>
            
            <div className="container">
                
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={newTask}
                    onChange={handleNewTask}
                    onKeyDown={handleKeyDown} // Agregar el evento onKeyDown
                />

                <ul>
                    {tasks.map((task, index) => (
                        <li key={task.id}>
                            {task.label} {task.is_done ? "(Done)" : "(Not Done)"}
                            <button className="delete" onClick={() => handleDeleteTask(task.id, index)}>X</button>
                        </li>
                    ))}
                </ul>
                <p>{tasks.length} item left</p>
            </div>

            <div className="container sheet1"></div>
            <div className="container sheet2"></div>
            <div className="usuarios">
                <p className="users-text">Users:</p>
                <ul className="users">
                    {users.map(user => (
                        <li key={user.id}>
                            {user.name}
                            <ul>
                                {tasks
                                    .filter(task => task.username === user.name) // Filtrar tareas por usuario
                                    .map((task, index) => (
                                        <li key={index}>{task.label} {task.is_done ? "(Done)" : "(Not Done)"}</li>
                                    ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            <footer>
                Designed by Cris Machuca for <span className="footer-span"> 4Geeks Academy</span>
            </footer>
        </>
    );
};

export default TodoList;
