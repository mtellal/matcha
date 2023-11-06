import userViewsModels from "~/models/userViews.models";

const getUserIdsViewedMe = exports.getUserIdsViewedMe = async (viewUserId: string | number) => {
    let res = await userViewsModels.getUserIdsViewedMe(viewUserId);
    if (res && res.length)
        res = res.map((o: any) => o.userId)
    return (res)
}

const getUserIdsViewed = exports.getUserIdsViewed = async (userId: number | string) => {
    let res = await userViewsModels.getUserIdsViewed(userId);
    if (res && res.length)
        res = res.map((o: any) => o.viewUserId)
    return (res)
}

const insertUserView = exports.insertUserView = async (userId: string | number, viewUserId: string | number) => {
    const res = await userViewsModels.insertUserView(userId, viewUserId);
    if (!res.affectedRows || res.warningStatus) {
        throw "Insert userView failed";
    }
    return (res)
}

export default {
    getUserIdsViewedMe,
    getUserIdsViewed,
    insertUserView
}