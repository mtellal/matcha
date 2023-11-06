import userModel, { SearchAdvancedOptionsModel } from "~/models/user.model";
import userLikesService from "./userLikes.service";
import userViewsService from "./userViews.service";

import generalModels from "~/models/general.models";

import tagsService from "./tags.service";
import citiesService from "./cities.service";

import departmentsService from "./departments.service";
import regionsService from "./regions.service";
import userPhotosService from "./userPhotos.service";
import conversationsService from "./conversations.service";
import notificationsService from "./notifications.service";
import userBlocksService from "./userBlocks.service";
import { CreateUserDatas } from "~/controllers/user.controller";

import fs from 'fs'
import path from "path";
import { City, SearchAdvancedOptions, Tag, User } from "~/type";

let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 25,
    secureConnection: false,
    requireTLS: true,
    auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        ciphers: 'SSLv3',
    }
})

type MailMessageOptions = {
    from: string | undefined,
    to: any,
    subject: string,
    text: string
}

const sendMail = exports.sendMail = async (messageOption: MailMessageOptions) => {
    return (
        new Promise((resolve, reject) => {
            transporter.sendMail(messageOption, (error: Error, info: any) => {
                if (error) {
                    console.log("Mail failed")
                    // console.log(error);
                    reject("Mail sending failed")
                }
                if (info) {
                    console.log("Mail sent successfully")
                    // console.log(info)
                    resolve("Mail sent successfully")
                }
            })
        })
    )
}

const getAll = exports.getAll = async () => {
    try {
        const res = await userModel.getAll();
        return (res);
    }
    catch (e) {
        // console.log("Users.getAll error => ", e)
    }
}

const getUserDataFieldFromField = exports.getUserDataFieldFromField = async (data: string, field: string, dataField: string | number) => {
    let res = await userModel.getUserDataFieldFromField(data, field, dataField);
    if (Array.isArray(res))
        return (res[0][data] || null)
    return (res[data] || null)
}

const getUserDatasFieldsFromUserId = exports.getUserDatasFieldsFromUserId = async (fields: string[], userId: number | string) => {
    let res = await userModel.getUserDatasFieldsFromUserId(fields, userId);
    if (res && res.length)
        res = res[0]
    return (res);
}

const getPathFromIds = exports.getPathFromIds = async (userId: number, index: number) => {
    return (await userPhotosService.getPathFromIds(userId, index));
}

const getUserTags = exports.getUserTags = async (userId: string) => {
    let tagIds = await tagsService.getUserTagIds(userId);
    let tags: Tag[] = [];
    if (tagIds.length)
        tags = await tagsService.getTagsFromTagIds(tagIds);
    return (tags)
}

const getMaxLikes = exports.getMaxLikes = async () => {
    let res = await userModel.getMaxLikes();
    if (res && res.length)
        res = res[0].maxLikes
    return (res)
}

const getMaxViews = exports.getMaxViews = async () => {
    let res = await userModel.getMaxViews();
    if (res && res.length)
        res = res[0].maxViews
    return (res)
}

const getMaxMatches = exports.getMaxMatches = async () => {
    let res = await userModel.getMaxMatches();
    if (res && res.length)
        res = res[0].maxMatches
    return (res)
}

const getUserNotifications = exports.getUserNotifications = async (userId: string | number) => {
    return (await notificationsService.getAll(userId))
}

async function cityFromUserId(userId: string | number) {
    let cityId = await getUserDataFieldFromField("city", "userId", userId);
    return (await citiesService.getCityFromId(cityId));
}



async function getBrowseUserData(userId: number | string, advancedSearch: SearchAdvancedOptions | null) {
    let user = await getUserDatasFieldsFromUserId([
        "age",
        "fameRating",
        "gender",
        "sexualPreferences"
    ], userId);

    if (advancedSearch && advancedSearch.city) {
        try {
            user.city = await citiesService.getCityFromId(advancedSearch.city.id)
        }
        catch (e) {
            return (null)
        }
    }
    else
        user.city = await cityFromUserId(userId);

    user.tagIds = await tagsService.getUserTagIds(userId);
    user.likeIds = await userLikesService.getUserIdsLiked(userId);

    return (user)
}

const isAccountConfirmed = exports.isAccountConfirmed = async (username: string) => {
    try {
        const confirmAccount = await getUserDataFieldFromField("confirmAccount", "username", username)
        return (confirmAccount)
    }
    catch (e) {
        // console.log(e)
    }
    return (false)
}

async function pickBrowseUsers(userId: string | number, advancedSearch: SearchAdvancedOptions | null = null) {

    let curentUser = await getBrowseUserData(userId, advancedSearch);
    let users;

    if (advancedSearch) {
        let obj: Partial<SearchAdvancedOptionsModel> = {};
        if (advancedSearch.ageGap) {
            obj.ageGap = {
                userAge: curentUser.age,
                gap: Number(advancedSearch.ageGap)
            }
        }
        if (advancedSearch.fameRatingGap) {
            obj.fameRatingGap = { begin: parseFloat(curentUser.fameRating) - Number(advancedSearch.fameRatingGap), end: parseFloat(curentUser.fameRating) + Number(advancedSearch.fameRatingGap) }
        }
        users = await userModel.getUsersFromAdvancedSearch(obj);
    }
    else {
        users = await getAll();
    }

    let advTagsIds: number[] = [];
    if (advancedSearch && advancedSearch.tags && advancedSearch.tags.length) {
        advTagsIds = await tagsService.getTagsIdsFromTags(advancedSearch.tags);
    }

    users = await Promise.all(users.map(async (o: User) => {

        if (o.userId === userId || curentUser.likeIds.includes(o.userId))
            return (null);

        let user;

        try {
            user = await getBrowseUserData(o.userId, null);
        }
        catch (e) {
            return (null);
        }

        const distance = calculateDistance(curentUser.city.gps_lat, curentUser.city.gps_lng,
            user.city.gps_lat, user.city.gps_lng)

        if (curentUser.sexualPreferences !== "not specified" &&
            (curentUser.sexualPreferences !== user.gender ||
                (user.sexualPreferences !== "not specified" && user.sexualPreferences !== curentUser.gender)))
            return (null)
        else if (curentUser.sexualPreferences === "not specified" && user.sexualPreferences !== "not specified")
            return (null)

        if (advTagsIds && advTagsIds.length) {
            for (let tagId of Object.values(advTagsIds)) {
                if (!user.tagIds.find((id: number) => id === tagId))
                    return (null)
            }
        }

        let commonTags = 0;
        if (user.tagIds && user.tagIds.length) {
            for (let tagId of user.tagIds) {
                if (curentUser.tagIds.find((id: number) => id === tagId))
                    commonTags++
            }
        }

        return ({ ...o, fameRating: user.fameRating, distance, commonTags, nbTags: user.tagIds.length })
    }))

    users = users.filter((s: User | null) => s);
    return (users)
}

async function sortBrowseUsers(browseUsers: User[]) {
    if (!browseUsers || !browseUsers.length)
        return ([]);

    const weightLocation = 0.7;
    const weightTags = 0.2;
    const weigtFameRating = 0.1;

    let users = browseUsers.sort((u1: User, u2: User) => {

        const maxFameRating = 2000;
        const maxDistance = 500

        if (u1.distance && u1.distance > maxDistance)
            u1.distance = maxDistance;
        if (u2.distance && u2.distance > maxDistance)
            u2.distance = maxDistance;

        const similarityA =
            weightLocation * ((maxDistance - Number(u1.distance)) / maxDistance) +
            weightTags * (Number(u1.commonTags) / Number(u1.nbTags)) +
            weigtFameRating * (Number(u1.fameRating) / maxFameRating)

        const similarityB =
            weightLocation * (maxDistance - Number(u2.distance)) / maxDistance +
            weightTags * (Number(u2.commonTags) / u2.nbTags) +
            weigtFameRating * (Number(u2.fameRating) / maxFameRating)

        return similarityB - similarityA;
    })

    return (users);
}

const getBrowseUsersIds = exports.getBrowseUsersIds = async (userId: number | string, advancedOptions: SearchAdvancedOptions | null = null) => {
    let users = await pickBrowseUsers(userId, advancedOptions);
    users = await sortBrowseUsers(users);
    return (users);
}

const dataAlreaydExists = exports.dataAlreaydExists = async (data: string, email: string) => {
    try {
        const res = await getUserDataFieldFromField("userId", data, email)
        if (res)
            return (true);
    }
    catch (e) {
        // console.log(e)
    }
    return (false)
}

const getCurrentUserDatas = exports.getCurrentUserDatas = async (userId: string) => {
    let user = await userModel.getUserDatasFieldsFromUserId([
        "email",
        "userId",
        "username",
        "firstName",
        "lastName",
        "age",
        "biography",
        "likes",
        "views",
        "fameRating",
        "status",
        "lastConnection",
        "gender",
        "sexualPreferences",
        "notifications",
        "nbPhotos"
    ], userId);
    if (!user || !user.length)
        throw "User not found";
    user = user[0];
    if (user.age) {
        user.age = String(user.age.toISOString())
        if (user.age.length >= 10)
            user.age = user.age.slice(0, 10);
    }
    user.tags = await getUserTags(userId);
    user.blockIds = await userBlocksService.getUserIdsBlocked(userId)
    user.photosIndex = await userPhotosService.getUserPhotosIndexs(userId);

    try {
        let cityId = await getUserDataFieldFromField("city", "userId", userId);
        user.city = await citiesService.getCityFromId(cityId);
        let departmentId = await getUserDataFieldFromField("department", "userId", userId);
        user.department = await departmentsService.getDepartmentFromId(departmentId);
        let regionId = await getUserDataFieldFromField("region", "userId", userId);
        user.region = await regionsService.getRegionFromId(regionId);
    }
    catch (e) {
        // console.log(e)
        user.city = null;
        user.department = null;
        user.region = null;
    }
    return (user)
}

export function calculateDistance(lat1: string | Number, lng1: string | Number, lat2: string | Number, lng2: string | Number) {
    const R = 6371;

    if (!lat1 || !lng1 || !lat2 || !lng2) {
        return 0;
    }

    const lat1Rad = (Number(lat1) * Math.PI) / 180;
    const lon1Rad = (Number(lng1) * Math.PI) / 180;
    const lat2Rad = (Number(lat2) * Math.PI) / 180;
    const lon2Rad = (Number(lng2) * Math.PI) / 180;

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return parseFloat(distance.toFixed(1));
}

const getUserMinimalDatas = exports.getUserMinimalDatas = async (currentUser: User, userId: string, advancedOptions: { city: City } | null = null) => {
    let user = await userModel.getUserDatasFieldsFromUserId([
        "userId",
        "username",
        "firstName",
        "lastName",
        "age",
        "biography",
        "likes",
        "views",
        "fameRating",
        "status",
        "lastConnection",
        "gender",
        "sexualPreferences",
        "nbPhotos"
    ], userId);
    if (!user || !user.length)
        throw "User not found";
    user = user[0];
    if (user.age) {
        user.age = String(user.age.toISOString())
        if (user.age.length >= 10)
            user.age = user.age.slice(0, 10);
    }
    user.tags = await getUserTags(userId);
    user.isLiked = await isUserLiked(currentUser.userId, userId);
    user.likedYou = await isUserLiked(userId, currentUser.userId);

    user.commonTags = user.tags.reduce((a: number, tag: string) =>
        currentUser.tags && currentUser.tags.find((t: string) => t === tag) ? a + 1 : a, 0)

    const cityId = await getUserDataFieldFromField("city", "userId", userId);
    user.city = await citiesService.getCityFromId(cityId);

    // console.log("ADVANCED OPTIONS => ", advancedOptions)

    let cityReference = currentUser.city;
    if (advancedOptions && advancedOptions.city &&
        advancedOptions.city.gps_lat && advancedOptions.city.gps_lng) {
        cityReference = advancedOptions.city;
    }

    user.distance = calculateDistance(cityReference.gps_lat, cityReference.gps_lng,
        user.city.gps_lat, user.city.gps_lng);

    let departmentId = await getUserDataFieldFromField("department", "userId", userId);
    user.department = await departmentsService.getDepartmentFromId(departmentId);

    let regionId = await getUserDataFieldFromField("region", "userId", userId);
    user.region = await regionsService.getRegionFromId(regionId);
    // console.log(user)
    return (user)
}


/* //////////////////   V I E W S      //////////////////*/


const addView = exports.addView = async (userId: string, viewUserId: string) => {
    if (parseInt(userId) === parseInt(viewUserId))
        return;
    const res = await userViewsService.insertUserView(userId, viewUserId);
    if (res.affectedRows && !res.warningStatus) {
        await userModel.addUserView(viewUserId);
        await updateFameRating(viewUserId);
    }
    else
        throw "User already seen"
}

const getUserIdsViewedMe = exports.getUserIdsViewedMe = async (userId: string) => {
    return (await userViewsService.getUserIdsViewedMe(userId))
}


/* //////////////////   L I K E S      //////////////////*/


async function isUserLiked(userId: string | number, likeUserId: string | number) {
    let res = await userLikesService.isUserLiked(userId, likeUserId);
    if (res && res[0] &&
        parseInt(res[0].userId) === Number(userId) &&
        parseInt(res[0].likeUserId) === Number(likeUserId)) {
        return (true);
    }
    return (false);
}

const addLike = exports.addLike = async (userId: string, likedUserId: string) => {
    if (parseInt(userId) === parseInt(likedUserId))
        return;
    const res = await userLikesService.insertUserLike(userId, likedUserId);
    if (res.affectedRows && !res.warningStatus) {
        await userModel.addUserLike(likedUserId);
        await updateFameRating(likedUserId);
        if (await isUserLiked(likedUserId, userId)) {
            return (await conversationsService.createNewConv(userId, likedUserId));
        }
    }
    else
        throw "User already liked";
    return (null);
}

const removeLike = exports.removeLike = async (userId: string, likedUserId: string) => {
    const res = await userLikesService.deleteUserLike(userId, likedUserId);
    if (res.affectedRows && !res.warningStatus) {
        await userModel.deleteUserLike(likedUserId);
        if (await isUserLiked(likedUserId, userId)) {
            return (await conversationsService.deleteConvFromUserIds(userId, likedUserId));
        }
    }
}

const getUserIdsLikedMe = exports.getUserIdsLikedMe = async (userId: string) => {
    return (await userLikesService.getUserIdsLikedMe(userId))
}


/* //////////////////   C O N V E R S A T I O N S      //////////////////*/

const createUser = exports.createUser = async (datas: CreateUserDatas, fakeUser: boolean = false) => {

    try {

        const hashedPassword = await bcrypt.hash(datas.password, parseInt(process.env.BCRYPT_SALT as string))
        datas.password = hashedPassword;

        let city: CityObj | undefined;
        let tags: string[] | undefined;
        if (datas) {
            if (datas.city) {
                city = datas.city;
                delete datas.city;
            }
            if (datas.tags) {
                tags = datas.tags;
                delete datas.tags;
            }
        }
        await userModel.createUser(Object.keys(datas), datas);

        let data = await userModel.getUserDataFieldFromField("userId", "username", datas.username);
        const user = data[0];

        if (city) {
            await updateUserCity(city, user.userId);
        }
        if (tags) {
            await tagsService.updateUserTagsFromTags(user.userId, tags);
        }

        const token = jwt.sign({ accountConfirmed: true, id: user.userId }, process.env.JWT_SECRET);
        const url = `http://${process.env.FRONT_DOMAIN}:${process.env.FRONT_PORT}/signup?token=${token}`;

        if (fakeUser)
            return ({ token, user });
        try {
            await sendMail({
                from: process.env.MAIL_ADDRESS,
                to: datas.email,
                subject: "Confirm your account",
                text: `Click this link to confirm your account: ${url}`
            })
            await updateUserDataFieldFromUserId("confirmToken", token, user.userId)
        }
        catch (e) {
            userModel.deleteUser(user.userId);
            throw "";
        }
        return ({ token, user });
    }
    catch (e) {
        // console.log(e)
        throw "User creation failed"
    }
}


/////////////////////////////////////////////////////////
//                      U P D A T E                    //
/////////////////////////////////////////////////////////

const updateUserDataFieldFromUserId = exports.updateUserDataFieldFromUserId = async (field: string, dataField: string, userId: string | number) => {
    const res = await userModel.updateUserDataFieldFromUserId(field, dataField, userId)
    return (res)
}

const updateUserData = exports.updateUserData = async (keys: string[], values: string[], userId: number) => {
    const res = await userModel.updateUserDatasFieldsFromUserId(keys, values, userId);
    return (res)
}


async function updateLastConnection(userId: number | string) {
    return (await userModel.updateLastConnection(userId));
}

async function calculFameRating(userId: string | number) {

    const nbViews = await getUserDataFieldFromField("views", "userId", userId);
    const nbLikes = await getUserDataFieldFromField("likes", "userId", userId);
    const nbMatches = await getUserDataFieldFromField("matches", "userId", userId);

    const maxViews = await getMaxViews();
    const maxLikes = await getMaxLikes();
    const maxMatches = await getMaxMatches();

    let res = 1000;

    if (parseInt(maxMatches))
        res += ((parseInt(nbMatches) * 500) / parseInt(maxMatches))
    if (parseInt(maxLikes))
        res += ((parseInt(nbLikes) * 300) / parseInt(maxLikes));
    if (parseInt(maxViews))
        res += ((parseInt(nbViews) * 200) / parseInt(maxViews))
    res += (nbLikes - (nbViews / 3)) * 25;

    if (res > 2000)
        res = 2000;
    if (res < 0)
        res = 0;
    return ((res / 400).toFixed(1))
}

async function updateFameRating(userId: number | string) {
    const _fameRating = await calculFameRating(userId);
    await updateUserDataFieldFromUserId("fameRating", String(_fameRating), userId);
    return (_fameRating);
}

type CityObj = {
    id: number,
    name?: string,
    department_code: string,
    latitude?: number,
    longitude?: number
}

const updateUserCity = exports.updateUserCity = async (cityObj: CityObj, userId: number) => {
    const keys = [];
    const values = [];
    let city: Partial<CityObj> = {}
    if (cityObj.id)
        city = await citiesService.getCityFromId(cityObj.id);
    else if (cityObj.name && cityObj.latitude && cityObj.longitude) {
        const cities = await citiesService.getCitiesfromString(cityObj.name);
        city = cities.find((c: City) => c.slug === cityObj.name?.toLowerCase()) as Partial<City>;
    }
    if (!city)
        throw "";
    keys.push("city");
    values.push(city.id);

    let departmentObj = await departmentsService.getDepartmentFromCode(city.department_code as string);
    if (departmentObj) {
        keys.push("department");
        values.push(departmentObj.id);

        let regionObj = await regionsService.getRegionFromCode(departmentObj.region_code);
        if (regionObj) {
            keys.push("region");
            values.push(regionObj.id);
        }
    }
    await updateUserData(keys, values, userId)

    return (true)
}

const updateUserPhotos = exports.updateUserPhotos = async (userId: number, fileNames: string[], photosIndex: number[]) => {
    if (fileNames && photosIndex && photosIndex.length === fileNames.length) {
        const userPhotosPaths = await Promise.all(photosIndex.map(async (index: number) =>
            await userPhotosService.getPathFromIds(userId, index)
        ))
        const nbPhotos = await getUserDataFieldFromField("nbPhotos", "userId", userId);
        if (Number(photosIndex[photosIndex.length - 1] + 1) > Number(nbPhotos))
            await updateUserDataFieldFromUserId("nbPhotos", (Number(photosIndex[photosIndex.length - 1]) + 1).toString(), userId);
        await userPhotosService.updateUserPhotos(fileNames, photosIndex, userId);
        if (userPhotosPaths && userPhotosPaths.length) {
            userPhotosPaths.forEach((p: string) => {
                if (p)
                    fs.unlink(path.resolve(process.cwd() + `/uploads/${p}`), (err: NodeJS.ErrnoException | null) => {
                        if (err)
                            console.log("Error: updating photos from user ", userId, err)
                    })
            })
        }
    }
}

const updateUserStatusFromUserId = exports.updateUserStatusFromUserId = async (status: string, userId: string | number) => {
    if (status === "false")
        await updateLastConnection(userId)
    return (await userModel.updateUserStatusFromUserId(status, userId))
}

const updateConfirmAccountFromUserId = exports.updateConfirmAccountFromUserId = async (status: string, userId: string | number) => {
    return (await userModel.updateConfirmAccountFromUserId(status, userId))
}

const incrementUserNotif = exports.incrementUserNotif = async (userId: number | string) => {
    return (await userModel.incrementUserNotif(userId))
}

/////////////////////////////////////////////////////////
//                      D E L E T E                    //
/////////////////////////////////////////////////////////

const deleteUsers = exports.deleteUsers = async () => {
    return (await generalModels.truncateTables());
}

export default {
    sendMail,
    getAll,
    getUserDataFieldFromField,
    getUserDatasFieldsFromUserId,
    getPathFromIds,
    getUserTags,
    getMaxLikes,
    getMaxViews,
    getMaxMatches,
    getUserNotifications,
    getBrowseUserData,
    isAccountConfirmed,
    getBrowseUsersIds,
    dataAlreaydExists,
    getCurrentUserDatas,
    getUserMinimalDatas,
    addView,
    getUserIdsViewedMe,
    addLike,
    removeLike,
    getUserIdsLikedMe,
    createUser,
    updateUserDataFieldFromUserId,
    updateUserData,
    updateUserCity,
    updateUserPhotos,
    updateUserStatusFromUserId,
    updateConfirmAccountFromUserId,
    incrementUserNotif,
    deleteUsers
}