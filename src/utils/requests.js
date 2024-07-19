import axios from 'axios';

export async function fetchRoute(addresses, modes, dateTimeOption, dateTime) {
    const encodedAddresses = encodeURIComponent(JSON.stringify(addresses));
    const encodedModes = encodeURIComponent(JSON.stringify(modes));

    const unixTimestamp = Math.floor(new Date(dateTime).getTime() / 1000); // Convert dateTime to Unix seconds.
    let URL = `/api/directions?addresses=${encodedAddresses}&modes=${encodedModes}`;
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
