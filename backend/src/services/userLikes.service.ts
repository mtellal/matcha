import userLikesModels from "~/models/userLikes.models";

const isUserLiked = exports.isUserLiked = async (userId: string | number, likeUserId: string | number) => {
    return (await userLikesModels.isUserLiked(userId, likeUserId))
}

const getUserIdsLikedMe = exports.getUserIdsLikedMe = async (likeUserId: string | number) => {
    let res = await userLikesModels.getUserIdsLikedMe(likeUserId);
    if (res && res.length)
        res = res.map((o: any) => o.userId)
    return (res)
}

const getUserIdsLiked = exports.getUserIdsLiked = async (userId: number | string) => {
    let res = await userLikesModels.getUserIdsLiked(userId);
    if (res || res.length)
        res = res.map((o: any) => o.likeUserId)
    return (res)
}

const insertUserLike = exports.insertUserLike = async (userId: string | number, likeUserId: string | number) => {
    return (await userLikesModels.insertUserLike(userId, likeUserId))
}

const deleteUserLike = exports.deleteUserLike = async (userId: string, likeUserId: string) => {
    return (await userLikesModels.deleteUserLike(userId, likeUserId))
}

export default {
    isUserLiked,
    getUserIdsLikedMe,
    getUserIdsLiked,
    insertUserLike,
    deleteUserLike
} 