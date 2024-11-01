import baseURL from "@/assets/common/baseUrl"
import axios from "axios"

export const upvoteAPI = async ({ token, body, post_id }) => {
    const { data } = await axios.put(`${baseURL}/upvote/${post_id}`, body, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });
    return data;
}

export const downvoteAPI = async ({ token, body, post_id }) => {
    const { data } = await axios.put(`${baseURL}/downvote/${post_id}`, body, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });
    return data;
}

export const getPostsAPI = async ({ token }) => {

    const { data } = await axios.get(`${baseURL}/posts`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return data;

}

export const getPostAPI = async ({ token, id }) => {

    const { data } = await axios.get(`${baseURL}/post/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return data;

}
