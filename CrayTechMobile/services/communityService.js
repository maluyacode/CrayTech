import baseURL from "@/assets/common/baseUrl";
import axios from "axios";

export const getCommunityAPI = async ({ id, token }) => {

    const { data } = await axios.get(`${baseURL}/community/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return data;
}

export const updateCommunityAPI = async ({ id, token, body }) => {

    const { data } = await axios.put(`${baseURL}/community/update/${id}`, body, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });

    return data;

}

export const getCommunitiesAPI = async ({ token, query = '' }) => {

    const { data } = await axios.get(`${baseURL}/communities?${query}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return data
}