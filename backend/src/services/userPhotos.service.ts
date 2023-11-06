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

export default {
    getUserPhotosIndexs,
    getPathFromIds,
    updateUserPhotos
}