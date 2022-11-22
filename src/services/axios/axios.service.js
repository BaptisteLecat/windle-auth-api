import axios from 'axios';

export const axiosCloudFunctionService = axios.create({
    baseURL: "https://europe-west1-windle-pro.cloudfunctions.net",
    timeout: 4000,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
    },
});