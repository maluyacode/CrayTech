import baseURL from "@/assets/common/baseUrl"
import axios from "axios"

export const sendTokenToServer = async ({ token, body, id }) => {
    const { data } = await axios.post(`${baseURL}/notification/token/${id}`, body, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return data;
}