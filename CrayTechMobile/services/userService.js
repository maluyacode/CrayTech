import baseURL from "@/assets/common/baseUrl";
import axios from "axios";

export const getUsersAPI = async ({ token }) => {

    const { data } = await axios.get(`${baseURL}/users/all`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return data;

}