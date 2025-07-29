import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    importance: 1,
  });

  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) {
      alert("Please fill in title and description.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/tasks", {
        ...newTask,
        deadline: newTask.deadline || null,
        importance: parseInt(newTask.importance),
        status: "To-do",
      });

      setTasks([...tasks, response.data]);
      setNewTask({
        title: "",
        description: "",
        deadline: "",
        importance: 1,
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask({ ...task });
  };

  const handleEditInputChange = (e) => {
    setEditingTask({ ...editingTask, [e.target.name]: e.target.value });
  };

  const handleUpdateTask = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/tasks/${editingTask.id}`,
        {
          ...editingTask,
          importance: parseInt(editingTask.importance),
        }
      );

      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? response.data : task
        )
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getPriorityColor = (level) => {
    if (level >= 4) return "red";
    if (level === 3) return "orange";
    return "green";
  };

  // Before return


  const groupTasksByStatus = (tasks) => {
  const columns = {
    "To-do": [],
    "In Progress": [],
    "Completed": [],
  };

  tasks.forEach((task) => {
    const status = task.status || "To-do"; // fallback in case status is null
    if (!columns[status]) {
      // fallback in case status is something like "Pending"
      columns["To-do"].push(task);
    } else {
      columns[status].push(task);
    }
  });

  return columns;
  };
  
  const statusColumns = groupTasksByStatus(tasks);

  
  return (
    <div style={{ padding: "2rem" }}>
      <h1>DevTrack Dashboard</h1>

      {/* Create New Task */}
      <div style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleInputChange}
          style={{ marginRight: "0.5rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleInputChange}
          style={{ marginRight: "0.5rem", padding: "0.5rem" }}
        />
        <input
          type="date"
          name="deadline"
          value={newTask.deadline}
          onChange={handleInputChange}
          style={{ marginRight: "0.5rem", padding: "0.5rem" }}
        />
        <select
          name="importance"
          value={newTask.importance}
          onChange={handleInputChange}
          style={{ marginRight: "0.5rem", padding: "0.5rem" }}
        >
          <option value="1">Low</option>
          <option value="3">Medium</option>
          <option value="5">High</option>
        </select>
        <button onClick={handleAddTask} style={{ padding: "0.5rem 1rem" }}>
          Add Task
        </button>
      </div>

      {/* Task Columns */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {Object.entries(statusColumns).map(([status, tasks]) => (
          <div key={status} style={{ flex: 1 }}>
            <h2>{status}</h2>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : "None"}
                </p>
                <p>
                  <span
                    style={{
                      color: "white",
                      backgroundColor: getPriorityColor(task.importance),
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                    }}
                  >
                    Priority: {task.importance}
                  </span>
                </p>
                <button
                  onClick={() => handleEditClick(task)}
                  style={{ marginRight: "0.5rem" }}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setEditingTask(null)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              minWidth: "400px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Edit Task</h2>
            <input
              type="text"
              name="title"
              value={editingTask.title}
              onChange={handleEditInputChange}
              placeholder="Title"
              style={{ display: "block", marginBottom: "1rem", width: "100%" }}
            />
            <input
              type="text"
              name="description"
              value={editingTask.description}
              onChange={handleEditInputChange}
              placeholder="Description"
              style={{ display: "block", marginBottom: "1rem", width: "100%" }}
            />
            <input
              type="date"
              name="deadline"
              value={
                editingTask.deadline
                  ? editingTask.deadline.slice(0, 10)
                  : ""
              }
              onChange={handleEditInputChange}
              style={{ display: "block", marginBottom: "1rem", width: "100%" }}
            />
            <select
              name="importance"
              value={editingTask.importance}
              onChange={handleEditInputChange}
              style={{ display: "block", marginBottom: "1rem", width: "100%" }}
            >
              <option value="1">Low</option>
              <option value="3">Medium</option>
              <option value="5">High</option>
            </select>
            <select
              name="status"
              value={editingTask.status}
              onChange={handleEditInputChange}
              style={{ display: "block", marginBottom: "1rem", width: "100%" }}
            >
              <option value="To-do">To-do</option>
              <option value="In Progress">In Progress</option>
              <option value="completed">completed</option>
            </select>
            <button onClick={handleUpdateTask} style={{ marginRight: "1rem" }}>
              Save
            </button>
            <button onClick={() => setEditingTask(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
