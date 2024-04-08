import React, {useState, useEffect} from "react";


const TodoList = () => {
    const [inputValue, setInputValue] = useState("");
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);


    useEffect(() => {
        // Hacer la solicitud a la API para obtener los usuarios
        fetch("https://playground.4geeks.com/todo/users?offset=0&limit=100")
            .then(response => response.json())
            .then(data => {
                // Actualizar el estado de los usuarios con los datos obtenidos
                console.log("API response:", data); 
                setUsers(data.users);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []); 


    // Función para manejar el cambio en el input
    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Actualiza el estado inputValue con el valor del input
    };

    // Función para manejar la tecla presionada en el input 
    const handleKeyDown = (e) => {
        // Verifica si la tecla presionada es "Enter" y si el valor del input no está vacío
        if (e.key === "Enter" && inputValue.trim() !== "") { 
            // Agrega el valor del input al array de tareas y limpia el input
            setTasks([...tasks, inputValue.trim()]);
            setInputValue("");
        }
    };

    // Función eliminar una tarea
    const handleDeleteTask = (index) => {
        // Crea una nueva copia del array de tareas
        const newTasks = [...tasks];
        // Elimina la tarea en la posición indicada por el índice
        newTasks.splice(index, 1);
        // Actualiza el estado de las tareas con la nueva copia
        setTasks(newTasks);
    };

    return (
        <>
            <h1>ToDoS</h1>
            
                <div className="container">
                    
                    <input 
                        type="text" 
                        placeholder="What needs to be done?"
                        value={inputValue} 
                        onChange={handleInputChange} 
                        onKeyDown={handleKeyDown} 
                    />
                    
                    <ul>
                        {tasks.map((task, index) => (
                        <li key={index}>
                            {task}{" "}
                            <button onClick={() => handleDeleteTask(index)}>X</button>
                        </li>
                        ))}
                    </ul>
                    <p>{tasks.length} item left</p>
                    
                </div>
                <div className="container sheet1"></div>
                <div className="container sheet2"></div>
                    <div className="usuarios">
                        <p className="users-text">Users:</p>
                            {users.length > 0 ? (
                            <ul className="users">
                            {users.map(user => (
                                <li key={user.id}>{user.name}</li>
                                ))}
                            </ul>
                            ) : (
                        <p>Loading users...</p>
                            )}

                    </div>
                <footer>
                    Designed by Cris Machuca for <span className="footer-span"> 4Geeks Academy</span>
                </footer>
        </>
    );
};

export default TodoList;