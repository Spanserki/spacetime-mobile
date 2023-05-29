import axios from "axios";

export const api = axios.create({
    baseURL: 'http://172.20.3.74:3000/api'
})