export type Tag = {
    tagId: number,
    tag: string
}

export type Notification = {
    id: number,
    firstName: string,
    userId: number,
    createdAt: Date | string,

    user?: any,
    convId?: number,
    userId1?: number,
    userId2?: number,
    action?: string
}

export type UserPhoto = {
    index: number,
    url: string,
    file?: File
}


export type City = {
    name: string,
    id?: number,
    department_code?: string,
    insee_code?: string,
    slug?: string,
    gps_lat?: number,
    gps_lng?: number
}



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
    nbTags: number,
    photos: UserPhoto[],
    isLiked?: boolean,
    likedYou?: boolean
}


export type Department = {
    id: number,
    region_code: string,
    code: string,
    name: string,
    slug: string
}

export type Region = {
    id: number,
    code: string,
    name: string,
    slug: string
}

export type AdvancedOptions = {
    ageGap?: number,
    fameRatingGap?: number,
    city?: City
    tags?: string[]
}

export type Conversation = {
    id: number,
    userId: number,
    memberId: number,
    messages: Message[],
    user: any,
    lastMessage: Message
}

export type Message = {
    id: number,
    convId: number,
    authorId: number,
    userId: number,
    text: string,
    createdAt: Date
}

