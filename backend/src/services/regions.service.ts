import regionsModels from "~/models/regions.models";

const getRegionFromId = exports.getRegionFromId = async (id: string | number) => {
    let res = await regionsModels.getRegionFromId(id);
    if (!res || !res.length)
        throw "Region not found"
    return (res[0])
}

const getRegionFromCode = exports.getRegionFromCode = async (code: string | number) => {
    let res = await regionsModels.getRegionFromCode(code);
    if (!res || !res.length)
        throw "Region not found"
    return (res[0])
}

export default {
    getRegionFromId,
    getRegionFromCode
}