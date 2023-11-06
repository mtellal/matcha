import userReportsModel from "~/models/userReports.model";

const getUserIdsReportedMe = exports.getUserIdsReportedMe = async (reportUserId: string | number) => {
    let res = await userReportsModel.getUserIdsReportedMe(reportUserId);
    if (res && res.length)
        res = res.map((o: any) => o.userId)
    return (res)
}

const getUserIdsReported = exports.getUserIdsReported = async (userId: number | string) => {
    let res = await userReportsModel.getUserIdsReported(userId);
    if (res && res.length)
        res = res.map((o: any) => o.reportUserId)
    return (res)
}

const insertUserReport = exports.insertUserReport = async (userId: string | number, reportUserId: string | number) => {
    const res = await userReportsModel.insertUserReport(userId, reportUserId);
    if (!res.affectedRows || res.warningStatus) {
        throw "Insert userReport failed";
    }
    return (res)
}

export default {
    getUserIdsReportedMe,
    getUserIdsReported,
    insertUserReport
}