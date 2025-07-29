import API from "./axios";

export const getTasks = async () => {
  const response = await API.get("/tasks");
  return response.data;
};

export const createTask = async (task) => {
  const response = await API.post("/tasks", task);
  return response.data;
};

export const updateTask = async (id, updates) => {
  const response = await API.patch(`/tasks/${id}`, updates);
  return response.data;
};

export const deleteTask = async (id) => {
  await API.delete(`/tasks/${id}`);
};
