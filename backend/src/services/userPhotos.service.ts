import userPhotosModels from "~/models/userPhotos.models";

const getPathFromIds = exports.getPathFromIds = async (userId: number, index: number) => {
    let res = await userPhotosModels.getPathFromIds(userId, index);
    return ((res[0] && res[0].path) || null)
}

const updateUserPhotos = exports.updateUserPhotos = async (fileNames: string[], photosIndex: any[], userId: number) => {
    return (await userPhotosModels.updateUserPhotos(userId, fileNames, photosIndex))
}

type UserPhotos = {
    userId: number
    path: string,
    photoId: number,
}

const getUserPhotosIndexs = exports.getUserPhotosIndexs = async (userId: string | number) => {
    let res = await userPhotosModels.getUserPhotos(userId);
    if (res && res.length) {
        res = res.map((photo: UserPhotos) => Number(photo.photoId) % 5)
        return (res)
    }
    return ([])
}

const getUserProfilePicture = exports.getUserProfilePicture = async(userId: number | string) => {
    let res = await userPhotosModels.getUserProfilePicture(userId) 
    return ((res[0] && res[0].path) || null)
}

const deletePhotoUser = exports.deletePhotoUser = async (userId: number, photoIndex: number) => {
    return (await userPhotosModels.deletePhotoUser(userId, photoIndex))
}

export default {
    getUserPhotosIndexs,
    getUserProfilePicture,
    getPathFromIds,
    updateUserPhotos, 
    deletePhotoUser
}