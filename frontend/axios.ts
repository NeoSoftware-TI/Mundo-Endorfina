import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

export const makeInicial = axios.create({
    baseURL:"http://localhost:3001/"
})
