import { axiosCloudFunctionService } from "../services/axios/axios.service.js";

export const verifyFirebaseToken = async(token) => {
    return new Promise(function(resolve, reject) {
        const params = new URLSearchParams();
        params.append("firebaseToken", token);
        axiosCloudFunctionService.post("/verifyFirebaseToken", params).then((response) => {
            if (response.status == 200) {
                console.log("Firebase token verified");
                return resolve(response.data.user);
            } else {
                return resolve(false);
            }
        }).catch((error) => {
            console.log(error);
            return resolve(false);
        });
    });
}