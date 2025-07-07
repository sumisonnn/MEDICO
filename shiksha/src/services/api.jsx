import axios from "axios";

const   API ="http://localhost:4000/api/users";




export const getUsers = () => axios.get(API);
export const getUserById = (id) => axios.get(`${API}/${id}`);
export const createUser = (user) => axios.post(API, user);
export const updateUser = (id) => axios.put(`${API}/${id}`, user);
export const deleteUser = (id:) => axios.delete(`${API}/${id}`);