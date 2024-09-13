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

export function convertDate(inputISOString: string) {
    const inputDate = new Date(inputISOString);
    const year = inputDate.getFullYear().toString().slice(-2);
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const day = inputDate.getDate().toString().padStart(2, '0');
    const hours = inputDate.getHours().toString().padStart(2, '0');
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');
    const seconds = inputDate.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}