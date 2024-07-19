import axios from 'axios';

export async function fetchRoute(addresses, modes, dateTimeOption, dateTime) {
    const encodedAddresses = encodeURIComponent(JSON.stringify(addresses));
    const encodedModes = encodeURIComponent(JSON.stringify(modes));

    // Get the user's time zone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const encodeTimeZone = encodeURIComponent(timeZone)

    // Base url
    let URL = `/api/directions?addresses=${encodedAddresses}&modes=${encodedModes}&timeZone=${encodeTimeZone}`;

    // Add departure / arrival times using Unix timestamp
    const unixTimestamp = Math.floor(new Date(dateTime).getTime() / 1000); 
    if (dateTimeOption == "Depart at") {
        URL += `&departAt=${unixTimestamp}`;
    } else if (dateTimeOption == "Arrive by") {
        URL += `&arriveBy=${unixTimestamp}`;
    } 
    console.log(URL)

    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching route:", error);
        throw error;
    }
}
