import { Request, Response } from 'express';
import userService from '~/services/user.service';
import tagsService from '~/services/tags.service';
import { City, Tag, User } from '~/type';
import { getUserAge, isDate, validEmail, validNames, validUsername } from '~/utils';
import citiesService from '~/services/cities.service';
import { Dirent } from 'fs';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const users = exports.users = async (req: Request, res: Response) => {
    try {
        const data = await userService.getAll();
        return (res.status(200).json({ data, message: "Users found" }))
    }
    catch (e) {
        return (res.status(404).json({ message: "Users not found" }));
    }
}

const deleteUsers = exports.deleteUsers = async (req: Request, res: Response) => {
    try {
        await userService.deleteUsers();
        fs.readdir("uploads/", (err: Error, files: string[] | Buffer[] | Dirent[]) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join("uploads/", file), (err: Error) => {
                    if (err) throw err;
                });
            }
        });
        return (res.status(200).json({ message: "Users datas deleted" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(500).json({ message: "Delete users datas failed", error: e }))
    }
}

const confirmAccount = exports.confirmAccount = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.token.id
        await userService.updateConfirmAccountFromUserId("true", userId)
        return (res.status(200).json({ message: "Account confirmed successfully" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(500).json({ message: "Account confirmed failed" }))
    }
}

const notifications = exports.notifications = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.token.id
        const notifications = await userService.getUserNotifications(parseInt(userId))
        return (res.status(200).json({ notifications, message: "Notifications successfully sent" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "User not found" }))
    }
}

const photo = exports.photo = async (req: Request, res: Response) => {
    try {
        let userId = res.locals.token.id;

        if (req.params.userId !== "me")
            userId = req.params.userId

        if (isNaN(Number(req.params.userId)) && req.params.userId !== "me")
            return (res.status(400).json({ message: "Invalid userId" }))
        if (isNaN(Number(req.params.id)))
            return (res.status(400).json({ message: "Invalid id" }))


        let pathFile = await userService.getPathFromIds(userId, parseInt(req.params.id));
        if (!pathFile)
            return (res.status(404).json({ message: "Photo/User not found" }))
        if (req.query.height) {
            sharp(path.join(__dirname, "../../uploads", pathFile))
                .resize({ height: parseInt(req.query.height as string) })
                .jpeg()
                .toBuffer()
                .then((data: any) => res.type('jpeg').status(200).send(data))
                .catch((err: Error) => {
                    console.log("Error: sharp resize function failed")
                    // console.log(err)
                })
        }
        else {
            sharp(path.join(__dirname, "../../uploads", pathFile))
                .jpeg()
                .toBuffer()
                .then((data: any) => res.type('jpeg').status(200).send(data))
                .catch((err: Error) => {
                    console.log("Error: sharp resize function failed")
                    // console.log(err)
                })
        }
    }
    catch (e) {
        // console.log(e)
        return (res.status(400).json({ message: "Photo not found" }))
    }
}


const tags = exports.tags = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.token.id;
        const tags = await userService.getUserTags(userId)
        return (res.status(200).json({ tags, message: "Tags successfully sent" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(200).json({ message: "Tags successfully sent" }))
    }
}

const recommandedUsers = exports.recommandedUsers = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.token.id;
        let users = await userService.getBrowseUsersIds(userId);
        users = users.map((o: User) => o.userId)
        return (res.status(200).json({ users, message: "Users recommanded sent" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(400).json({ message: "Users not found" }))
    }
}

const recommandedUsersOptions = exports.recommandedUsersOptions = async (req: Request, res: Response) => {
    if (!req.body)
        return (res.status(400).json({ message: "Advanced options required" }))
    try {

        const bodyKeys = Object.keys(req.body)

        if (bodyKeys.includes("ageGap") && (!req.body.ageGap || isNaN(req.body.ageGap)))
            return (res.status(400).json({ message: "Invalid ageGap" }))
        if (bodyKeys.includes("fameRatingGap") && (!req.body.fameRatingGap || isNaN(req.body.fameRatingGap)))
            return (res.status(400).json({ message: "Invalid fameRatingGap" }))
        if (bodyKeys.includes("city") && (typeof req.body.city !== "object" || !req.body.city.id))
            return (res.status(400).json({ message: "Invalid city" }))
        if (bodyKeys.includes("tags")) {
            if (!Array.isArray(req.body.tags) ||
                (req.body.tags.length && req.body.tags.every((e: string) => typeof e !== "string" || !e.match(/^[a-zA-Z]+$/))))
                return (res.status(400).json({ message: "Invalid tags" }))
        }

        const userId = res.locals.token.id;
        let users = await userService.getBrowseUsersIds(userId, req.body);
        users = users.map((o: User) => o.userId)
        return (res.status(200).json({ users, message: "Users recommanded sent" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(400).json({ message: "Users not found" }))
    }
}

const datas = exports.data = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.token.id;
        let user = await userService.getCurrentUserDatas(userId);
        if (!user)
            throw "User not found";
        if (req.params.id && parseInt(req.params.id) !== userId) {
            user = await userService.getUserMinimalDatas(user, req.params.id);
        }
        return (res.status(200).json({ user, message: "User data successfully sent" }))
    }
    catch (e) {
        // console.log(e);
        return (res.status(404).json({ message: "User not found" }));
    }
}

const datasOptions = exports.datasOptions = async (req: Request, res: Response) => {

    if (!req.body)
        return (res.status(400).json({ message: "Advanced options required" }))

    try {
        const userId = res.locals.token.id;
        let user = await userService.getCurrentUserDatas(userId);
        if (!user)
            throw "User not found";
        if (parseInt(req.params.id) !== userId) {
            user = await userService.getUserMinimalDatas(user, req.params.id, req.body);
        }
        return (res.status(200).json({ user, message: "User data successfully sent" }))
    }
    catch (e) {
        // console.log(e);
        return (res.status(404).json({ message: "User not found" }));
    }
}


//////////////////////////////////////////////////////////////////
//                           P O S T                            //
//////////////////////////////////////////////////////////////////


const CreateUserFields = [
    "email",
    "username",
    "firstName",
    "lastName",
    "password",
    "age",
    "city",
    "gender",
    "sexualPreferences",
    "biography",
    "tags"
]

export type CreateUserDatas = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    age?: string, // yyyy-dd-mm
    city?: City
    gender?: string,
    sexualPreferences?: string,
    biography?: string,
    tags?: string[]
}

const signup = exports.signup = async (req: Request, res: Response) => {

    if (!req.body || !req.body.email || !req.body.username ||
        !req.body.firstName || !req.body.lastName || !req.body.password)
        return (res.status(400).json({ message: "Missing fields - required [email, username, firstName, lastName, password]" }));
    try {

        const enableEmptyValues = ["biography"]

        const bodyKeys: string[] = Object.keys(req.body)

        if (bodyKeys.includes("username")) {
            if (!validUsername(req.body.username)) {
                return (res.status(400).json({ message: "Invalid username" }))
            }
            else if (await userService.dataAlreaydExists("username", req.body.username))
                return (res.status(400).json({ message: "Username already taken" }));
        }
        if (bodyKeys.includes("email")) {
            if (!validEmail(req.body.email))
                return (res.status(400).json({ message: "Invalid email" }))
            if (await userService.dataAlreaydExists("email", req.body.email))
                return (res.status(400).json({ message: "Email already taken" }));
        }
        if (bodyKeys.includes("password") && !req.body.password)
            return (res.status(400).json({ message: "Invalid password" }))
        if (bodyKeys.includes("biography")) {
            if (typeof req.body.biography !== "string")
                return (res.status(400).json({ message: "Invalid biography" }))
            if (!req.body.biography)
                delete req.body.biography
        }
        if (bodyKeys.includes("firstName") && !validNames(req.body.firstName))
            return (res.status(400).json({ message: "Invalid firstName" }))
        if (bodyKeys.includes("lastName") && !validNames(req.body.lastName))
            return (res.status(400).json({ message: "Invalid lastName" }))
        if (bodyKeys.includes("age") && !isDate(req.body.age)) {
            return (res.status(400).json({ message: "Invalid age" }))
        }
        if (bodyKeys.includes("city")) {
            try {
                req.body.city = await citiesService.getCityFromId(req.body.city.id);
                // await userService.updateUserCity(req.body.city, userId);
                // bodyKeys.splice(bodyKeys.indexOf("city"), 1);
            }
            catch (e) {
                return (res.status(400).json({ message: "Invalid city" }))
            }
        }
        if (bodyKeys.includes("gender") && !["female", "male", "not specified"].includes(req.body.gender))
            return (res.status(400).json({ message: "Invalid gender" }))
        if (bodyKeys.includes("sexualPreferences") && !["female", "male", "not specified"].includes(req.body.sexualPreferences)) {
            return (res.status(400).json({ message: "Invalid sexual preferences" }))
        }
        if (bodyKeys.includes("tags")) {
            if (!Array.isArray(req.body.tags) ||
                (req.body.tags.length && req.body.tags.every((e: string) => typeof e !== "string" || !e.match(/^[a-zA-Z]+$/))))
                return (res.status(400).json({ message: "Invalid tags" }))
        }

        const bodyValues: any[] = Object.values(req.body)

        let data: Partial<CreateUserDatas> = {};
        bodyKeys.forEach((k: string, index: number) => {
            if (k && CreateUserFields.includes(k) && bodyValues[index]) {
                data[k as keyof CreateUserDatas] = bodyValues[index]
            }
        });

        // console.log("data send to createUser => ", data)

        const fakeUser: boolean = Boolean(req.query.fakeUser)
        const { token } = await userService.createUser(data as CreateUserDatas, fakeUser)
        return (res.status(200).json({ token, message: "User created" }));
    }
    catch (e) {
        // console.log("erorr catched from controller => ", e)
        return (res.status(400).json({ message: "User creation failed" }));
    }
}

const signin = exports.signin = async (req: Request, res: Response) => {
    if (!req.body.username)
        return (res.status(400).json({ message: "Username required" }));
    if (!req.body.password || typeof req.body.password !== "string")
        return (res.status(400).json({ message: "Password required" }));
    if (typeof req.body.username !== "string")
        return (res.status(400).json({ message: "Invalid username" }));
    if (typeof req.body.password !== "string")
        return (res.status(400).json({ message: "Invalid password" }));

    try {
        const hashedPassword = await userService.getUserDataFieldFromField("password", "username", req.body.username);
        if (!hashedPassword)
            return (res.status(401).json({ message: "Email not found" }))
        const confimAccount = await userService.isAccountConfirmed(req.body.username);
        if (!confimAccount && !req.query.fakeUser)
            return (res.status(401).json({ message: "Account not confirmed" }))
        if (await bcrypt.compare(req.body.password, hashedPassword)) {
            const userId = await userService.getUserDataFieldFromField("userId", "username", req.body.username);
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return (res.status(200).json({ token: token, message: 'Signin succeed' }));
        }
        else
            return (res.status(404).json({ message: "User not found" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: 'User not found' }));
    }
}

const resetPassword = exports.resetPassword = async (req: Request, res: Response) => {
    if (!req.query.email)
        return (res.status(400).json({ message: "Email required" }));
    try {
        const userId = await userService.getUserDataFieldFromField("userId", "email", String(req.query.email));
        if (!userId)
            throw "";
        const token = jwt.sign({ resetPassword: true, id: userId }, process.env.JWT_SECRET, { expiresIn: 60 * 20 })
        const url = `http://${process.env.FRONT_DOMAIN}:${process.env.FRONT_PORT}/signin/resetPassword?token=${token}`;
        await userService.sendMail({
            from: process.env.MAIL_ADDRESS,
            to: req.query.email,
            subject: "Change your password",
            text: `Click this link to change your password: ${url}`
        })
        return (res.status(200).json({ message: "Mail sucessfuly send" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "Mail not found" }))
    }
}

const updatePassword = exports.updatePassword = async (req: Request, res: Response) => {

    if (!req.body.password)
        return (res.status(400).json({ message: "Password required" }));
    try {
        const bodyKeys = Object.keys(req.body)
        if (bodyKeys.includes("password") &&
            (typeof req.body.password !== "string" || !req.body.password || req.body.password.length > 100))
            return (res.status(400).json({ message: "Invalid password" }))
        let userId = res.locals.token.id;
        const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT as string))
        await userService.updateUserDataFieldFromUserId("password", hashedPassword, userId);
        return (res.status(200).json({ message: "Password updated" }));
    }
    catch (e) {
        // console.log(e);
        return (res.status(400).json({ message: "Invalid password" }));
    }
}


type UpdateDatas = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    age: number,
    city: any,
    gender: string,
    sexualPreferences: string,
    biography: string,
    tags: string[]
}


const UpdateUserFields = [
    "email",
    "username",
    "firstName",
    "lastName",
    "age",
    "city",
    "gender",
    "sexualPreferences",
    "biography",
    "tags"
]

const update = exports.update = async (req: Request, res: Response) => {
    try {

        const enableEmptyValues = ["biography"];
        const userId = res.locals.token.id;
        const bodyKeys: string[] = Object.keys(req.body)

        if (bodyKeys.includes("username")) {
            if (!validUsername(req.body.username)) {
                return (res.status(400).json({ message: "Invalid username" }))
            }
            try {
                const _userId = await userService.getUserDataFieldFromField("userId", "username", req.body.username);
                if (_userId && Number(userId) !== Number(_userId))
                    return (res.status(400).json({ message: "Username already taken" }));
            }
            catch (e) { }
        }
        if (bodyKeys.includes("email")) {
            if (!validEmail(req.body.email))
                return (res.status(400).json({ message: "Invalid email" }))
            try {
                const _userId = await userService.getUserDataFieldFromField("userId", "email", req.body.email);
                if (_userId && Number(userId) !== Number(_userId))
                    return (res.status(400).json({ message: "Email already taken" }));
            }
            catch (e) { }
        }
        if (bodyKeys.includes("password") && !req.body.password)
            return (res.status(400).json({ message: "Invalid password" }))
        if (bodyKeys.includes("firstName") && !validNames(req.body.firstName))
            return (res.status(400).json({ message: "Invalid firstName" }))
        if (bodyKeys.includes("lastName") && !validNames(req.body.lastName))
            return (res.status(400).json({ message: "Invalid lastName" }))
        if (bodyKeys.includes("age") && (!isDate(req.body.age) || getUserAge(req.body.age) < 18)) {
            return (res.status(400).json({ message: "Invalid age" }))
        }
        if (bodyKeys.includes("city")) {
            try {
                await userService.updateUserCity(req.body.city, userId);
                bodyKeys.splice(bodyKeys.indexOf("city"), 1);
            }
            catch (e) {
                return (res.status(400).json({ message: "Invalid city" }))
            }
        }
        if (bodyKeys.includes("gender") && !["female", "male", "not specified"].includes(req.body.gender))
            return (res.status(400).json({ message: "Invalid gender" }))
        if (bodyKeys.includes("sexualPreferences") && !["female", "male", "not specified"].includes(req.body.sexualPreferences)) {
            return (res.status(400).json({ message: "Invalid sexual preferences" }))
        }
        if (bodyKeys.includes("biography") && typeof req.body.biography !== "string") {
            return (res.status(400).json({ message: "Invalid biography" }))
        }
        if (bodyKeys.includes("tags")) {
            if (!Array.isArray(req.body.tags) ||
                (req.body.tags.length && req.body.tags.every((e: string) => typeof e !== "string" || !e.match(/^[a-zA-Z]+$/))))
                return (res.status(400).json({ message: "Invalid tags" }))
            try {
                await tagsService.updateUserTagsFromTags(userId, req.body.tags);
                bodyKeys.splice(bodyKeys.indexOf("tags"), 1);
            }
            catch (e) {
                return (res.status(400).json({ message: "Invalid tags" }))
            }
        }

        let data: Partial<UpdateDatas> = {};
        bodyKeys.forEach((k: string, index: number) => {
            if (k && UpdateUserFields.includes(k)) {
                data[k as keyof UpdateDatas] = req.body[k]
            }
        });

        const keys = Object.keys(data)
        const values = Object.values(data)

        if (keys && keys.length)
            data = await userService.updateUserData(keys, values, userId)

        return (res.status(200).json({ message: "User updated" }))
    }
    catch (e) {
        // console.log(e);
        return (res.status(400).json({ message: "Update failed" }))
    }
}

const maxFileSize = 1024 * 1024 * 50;

const upload = require('multer')({
    dest: 'uploads/',
    limits: { fileSize: maxFileSize },
    fileFilter: function (req: Request, file: any, cb: any) {
        const validTypes = ["image/jpeg", "image/png"]
        const fileSize = req.headers['content-length']
        if (!validTypes.includes(file.mimetype)) {
            return (cb(null, false, new Error("Invalid file (image/jpeg required)")))
        }
        else if (Number(fileSize) > maxFileSize) {
            return (cb(null, false, new Error("Invalid file (image/jpeg required)")))
        }
        return (cb(null, true))
    }
}).fields([{ name: 'file', maxCount: 5 }, { name: 'index', maxCount: 5 }])

const photos = exports.photos = async (req: Request & { files: any }, res: Response) => {

    await new Promise<void>((resolve) => {
        upload(req, res, function (err: Error) {
            resolve();
        })
    })

    try {
        if (!req.files || !req.files.file || !req.files.file.length)
            return (res.status(400).json({ Message: "Invalid extension or size" }))

        const userId = res.locals.token.id;

        let filesUploaded: string[] = [];
        let filesIdex: number[] = [];

        filesUploaded = req.files.file.map((f: any) => f.filename);
        filesIdex = [...req.body.index];

        await userService.updateUserPhotos(userId, filesUploaded, filesIdex);
        return (res.status(201).json({ message: "Profile picture uploaded" }))
    }
    catch (e) {
        // console.log(e);
        return (res.status(500).json({ message: "Profile picture upload failed" }));
    }
}

export default {
    users,
    deleteUsers,
    confirmAccount,
    notifications,
    photo,
    tags,
    recommandedUsers,
    recommandedUsersOptions,
    datas,
    datasOptions,
    signin,
    signup,
    resetPassword,
    updatePassword,
    update,
    photos
}