export interface ICreate {
    id: number,
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    city?: string

    gender?: string,
    sexualPreferences?: string,
    biography?: string,
    tags?: string[],
    profilePicture?: any,
    photos?: any[]
}

export const UsersTableFields = [
    "firstName",
    "lastName",
    "password",
    "username",
    "photos",
    "city",
    "likes",
    "views",
    "fameRating",
    "status",
    "lastConnection",
    "gender",
    "sexualPreferences",
    "tags",
    "biography",
    "age",
    "email",

    "ageGap",
    "fameRatingGap",
]

export type User = {
    userId: number,
    username: string,
    email?: string,
    password?: string,
    firstName: string,
    lastName: string,
    age: string, //yyyy-dd-mm 
    city: City
    department: Department, 
    region: Region, 
    gender: string, 
    sexualPreferences: string, 
    biography: string, 
    likes?: Number, 
    views?: Number, 
    matches?: Number, 
    fameRating: Number, 
    status: boolean, 
    confirmAccount?: boolean, 
    confirmToken?: string, 
    notifications: Number, 
    nbPhotos: Number, 
    lastConnection: string
    tags?: string[], 
    blockIds?: Number[], 
    photosIndex?: number[],
    distance?: number, 
    commonTags?: number,
    nbTags: number
}

export type Tag = {
    tagId: number,
    tag: string
}

export type City = {
    id: number,
    department_code: string,
    insee_code: string,
    zip_code: string,
    name: string,
    slug: string,
    gps_lat: Number,
    gps_lng: Number,
}

export type Conversation = {
    id: number,
    userId: number,
    memberId: number
}

export type Department = {
    id: number,
    region_code: string,
    code: string,
    name: string,
    slug: string
}

export type Message = {
    id: number,
    convId: number,
    authorId: number,
    userId: number,
    text: string,
    createdAt: Date
}

export type Notification = {
    id: number | string,
    firstName?: string,
    userId?: number | string,
    createdAt: Date | string
    userId1: number,
    userId2: number,
    action: string
}

export type Region = {
    id: number,
    code: string,
    name: string,
    slug: string
}

export type UserBlock = {
    userId: number,
    blockUserId: number,
    createdAt: Date
}

export type UserLike = {
    userId: number,
    likeUserId: number
}

export type UserPhoto = {
    userId: number,
    path: string,
    photoId: number
}

export type UserReport = {
    userId: number,
    reportUserId: number
}

export type UserTag = {
    userId: number,
    tagId: number
}

export type UserView = {
    userId: number,
    viewUserId: number
}


export type SearchAdvancedOptions = {
    ageGap?: number, 
    fameRatingGap?: number 
    tags?: string[]
    city?: City
} 
