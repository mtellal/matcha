import departmentsModels from "~/models/departments.models";

const getDepartmentFromId = exports.getDepartmentFromId = async (id: string | number) => {
    let res = await departmentsModels.getDepartmentFromId(id);
    if (!res || !res.length)
        throw "Department not found";
    return (res[0]);
}

const getDepartmentFromCode = exports.getDepartmentFromCode = async (code: string | number) => {
    let res = await departmentsModels.getDepartmentFromCode(code);
    if (!res || !res.length)
        throw "Department not found";
    return (res[0]);
}


export default {
    getDepartmentFromId,
    getDepartmentFromCode
}