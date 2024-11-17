import baseURL from "@/assets/common/baseUrl";
import axios from "axios";

export const postCommentAPI = async ({ token, body, }) => {

    const { data } = await axios.post(`${baseURL}/comment/create`, body, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    return data;
}

export const upvoteCommentAPI = async ({ token, body, id }) => {

    const { data } = await axios.post(`${baseURL}/comment/upvote/${id}`, body, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    return data;
}

export const downvoteCommentAPI = async ({ token, body, id }) => {

    const { data } = await axios.post(`${baseURL}/comment/downvote/${id}`, body, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    return data;
}

export const deleteCommentAPI = async ({ token, id }) => {

    const { data } = await axios.delete(`${baseURL}/comment/delete/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    return data;
}