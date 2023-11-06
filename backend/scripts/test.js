
axios = require('axios')
url = `http://localhost:3000`


/*
app.get("/searchCity", generalController.searchCity) // ?city=xxxx
app.get("/geolocation", generalController.geolocation) // ?latitude=xxx&longitude=xxx
app.get("/randomCity", generalController.randomCity)

// USER 

app.get("/user/resetPassword", userController.resetPassword) // ?email=xxxx

app.get("/user/tags", JWTAuthentification, userController.tags)
app.get("/user/me", JWTAuthentification, userController.datas)
app.get("/user/notifications", JWTAuthentification, userController.notifications)
app.get("/user/recommandations", JWTAuthentification, userController.recommandedUsers)
app.get("/user/:id", JWTAuthentification, userController.datas)
app.get("/user/:userId/photo/:id", JWTAuthentification, userController.photo)
app.get("/user/me/photo/:id", JWTAuthentification, userController.photo)

app.post("/user/signin", userController.signin) // {username, password}
app.post("/user/signup?fakeUser=true", userController.signup) //  { email, username, firstName, lastName, password, city?}
app.post("/user/:id/advancedOptions", JWTAuthentification, userController.datasOptions)
app.post("/user/recommandations/options", JWTAuthentification, userController.recommandedUsersOptions)

app.patch("/user/update", JWTAuthentification, userController.update)
app.patch("/user/password", JWTAuthentification, userController.updatePassword) // { password }
app.patch("/user/confirmAccount", JWTAuthentification, userController.confirmAccount)
app.patch("/user/photos", JWTAuthentification, userController.photos)

app.delete("/user/deleteUsers", userController.deleteUsers)

// CONVERSATIONS

app.get("/conversations", JWTAuthentification, conversationsController.conversations)
app.get("/conversations/:id/messages", JWTAuthentification, conversationsController.messages)
app.get("/conversations/:id/lastMessage/:userId", JWTAuthentification, conversationsController.lastMessage)

// LIKES

app.get("/likes", JWTAuthentification, likesController.likes)
app.patch("/likes/:likeUserId/likeProfile", JWTAuthentification, likesController.likeProfile)
app.patch("/likes/:likeUserId/unlikeProfile", JWTAuthentification, likesController.unlikeProfile)

// VIEWS

app.get("/views", JWTAuthentification, viewsController.views)
app.patch("/views/:viewUserId/viewProfile", JWTAuthentification, viewsController.viewProfile)

// TAGS
app.get("/tags", tagsController.tags)

*/


userMinimum = {
    email: '1randomgy@gmail.com',
    username: 'mtellal',
    firstName: 'mtellal',
    lastName: 'mtellal',
    password: 'mtellal',
}

let numberUserCeated = 0;

async function testRequest(_url, method, data, status, token) {
    let response = null
    opts = {
        method,
        url: url + _url,
    }
    if (data)
        opts.data = data;
    if (token) {
        opts.headers = {
            authorization: `Bearer ${token}`
        }
    }
    // console.log(data)
    await axios(opts)
        .then((res) => {
            response = res.data
            if (res && res.status === status) {
                if (_url.startsWith("/user/signup?fakeUser=true") && res.status === 200)
                    numberUserCeated++;
                console.log(_url, ` ✅ - ${res.status} - ${status} - ${res.data.message} - ${JSON.stringify(res.data).slice(0, 40)}`)
            }
            else
                console.log(_url, ` ❌ - ${res.status} - ${status} - ${res.data.message} - ${JSON.stringify(res.data).slice(0, 40)}`)
        })
        .catch((err) => {
            if (err && err.response) {
                if (err && err.response && (err.response.status || err.response.statusCode) === status)
                    console.log(_url, ` ✅ - ${err.response.status} - ${status} - ${err.response.data.message}`)
                else
                    console.log(_url, ` ❌ - ${err.response.status} - ${status} - ${err.response && err.response.data.message}`)
            }
            else
                console.log(err)
        })
    return (response)
}

async function getToken(username, password) {
    try {
        const res = await axios.post(url + "/user/signin?fakeUser=true", { username, password })
        if (res && res.status === 200 && res.data && res.data.token)
            return (res.data.token)
    }
    catch (e) {
        // console.log(e)
        console.log("token not found")
    }
}


async function testSearchCity() {
    console.log(" SEARCH CITY ")
    await testRequest("/searchCity", "get", "", 400);
    await testRequest("/searchCity?dwfwdw", "get", "", 400);
    await testRequest("/searchCity?city=", "get", "", 400);
    await testRequest("/searchCity?city=lille", "get", "", 200);
    await testRequest("/searchCity?city=65", "get", "", 200);
}


async function testGeolocation() {
    console.log("\n GEOLOCATION ")
    await testRequest("/geolocation", "get", "", 400);
    await testRequest("/geolocation?dwfwdw", "get", "", 400);
    await testRequest("/geolocation?latitude='DEuserMinimumLETE USERS;'", "get", "", 400);
    await testRequest("/geolocation?latitude=wdfwfw", "get", "", 400);
    await testRequest("/geolocation?longitude=", "get", "", 400);
    await testRequest("/geolocation?longitude=654&latitude=", "get", "", 400);
    await testRequest("/geolocation?longitude=654&latitude=12.5", "get", "", 200);
}


async function testRandomCiy() {
    console.log("\n RANDOM CITY ")

    await testRequest("/randomCity", "get", "", 200);
}

async function testResetPassword() {
    console.log("\n RESET PASSWORD ")
    await testRequest(`/user/signup?fakeUser=true`, "post", { ...userMinimum, email: 'resetPassword@gmail.com', username: randomString() }, 200);
    await testRequest(`/user/resetPassword?email=resetPassword@gmail.com`, "get", "", 200);
    await testRequest(`/user/resetPassword?email=resetPassword@gmail.com`, "get", "", 200);
    await testRequest("/user/resetPassword", "get", "", 400);
    await testRequest("/user/resetPassword?dfwdfw", "get", "", 400);
    await testRequest("/user/resetPassword/654", "get", "", 404);
    await testRequest("/user/resetPassword/email", "get", "", 404);
    await testRequest("/user/resetPassword?email=wdfuwhfwfuh", "get", "", 404);
    await testRequest("/user/resetPassword?email=", "get", "", 400);
}

async function testSignup() {
    console.log("\n SIGNUP ")
    await testRequest("/user/signup?fakeUser=true", "post", {}, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { username: '' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { username: '', firstName: 'mtellal' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { username: '', firstName: 'mtellal' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { email: 'mtellal', username: '', firstName: 'mtellal', lastName: 'mtellal' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { email: 'mtellal', username: 'mtellal', firstName: 'mtellal', lastName: 'mtellal', password: 'mtellal' }, 400)

    console.log("creating an user")
    await testRequest("/user/signup?fakeUser=true", "post", userMinimum, 200)

    console.log("testing email")
    const email = randomMail()
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, username: randomString(), email }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, username: randomString(), email }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, username: randomString(), email: '' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, username: randomString(), email: 654 }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, username: randomString(), email: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, username: randomString(), email: ";DELETE USERS ;" }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, username: randomString(), email: "wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh" }, 400)

    console.log("testing username")
    const username = randomString()
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: '' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: 654 }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: ";DELETE USERS ;" }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: "wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh" }, 400)

    console.log("testing firstName")
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), firstName: 'firstName' }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), firstName: 'firstName' }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), firstName: '' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), firstName: 654 }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), firstName: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), firstName: ";DELETE USERS ;" }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), firstName: "wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh" }, 400)

    console.log("testing lastName")
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), lastName: 'lastName' }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), lastName: 'lastName' }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), lastName: '' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), lastName: 654 }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), lastName: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), lastName: ";DELETE USERS ;" }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), lastName: "wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh" }, 400)

    console.log("testing password")
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), password: 'password' }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), password: 'password' }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), password: '' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), password: 654 }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), password: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), password: ";DELETE USERS ;" }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), password: "wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh" }, 200)

    console.log("testing age")
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), age: '2000-01-01' }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), age: '1968-05-01' }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), age: '' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), age: 654 }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), age: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), age: ";DELETE USERS ;" }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), age: "wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh" }, 400)

    console.log("testing city")
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), city: { id: 5 } }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), city: { id: 150 } }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), city: '' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), city: 654 }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), city: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), city: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), city: ";DELETE USERS ;" }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), city: "wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh" }, 400)

    console.log("testing gender")
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), gender: "male" }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), gender: "female" }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), gender: "not specified" }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), gender: '' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), gender: 654 }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), gender: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), gender: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), gender: ";DELETE USERS ;" }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), gender: ";DELETE USERS wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh;" }, 400)

    console.log("testing sexualPreferences")
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), sexualPreferences: "male" }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), sexualPreferences: "female" }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), sexualPreferences: "not specified" }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), sexualPreferences: '' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), sexualPreferences: 654 }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), sexualPreferences: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), sexualPreferences: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), sexualPreferences: ";DELETE USERS ;" }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), sexualPreferences: ";DELETE USERS wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh;" }, 400)

    console.log("testing biography")
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), biography: "" }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), biography: "wdfiwfowhw[ofi w[odfihw fo[wihf w[ofih wf" }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), biography: 654 }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), biography: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), biography: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), biography: ";DELETE USERS ;" }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), biography: ";DELETE USERS ;wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhdfwfwfwfwdfwfwfdwfwfwdfw" }, 200)

    console.log("testing tags")
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), tags: ["technology", "movies", "science"] }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), tags: ["wdfw", "wdfwf", "wdfwfw"] }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), tags: [] }, 200)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), tags: '' }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), tags: 654 }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), tags: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), tags: { id: "fwfw" } }, 400)
    await testRequest("/user/signup?fakeUser=true", "post", { ...userMinimum, email: randomMail(), username: randomString(), tags: ";DELETE USERS ;" }, 400)

    let users;
    await axios.get(url + "/users")
        .then(res => {
            if (res && res.status === 200 && res.data && res.data.data)
                users = res.data.data;
        })
        .catch(err => { })
    console.log("total number created: ", numberUserCeated, users.length)
}


async function testSignin() {
    console.log("\n SIGNIN ")
    await testRequest(`/user/signup?fakeUser=true`, "post", { ...userMinimum, email: randomMail(), username: "signinTest", password: "signinTest" }, 200);

    console.log(" USERNAME ")
    await testRequest(`/user/signin`, "post", { username: "signinTest", password: "signinTest" }, 401);
    await testRequest(`/user/signin`, "post", { password: "signinTest", username: "signin" }, 404);
    await testRequest(`/user/signin`, "post", { password: "signinTest", username: ["dfw", "dfw"] }, 400);
    await testRequest(`/user/signin`, "post", { password: "signinTest", username: 56 }, 400);
    await testRequest(`/user/signin`, "post", { password: "signinTest", username: { username: "signinTest" } }, 400);
    await testRequest(`/user/signin`, "post", { password: "signinTest", username: 'TRUNCATE USERS;' }, 404);

    await testRequest(`/user/signin?fakeUser=true`, "post", { username: "signinTest", password: "signinTest" }, 200);
    await testRequest(`/user/signin?fakeUser=true`, "post", { password: "signinTest", username: "signin" }, 404);
    await testRequest(`/user/signin?fakeUser=true`, "post", { password: "signinTest", username: ["dfw", "dfw"] }, 400);
    await testRequest(`/user/signin?fakeUser=true`, "post", { password: "signinTest", username: 56 }, 400);
    await testRequest(`/user/signin?fakeUser=true`, "post", { password: "signinTest", username: { username: "signinTest" } }, 400);
    await testRequest(`/user/signin?fakeUser=true`, "post", { password: "signinTest", username: 'TRUNCATE USERwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhS;' }, 404);

    console.log(" PASSWORD ")
    await testRequest(`/user/signin`, "post", { username: "signinTest", password: "signinTest" }, 401);
    await testRequest(`/user/signin`, "post", { username: "signinTest", password: ["dfw", "dfw"] }, 400);
    await testRequest(`/user/signin`, "post", { username: "signinTest", password: 56 }, 400);
    await testRequest(`/user/signin`, "post", { username: "signinTest", password: { password: "signinTest" } }, 400);
    await testRequest(`/user/signin`, "post", { username: "signinTest", password: 'TRUNCATE USERS;' }, 401);
    await testRequest(`/user/signin`, "post", { username: "signinTest", password: "signinwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh" }, 401);

    await testRequest(`/user/signin?fakeUser=true`, "post", { username: "signinTest", password: "signinTest" }, 200);
    await testRequest(`/user/signin?fakeUser=true`, "post", { username: "signinTest", password: ["dfw", "dfw"] }, 400);
    await testRequest(`/user/signin?fakeUser=true`, "post", { username: "signinTest", password: 56 }, 400);
    await testRequest(`/user/signin?fakeUser=true`, "post", { username: "signinTest", password: { password: "signinTest" } }, 400);
    await testRequest(`/user/signin?fakeUser=true`, "post", { username: "signinTest", password: 'TRUNCATE USERS;' }, 404);
    await testRequest(`/user/signin?fakeUser=true`, "post", { username: "signinTest", password: "signinwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh" }, 404);

    await testRequest(`/user/signin`, "post", { username: randomString(), password: randomString() }, 404);
    await testRequest(`/user/signin?fakeUser=true`, "post", { password: "signinTest", username: { username: "signinTest" } }, 400);

}

async function testUserGet() {
    await testRequest("/user/signup?fakeUser=true", "post", {
        ...userMinimum,
        email: "userGet@gmail.com",
        username: 'userGet',
        password: 'userGet',
        age: '1999-10-10',
        city: { id: 5 },
        gender: 'male',
        sexualPreferences: 'not specified',
        tags: ["technology"]
    }, 200)
    const token = await getToken("userGet", "userGet");
    const resUser = await testRequest("/user/me", "get", { username: "userGet", password: "userGet" }, 200, token);

    console.log("\n tags")
    await testRequest("/user/tags", "get", "", 200, token);
    await testRequest("/user/tags", "get", "", 401);
    await testRequest("/user/tags", "get", "", 401, "dfwdwfwfwwfipwfuhwpfiuhwdwiuh");
    await testRequest("/user/tags/wdfwf", "get", "", 404, "dfwdwfwfwwfipwfuhwpfiuhwdwiuh");

    console.log("\n me")
    await testRequest("/user/me", "get", "", 200, token);
    await testRequest("/user/me", "get", "", 401);
    await testRequest("/user/me", "get", "", 401, "dfwdwfwfwwfipwfuhwpfiuhwdwiuh");
    await testRequest("/user/me/wdfwf", "get", "", 404, "dfwdwfwfwwfipwfuhwpfiuhwdwiuh");

    console.log("\n notifications")
    await testRequest("/user/notifications", "get", "", 200, token);
    await testRequest("/user/notifications", "get", "", 401);
    await testRequest("/user/notifications", "get", "", 401, "dfwdwfwfwwfipwfuhwpfiuhwdwiuh");
    await testRequest("/user/notifications/wdfwf", "get", "", 404, "dfwdwfwfwwfipwfuhwpfiuhwdwiuh");

    console.log("\n recommandations")
    await testRequest("/user/recommandations", "get", "", 200, token);
    await testRequest("/user/recommandations", "get", "", 401);
    await testRequest("/user/recommandations", "get", "", 401, "dfwdwfwfwwfipwfuhwpfiuhwdwiuh");
    await testRequest("/user/recommandations/wdfwf", "get", "", 404, "dfwdwfwfwwfipwfuhwpfiuhwdwiuh");

    console.log("\n id")
    await testRequest("/user/", "get", "", 404, token);
    await testRequest("/user/wdfww", "get", "", 401);
    await testRequest("/user/wdfww", "get", "", 404, token);
    await testRequest(`/user/${resUser.user.userId}`, "get", "", 200, token);
    await testRequest("/user/16464684684", "get", "", 404, token);
    await testRequest("/user/';DELETE USERS';", "get", "", 404, token);

    console.log("\n photo id by userId")
    await testRequest("/user/wdfwfw/photo/", "get", "", 404, token);
    await testRequest("/user/wdfwfw/photo/0", "get", "", 400, token);
    await testRequest("/user/wdfwfw/photo/0", "get", "", 401);
    await testRequest("/user/1/photo/0", "get", "", 404, token);
    await testRequest("/user/1/photo/wdfw", "get", "", 400, token);
    await testRequest("/user/1/photo/", "get", "", 404, token);
    await testRequest("/user/1/photo/;TRUNCATE USERS;", "get", "", 400, token);

    console.log("\n photo id ")
    await testRequest("/user/me/photo/", "get", "", 404, token);
    await testRequest("/user/me/photo/0", "get", "", 404, token);
    await testRequest("/user/me/photo/0", "get", "", 401);
    await testRequest("/user/me/photo/0", "get", "", 404, token);
    await testRequest("/user/me/photo/wdfw", "get", "", 400, token);
    await testRequest("/user/me/photo/", "get", "", 404, token);
    await testRequest("/user/me/photo/;TRUNCATE USERS;", "get", "", 400, token);
}

async function testUserPost() {
    /*
app.post("/user/:id/options", JWTAuthentification, userController.datasOptions)
app.post("/user/recommandations/options", JWTAuthentification, userController.recommandedUsersOptions)

    */
    const res1 = await testRequest("/user/signup?fakeUser=true", "post", {
        ...userMinimum,
        email: "userPost1@gmail.com",
        username: 'userPost1',
        password: 'userPost1',
        age: '1999-10-10',
        city: { id: 862 },
        gender: 'male',
        sexualPreferences: 'not specified',
        tags: ["technology"]
    }, 200)

    const res2 = await testRequest("/user/signup?fakeUser=true", "post", {
        ...userMinimum,
        email: "userPost2@gmail.com",
        username: 'userPost2',
        password: 'userPost2',
        age: '1999-10-10',
        city: { id: 50 },
        gender: 'male',
        sexualPreferences: 'not specified',
        tags: ["technology"]
    }, 200)

    const resCity = await testRequest("/randomCity", "get", "", 200)

    const token1 = await getToken("userPost1", "userPost1")
    const token2 = await getToken("userPost2", "userPost2")

    const resUser1 = await testRequest("/user/me", "get", "", 200, token1)
    const resUser2 = await testRequest("/user/me", "get", "", 200, token2)

    const resDefault = await testRequest(`/user/${resUser2.user.userId}`, "get", "", 200, token1);
    const resOptions = await testRequest(`/user/${resUser2.user.userId}/options`, "post", { city: resCity.data }, 200, token1);

    // console.log(resDefault.user.distance, resOptions.user.distance)

    console.log("\n options")
    await testRequest(`/user/${resUser1.user.userId}/options`, "post", { city: resCity.data }, 200, token2);
    await testRequest(`/user/${resUser1.user.userId}/options`, "post", { city: resCity.data }, 200, token1);
    await testRequest(`/user/wdfwwdfw/options`, "post", { city: resCity.data }, 404, token1);
    await testRequest(`/user/wdfwwdfw/options/wdf`, "post", { city: resCity.data }, 404, token1);
    await testRequest(`/user/wdfwwdfw/options/wdf`, "post", {}, 404, token1);
    await testRequest(`/user/wdfwwdfw/options`, "post", {}, 404, token1);
    await testRequest(`/user/${resUser1.user.userId}/options`, "post", {}, 200, token1);
    await testRequest(`/user/${resUser1.user.userId}/options`, "post", { city: '' }, 200, token1);
    await testRequest(`/user/${resUser2.user.userId}/options`, "post", { city: { gps_lng: ";TRUNCATE USERS;", gps_lat: 5 } }, 200, token1);
    await testRequest(`/user/${resUser2.user.userId}/options`, "post", { city: { gps_lng: ";TRUNCATE USwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohdwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhERS;", gps_lat: 5 } }, 200, token1);

    console.log("\n recommandations options")
    console.log(" ageGap ")
    // options = {ageGap: number, fameRatingGap: number, tags: string[], city: City | {id: 5, ...} }
    await testRequest(`/user/recommandations/options`, "post", { ageGap: 1 }, 200, token2);
    await testRequest(`/user/recommandations/options`, "post", { ageGap: 10 }, 200, token2);
    await testRequest(`/user/recommandations/options`, "post", { ageGap: 1000 }, 200, token2);
    await testRequest(`/user/recommandations/options`, "post", { ageGap: '' }, 400, token2);
    await testRequest(`/user/recommandations/options`, "post", { ageGap: {} }, 400, token2);
    await testRequest(`/user/recommandations/options`, "post", { ageGap: ';TRUNCATEwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dh USERS;' }, 400, token2);

    await testRequest(`/user/recommandations/options`, "post", { fameRatingGap: 0.1 }, 200, token2);
    await testRequest(`/user/recommandations/options`, "post", { fameRatingGap: 3 }, 200, token2);
    await testRequest(`/user/recommandations/options`, "post", { fameRatingGap: 5 }, 200, token2);
    await testRequest(`/user/recommandations/options`, "post", { fameRatingGap: '' }, 400, token2);
    await testRequest(`/user/recommandations/options`, "post", { fameRatingGap: {} }, 400, token2);
    await testRequest(`/user/recommandations/options`, "post", { fameRatingGap: ';TRUwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhNCATE USERS;' }, 400, token2);

    await testRequest(`/user/recommandations/options`, "post", { tags: ["movies"] }, 200, token2);
    await testRequest(`/user/recommandations/options`, "post", { tags: ["technology"] }, 200, token2);
    await testRequest(`/user/recommandations/options`, "post", { tags: 1000 }, 400, token2);
    await testRequest(`/user/recommandations/options`, "post", { tags: '' }, 400, token2);
    await testRequest(`/user/recommandations/options`, "post", { tags: {} }, 400, token2);
    await testRequest(`/user/recommandations/options`, "post", { tags: ';TRUNwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhCATE USERS;' }, 400, token2);

    await testRequest(`/user/recommandations/options`, "post", { city: resCity.data }, 200, token1);
    await testRequest(`/user/recommandations/options`, "post", { city: { id: 50 } }, 200, token2);
    await testRequest(`/user/recommandations/options`, "post", { city: { id: ';TRUNCATE USERS;' } }, 400, token2);
    await testRequest(`/user/recommandations/options`, "post", { city: 1000 }, 400, token2);
    await testRequest(`/user/recommandations/options`, "post", { city: '' }, 400, token2);
    await testRequest(`/user/recommandations/options`, "post", { city: {} }, 400, token2);
    await testRequest(`/user/recommandations/options`, "post", { city: ';TRUNCAwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhTE USERS;' }, 400, token2);


    await testRequest(`/user/recommandations/options`, "post", { city: resCity.data, ageGap: '' }, 400, token1);
    await testRequest(`/user/recommandations/options`, "post", { city: resCity.data, ageGap: 1 }, 200, token1);
    await testRequest(`/user/recommandations/options`, "post", { city: resCity.data, ageGap: 10 }, 200, token1);
    await testRequest(`/user/recommandations/options`, "post", { city: resCity.data, ageGap: 10, fameRatingGap: '' }, 400, token1);
    await testRequest(`/user/recommandations/options`, "post", { city: resCity.data, ageGap: 10, fameRatingGap: 0.5, tags: [] }, 200, token1);
    await testRequest(`/user/recommandations/options`, "post", { city: resCity.data, ageGap: 10, fameRatingGap: 0.5, tags: ["technology"] }, 200, token1);
    await testRequest(`/user/recommandations/options`, "post", { city: resCity.data, ageGap: 10, fameRatingGap: 0.5, tags: "" }, 400, token1);

}

async function testUserPath() {
    /* 
    app.patch("/user/update", JWTAuthentification, userController.update)
    app.patch("/user/password", JWTAuthentification, userController.updatePassword) // { password }
    app.patch("/user/confirmAccount", JWTAuthentification, userController.confirmAccount)
    */

    /*
    username: string,
    email?: string,
    firstName: string,
    lastName: string,
    age: string, //yyyy-dd-mm 
    city: City | string
    gender: string,
    sexualPreferences: string,
    biography: string,
    tags?: string[],
    */


    const user = {
        ...userMinimum,
        email: "userPatch@gmail.com",
        username: 'userPatch',
        password: 'userPatch',
        age: '1999-10-10',
        city: { id: 862 },
        gender: 'male',
        sexualPreferences: 'not specified',
        tags: ["technology"]
    }

    const user2 = {
        ...userMinimum,
        email: "userPatch2@gmail.com",
        username: 'userPatch2',
        password: 'userPatch2',
        age: '1999-10-10',
        city: { id: 862 },
        gender: 'male',
        sexualPreferences: 'not specified',
        tags: ["technology"]
    }

    await testRequest("/user/signup?fakeUser=true", "post", user, 200)
    await testRequest("/user/signup?fakeUser=true", "post", user2, 200)

    const token = await getToken("userPatch", "userPatch")
    const token2 = await getToken("userPatch2", "userPatch2")

    const resCity = await testRequest("/randomCity", "get", "", 200)


    console.log(" udpate ")

    console.log('username')
    await testRequest("/user/update", "patch", { username: "username" }, 200, token)
    await testRequest("/user/update", "patch", { username: "username" }, 200, token)
    await testRequest("/user/update", "patch", { username: "userPatch2" }, 400, token)
    await testRequest("/user/update", "patch", { username: "" }, 400, token)
    await testRequest("/user/update", "patch", { username: {} }, 400, token)
    await testRequest("/user/update", "patch", { username: { username: '' } }, 400, token)
    await testRequest("/user/update", "patch", { username: [] }, 400, token)
    await testRequest("/user/update", "patch", { username: [''] }, 400, token)
    await testRequest("/user/update", "patch", { username: ';TRUNCATE USERS;' }, 400, token)
    await testRequest("/user/update", "patch", { username: ';TRUNCAwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhTE USERS;' }, 400, token)

    console.log('email')
    await testRequest("/user/update", "patch", { email: "userPatch654654@gmail.com" }, 200, token)
    await testRequest("/user/update", "patch", { email: "userPatch654654@gmail.com" }, 200, token)
    await testRequest("/user/update", "patch", { email: "userPatch2@gmail.com" }, 400, token)
    await testRequest("/user/update", "patch", { email: "" }, 400, token)
    await testRequest("/user/update", "patch", { email: {} }, 400, token)
    await testRequest("/user/update", "patch", { email: { username: '' } }, 400, token)
    await testRequest("/user/update", "patch", { email: [] }, 400, token)
    await testRequest("/user/update", "patch", { email: [''] }, 400, token)
    await testRequest("/user/update", "patch", { email: ';TRUNCATE USERS;' }, 400, token)
    await testRequest("/user/update", "patch", { email: ';TRUNCATE USERSTRUNCAwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhTE USERS;;' }, 400, token)


    console.log('firstName')
    await testRequest("/user/update", "patch", { firstName: "userPatch" }, 200, token)
    await testRequest("/user/update", "patch", { firstName: "userPatch" }, 200, token)
    await testRequest("/user/update", "patch", { firstName: "" }, 400, token)
    await testRequest("/user/update", "patch", { firstName: {} }, 400, token)
    await testRequest("/user/update", "patch", { firstName: { username: '' } }, 400, token)
    await testRequest("/user/update", "patch", { firstName: [] }, 400, token)
    await testRequest("/user/update", "patch", { firstName: [''] }, 400, token)
    await testRequest("/user/update", "patch", { firstName: ';TRUNCATE USERS;' }, 400, token)
    await testRequest("/user/update", "patch", { firstName: ';TRUTRUNCAwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhTE USERS;NCATE USERS;' }, 400, token)


    console.log('lastName')
    await testRequest("/user/update", "patch", { lastName: "userPatch" }, 200, token)
    await testRequest("/user/update", "patch", { lastName: "userPatch" }, 200, token)
    await testRequest("/user/update", "patch", { lastName: "" }, 400, token)
    await testRequest("/user/update", "patch", { lastName: {} }, 400, token)
    await testRequest("/user/update", "patch", { lastName: { username: '' } }, 400, token)
    await testRequest("/user/update", "patch", { lastName: [] }, 400, token)
    await testRequest("/user/update", "patch", { lastName: [''] }, 400, token)
    await testRequest("/user/update", "patch", { lastName: ';TRUNCATE USERS;' }, 400, token)
    await testRequest("/user/update", "patch", { lastName: ';TRUNCTRUNCAwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhTE USERS;ATE USERS;' }, 400, token)

    console.log('age')
    await testRequest("/user/update", "patch", { age: "2000-01-01" }, 200, token)
    await testRequest("/user/update", "patch", { age: "2000-01-01" }, 200, token)
    await testRequest("/user/update", "patch", { age: "2010-01-01" }, 400, token)
    await testRequest("/user/update", "patch", { age: "201001-01-01" }, 400, token)
    await testRequest("/user/update", "patch", { age: "" }, 400, token)
    await testRequest("/user/update", "patch", { age: {} }, 400, token)
    await testRequest("/user/update", "patch", { age: { username: '' } }, 400, token)
    await testRequest("/user/update", "patch", { age: [] }, 400, token)
    await testRequest("/user/update", "patch", { age: [''] }, 400, token)
    await testRequest("/user/update", "patch", { age: ';TRUNCATE USERS;' }, 400, token)
    await testRequest("/user/update", "patch", { age: ';TRUNCTRUNCAwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhTE USERS;ATE USERS;' }, 400, token)

    console.log('city')
    await testRequest("/user/update", "patch", { city: resCity.data }, 200, token)
    await testRequest("/user/update", "patch", { city: resCity.data }, 200, token)
    await testRequest("/user/update", "patch", { city: { id: 5 } }, 200, token)
    await testRequest("/user/update", "patch", { city: "" }, 400, token)
    await testRequest("/user/update", "patch", { city: {} }, 400, token)
    await testRequest("/user/update", "patch", { city: { username: '' } }, 400, token)
    await testRequest("/user/update", "patch", { city: [] }, 400, token)
    await testRequest("/user/update", "patch", { city: [''] }, 400, token)
    await testRequest("/user/update", "patch", { city: ';TRUNCATE USERS;' }, 400, token)
    await testRequest("/user/update", "patch", { city: ';TRUNCTRUNCAwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhTE USERS;ATE USERS;' }, 400, token)

    console.log('gender')
    await testRequest("/user/update", "patch", { gender: 'male' }, 200, token)
    await testRequest("/user/update", "patch", { gender: 'male' }, 200, token)
    await testRequest("/user/update", "patch", { gender: 'not specified' }, 200, token)
    await testRequest("/user/update", "patch", { gender: "" }, 400, token)
    await testRequest("/user/update", "patch", { gender: {} }, 400, token)
    await testRequest("/user/update", "patch", { gender: { username: '' } }, 400, token)
    await testRequest("/user/update", "patch", { gender: [] }, 400, token)
    await testRequest("/user/update", "patch", { gender: [''] }, 400, token)
    await testRequest("/user/update", "patch", { gender: ';TRUNCATE USERS;' }, 400, token)
    await testRequest("/user/update", "patch", { gender: ';TRUTRUNCAwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhTE USERS;NCATE USERS;' }, 400, token)

    console.log('secual preferences')
    await testRequest("/user/update", "patch", { sexualPreferences: 'male' }, 200, token)
    await testRequest("/user/update", "patch", { sexualPreferences: 'male' }, 200, token)
    await testRequest("/user/update", "patch", { sexualPreferences: 'not specified' }, 200, token)
    await testRequest("/user/update", "patch", { sexualPreferences: "" }, 400, token)
    await testRequest("/user/update", "patch", { sexualPreferences: {} }, 400, token)
    await testRequest("/user/update", "patch", { sexualPreferences: { username: '' } }, 400, token)
    await testRequest("/user/update", "patch", { sexualPreferences: [] }, 400, token)
    await testRequest("/user/update", "patch", { sexualPreferences: [''] }, 400, token)
    await testRequest("/user/update", "patch", { sexualPreferences: ';TRUNCATE USERS;' }, 400, token)
    await testRequest("/user/update", "patch", { sexualPreferences: ';TRUTRUNCAwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhTE USERS;NCATE USERS;' }, 400, token)

    console.log('biography')
    await testRequest("/user/update", "patch", { biography: 'wdfipygfpwifgw' }, 200, token)
    await testRequest("/user/update", "patch", { biography: 'wdfipygfpwifgw' }, 200, token)
    await testRequest("/user/update", "patch", { biography: '' }, 200, token)
    await testRequest("/user/update", "patch", { biography: {} }, 400, token)
    await testRequest("/user/update", "patch", { biography: { username: '' } }, 400, token)
    await testRequest("/user/update", "patch", { biography: [] }, 400, token)
    await testRequest("/user/update", "patch", { biography: [''] }, 400, token)
    await testRequest("/user/update", "patch", { biography: ';TRUNCATE USERS;' }, 200, token)
    await testRequest("/user/update", "patch", { biography: ';TRUNCTRUNCAwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhTE USERS;ATE USERS;' }, 200, token)

    console.log('tags')
    await testRequest("/user/update", "patch", { tags: ["technology"] }, 200, token)
    await testRequest("/user/update", "patch", { tags: ["technology"] }, 200, token)
    await testRequest("/user/update", "patch", { tags: ["technology", "movies"] }, 200, token)
    await testRequest("/user/update", "patch", { tags: [] }, 200, token)
    await testRequest("/user/update", "patch", { tags: '' }, 400, token)
    await testRequest("/user/update", "patch", { tags: {} }, 400, token)
    await testRequest("/user/update", "patch", { tags: { username: '' } }, 400, token)
    await testRequest("/user/update", "patch", { tags: [''] }, 400, token)
    await testRequest("/user/update", "patch", { tags: ';TRUNCATE USERS;' }, 400, token)


    // /user/password
    console.log('password')
    await testRequest("/user/password", "patch", { password: "userPatchPassword" }, 200, token)
    await testRequest("/user/password", "patch", { password: "userPatch" }, 200, token)
    await testRequest("/user/password", "patch", { password: "" }, 400, token)
    await testRequest("/user/password", "patch", { password: {} }, 400, token)
    await testRequest("/user/password", "patch", { password: { username: '' } }, 400, token)
    await testRequest("/user/password", "patch", { password: [] }, 400, token)
    await testRequest("/user/password", "patch", { password: [''] }, 400, token)
    await testRequest("/user/password", "patch", { password: "wdpifuwgdfpiuwdghwpdifuhwfpiuwdhfpwidufhwfpiuhwdfpiuwhpiduhfwpifuhwfipuwdhfpiuhdwpifuhwpifuhwfpidhhwpidfuhwfpiuwhfpwiuhfwpifuhwdfpiuwhfwpiufhwpifuhwfipuhwdfpiuwhfpiwudhfwpdiufhwdpifuhwpfiuwhdfpiwduhfwpiufhwpifuwdhfpwiufhwpiufhwf9uph9-wduvhfiuhwpiduf" }, 400, token)
    await testRequest("/user/password", "patch", { password: ';TRUNCATE USERS;' }, 200, token)
    await testRequest("/user/password", "patch", { password: ';TRUNCATE USTRUNCAwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhwd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[wd[ofhwdf[owdhf[wofhwf[ohd[ofhwo[dhTE USERS;ERS;' }, 400, token)

    console.log('confirmAccount')
    await testRequest("/user/confirmAccount", "patch", { password: "userPatchPassword" }, 200, token)
    await testRequest("/user/confirmAccount", "patch", { password: "userPatch" }, 200, token)
    await testRequest("/user/confirmAccount", "patch", { password: "" }, 200, token)

}

async function testUserInteractions() {
    const user = {
        ...userMinimum,
        email: "conv@gmail.com",
        username: 'conv',
        password: 'conv',
        age: '2000-10-10',
        city: { id: 862 },
        gender: 'male',
        sexualPreferences: 'not specified',
        tags: ["technology"]
    }

    const user2 = {
        ...userMinimum,
        email: "conv2@gmail.com",
        username: 'conv2',
        password: 'conv2',
        age: '2000-10-10',
        city: { id: 862 },
        gender: 'male',
        sexualPreferences: 'not specified',
        tags: ["technology"]
    }

    await testRequest("/user/signup?fakeUser=true", "post", user, 200)
    await testRequest("/user/signup?fakeUser=true", "post", user2, 200)

    const token = await getToken("conv", "conv")
    const token2 = await getToken("conv2", "conv2")

    const resUser1 = await testRequest("/user/me", "get", "", 200, token)
    const resUser2 = await testRequest("/user/me", "get", "", 200, token2)

    console.log("views")
    await testRequest("/views", "get", "", 200, token)
    await testRequest(`/views/${resUser2.user.userId}/viewProfile`, "patch", "", 200, token)
    await testRequest(`/views/${resUser1.user.userId}/viewProfile`, "patch", "", 200, token)
    await testRequest(`/views/wdfwd/viewProfile`, "patch", "", 400, token)

    await testRequest("/views", "get", "", 200, token2)
    await testRequest(`/views/${resUser2.user.userId}/viewProfile`, "patch", "", 200, token2)
    await testRequest(`/views/${resUser1.user.userId}/viewProfile`, "patch", "", 200, token2)
    await testRequest(`/views/wdfwd/viewProfile`, "patch", "", 400, token2)

    console.log("likes")
    await testRequest("/likes", "get", "", 200, token)
    await testRequest(`/likes/${resUser2.user.userId}/likeProfile`, "patch", "", 200, token)
    await testRequest(`/likes/${resUser1.user.userId}/likeProfile`, "patch", "", 200, token)
    await testRequest(`/likes/wdfwd/likeProfile`, "patch", "", 400, token)

    await testRequest("/likes", "get", "", 200, token2)
    await testRequest(`/likes/${resUser2.user.userId}/likeProfile`, "patch", "", 200, token2)
    await testRequest(`/likes/${resUser1.user.userId}/likeProfile`, "patch", "", 200, token2)
    await testRequest(`/likes/wdfwd/likeProfile`, "patch", "", 400, token2)

    await testRequest("/likes", "get", "", 200, token)
    await testRequest(`/likes/${resUser2.user.userId}/unlikeProfile`, "patch", "", 200, token)
    await testRequest(`/likes/${resUser1.user.userId}/unlikeProfile`, "patch", "", 200, token)
    await testRequest(`/likes/wdfwd/unlikeProfile`, "patch", "", 400, token)

    console.log("conversations")
    await testRequest("/conversations", "get", "", 200, token)
    await testRequest("/conversations/wdfw/messages", "get", "", 400, token)
    await testRequest("/conversations/wdfw/lastMessage", "get", "", 400, token)
}

function randomString() {
    var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var string = '';
    for (var ii = 0; ii < 15; ii++) {
        string += chars[Math.floor(Math.random() * chars.length)];
    } 401
    return (string)
}

function randomMail() {
    return (randomString() + "@gmail.com")
}

async function deleteUsers() {
    console.log(" DELETE USERS ")
    await axios.delete(url + "/user/deleteUsers")
}

async function test() {
    const options = {
        searchCity: testSearchCity,
        geolocation: testGeolocation,
        randomCity: testRandomCiy,
        signup: testSignup,
        resetPassword: testResetPassword,
        signin: testSignin,
        userGet: testUserGet,
        userPost: testUserPost,
        userPatch: testUserPath,
        userInteractions: testUserInteractions
    }

    if (process.argv.length < 4 || process.argv[3] !== "--nodelete")
        await deleteUsers();

    const keys = Object.keys(options);

    if (process.argv.length >= 3 && keys.includes(process.argv[2]))
        await options[process.argv[2]]()
    else {
        await testSearchCity()
        await testGeolocation()
        await testRandomCiy();
        await testSignup()
        await testResetPassword()
        await testSignin()
        await testUserGet()
        await testUserPost()
        await testUserPath()
        await testUserInteractions()
    }
}

test();
