
export function dateToTimestamp(date) {

    if (date) {
        date = date.split("/")
        const newDate = new Date(date[2], date[1] - 1, date[0]);

        return newDate.getTime();
    }
}

