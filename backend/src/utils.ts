import { differenceInYears, parse } from "date-fns";

export function getUserAge(userdate: string) {
    if (userdate && typeof userdate === "string" && userdate.length)
        return (differenceInYears(new Date(), parse(userdate, "yyyy-MM-dd", new Date())));
    return (0)
}

export function isDate(date: string) {
    return (typeof date === "string" && !isNaN(new Date(date).getDate()));
}

export function validEmail(email: string) {
    return (email && typeof email === "string" && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
}

export function validUsername(username: string) {
    return (username && typeof username === "string" && username.match(/^[a-zA-Z0-9]+$/))
}

export function validNames(name: string) {
    return (name && typeof name === "string" && name.match(/^[a-zA-Z]+$/))
}

export function validNumber(number: string) {
    return (number && typeof number === "string" && number.match(/^[0-9]+$/))

}