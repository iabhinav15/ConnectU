import axios, { Method } from 'axios';
import { SetPosts } from '../redux/postSlice';
import { AppDispatch } from '../redux/store';

const API_URL = process.env.REACT_APP_API_URL

export const API = axios.create({   
    baseURL: API_URL,
    responseType: 'json',
    headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

interface ApiRequestProps {
    method?: Method | string;
    url: string;
    data?: any;
    token?: string;
}

export const apiRequest = async ({method, url, data, token}: ApiRequestProps) => {
    try {
        const result = await API(url, {
            method : method || 'GET',
            data: data,
            headers: {
                "content-type": "application/json",
                Authorization: token? `Bearer ${token}` : '',
            },
        });

        return result?.data;
    } catch (error: any) {
        const err = error.response?.data;
        console.log(err);
        return { status: err?.status, message: err?.message };  
    }
};

//function to upload images to cloudinary
export const handleFileUpload = async(uploadFile: File) => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "ConnectU-SocialMediaApp");

    try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_ID}/image/upload`, formData);

        return response.data.secure_url;
    } catch (error) {
        console.log(error);
    }
};

export const fetchPosts = async (token: string, dispatch: AppDispatch, uri?: string, data?: any) => {
    try {
        const res = await apiRequest({
            url: uri || '/posts',
            token: token,
            method: 'POST',
            data: data || {},
        });
        dispatch(SetPosts(res?.data));
        return;
    } catch (error) {
        console.log(error);
    }
};


export const likePost = async ({token, uri}: {token: string, uri: string}) => {
    try {
        const res = await apiRequest({
            url: uri,
            token: token,
            method: 'POST',
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deletePost = async (id: string, token: string) => {
    try {
        await apiRequest({
            url: "/posts/" + id,
            token: token,
            method: 'DELETE',
        });
        return;
    } catch (error) {
        console.log(error);
    }
};

export const getUserInfo = async (token: string, id?: string) => {
    try {
        const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;
        const res = await apiRequest({
            url: uri,
            token: token,
            method: 'POST',
        });

        if(res?.message === 'Authentication failed'){
            localStorage.removeItem('user');
            window.alert('User Session expired. Please login again.');
            window.location.replace('/login');
        }
        return res?.user;
    } catch (error) {
        console.log(error);
    }
};

export const sendFriendRequest = async (token: string, id: string) => {
    try {
        await apiRequest({
            url: "/users/friend-request/",
            token: token,
            method: 'POST',
            data: {requestTo: id},
        });
        return;
    } catch (error) {
        console.log(error)
    }
};

export const viewUserProfile = async (token: string, id: string) => {
    try {
        await apiRequest({
            url: "/users/profile-view/",
            token: token,
            method: 'POST',
            data: {id},
        });
        return;
    } catch (error) {
        console.log(error)
    }
};
