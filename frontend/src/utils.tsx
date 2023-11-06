import { differenceInYears, parse } from "date-fns";

export function validateEmail(email: string) {
    return (email && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
}

export function validateNames(name: string) {
    return (name && name.match(/^[a-zA-Z]+$/))
}

export function getUserAge(userdate: string) {
    if (userdate && userdate.length)
        return (differenceInYears(new Date(), parse(userdate, "yyyy-MM-dd", new Date())));
}
