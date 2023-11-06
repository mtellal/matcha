import userBlocksModel from "~/models/userBlocks.model";

const getUserBlocks = exports.getUserBlocks = async (userId: string | number) => {
    return (await userBlocksModel.getUserBlocks(userId))
}

const getUserIdsBlocked = exports.getUserIdsBlocked = async (userId: number | string) => {
    let res = await userBlocksModel.getUserIdsBlocked(userId);
    if (res && res.length)
        res = res.map((o: any) => o.blockUserId)
    return (res)
}

const isUserIdBlocked = exports.isUserIdBlocked = async (userId: string | number, blockUserId: string | number) => {
    let res = await userBlocksModel.isUserIdBlocked(userId, blockUserId);
    if (res && res.length)
        return (res[0])
    return (null);
}

const insertUserBlock = exports.insertUserBlock = async (userId: string | number, viewUserId: string | number) => {
    const res = await userBlocksModel.insertUserBlock(userId, viewUserId);
    if (!res.affectedRows || res.warningStatus) {
        throw "Insert userView failed";
    }
    return (res)
}

const deleteUserBlock = exports.deleteUserBlock = async (userId: string, blockUserId: string) => {
    let res = await userBlocksModel.deleteUserBlock(userId, blockUserId);
    return (res)
}

export default {
    getUserBlocks,
    getUserIdsBlocked,
    isUserIdBlocked,
    insertUserBlock,
    deleteUserBlock
}