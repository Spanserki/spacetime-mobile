import axios from "axios";

export const api = axios.create({
    baseURL: 'http://172.20.2.103:3000/api'
})