import axios from "axios";
import { AdvancedOptions } from "./types";

export const apiURL = `http://${process.env.REACT_APP_BACK_DOMAIN}:${process.env.REACT_APP_BACK_PORT}`


axios.defaults.withCredentials = true;

/* ////////////////////         /      //////////////////// */

// GET

export async function getCitiesRequest(city: string) {
    return (axios.get(`${apiURL}/searchCity?city=${city}`))
}

export async function getGeolocationRequest(latitude: string, longitude: string) {
    return (axios.get(`${apiURL}/geolocation?latitude=${latitude}&longitude=${longitude}`))
}


/* ////////////////////         / U S E R       //////////////////// */

// GET 

export async function resetPasswordRequest(email: string) {
    return (axios.get(`${apiURL}/user/resetPassword?email=${email}`))
}

export async function getUserTagsRequest() {
    return (axios.get(`${apiURL}/user/tags`))
}

export async function getUserRequest(id: string | number | null = null) {
    return (axios.get(`${apiURL}/user/${id ? id : 'me'}`))
}

export async function getUserNotifsRequest() {
    return (axios.get(`${apiURL}/user/notifications`))
}

export async function getBrowseUsersRequest() {
    return (axios.get(`${apiURL}/user/recommandations`))
}


export async function getUserPhotoRequest(index: number, userId: number = null, height: number = 0) {
    let url: string = `${apiURL}/user/me/photo/${index}`;
    if (userId) {
        url = `${apiURL}/user/${userId}/photo/${index}`;
    }
    if (height)
        url += `?height=${height}`
    return (axios.get(url, { responseType: 'blob' }))
}

// POST 

export async function signinRequest(username: string, password: string) {
    return (axios.post(`${apiURL}/user/signin`, { username, password }))
}

type TSignup = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    password: string,
}

export async function signupRequest(data: TSignup) {
    return (axios.post(`${apiURL}/user/signup`, data))
}


// PATCH 

export async function updateUserRequest(user: any) {
    return (axios.patch(`${apiURL}/user/update`, user))
}


export async function updatePasswordRequest(password: string) {
    return (axios.patch(`${apiURL}/user/password`, { password }))
}

export async function confirmAccountRequest() {
    return (axios.patch(`${apiURL}/user/confirmAccount`))
}

export async function updatePhotosRequest(photos: any[]) {
    const formFiles = new FormData();
    photos.forEach((o: any) => {
        if (o.file) {
            formFiles.append('file', o.file); formFiles.append('index', o.index)
        }
    })
    return (
        axios.patch(`${apiURL}/user/photos`, formFiles, { headers: { "Content-Type": "multipart/form-data" } })
    )
}



/* ////////////////////         / C O N V E R S A T I O N S       //////////////////// */

// GET 

export async function getUserConversationIdsRequest() {
    return (axios.get(`${apiURL}/conversations`))
}

export async function getConversationMessagesRequest(convId: string | number) {
    return (axios.get(`${apiURL}/conversations/${convId}/messages`))
}

export async function getLastMessageRequest(convId: string | number, authorId: string | number) {
    return (axios.get(`${apiURL}/conversations/${convId}/lastMessage/${authorId}`))
}


/* ////////////////////         / L I K E S       //////////////////// */

export async function getUserLikes() {
    return (axios.get(`${apiURL}/likes`))
}


/* ////////////////////         / V I E W S        //////////////////// */

export async function getUserViews() {
    return (axios.get(`${apiURL}/views`))
}


/* ////////////////////         / T A G S        //////////////////// */


export async function getTagsRequest() {
    return (axios.get(`${apiURL}/tags`))
}



export async function getAdvancedBrowseUsersRequest(advancedOptions: AdvancedOptions) {
    return (
        axios.post(`${apiURL}/user/recommandations/options`, advancedOptions)
    )
}

export async function getUserAdavancedOptionsRequest(id: number, advancedOptions: AdvancedOptions) {
    return (
        axios.post(`${apiURL}/user/${id}/options`, advancedOptions))
}

