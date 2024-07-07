import axios from 'axios';

export async function fetchRoute(addresses, modes, dateTimeOption, dateTime) {
    const encodedAddresses = encodeURIComponent(JSON.stringify(addresses));
    const encodedModes = encodeURIComponent(JSON.stringify(modes));
    const encodedDateTimeOption = encodeURIComponent(dateTimeOption);
    const unixTimestamp = Math.floor(new Date(dateTime).getTime() / 1000); // Convert dateTime to Unix seconds

    const URL = `/api/directions?addresses=${encodedAddresses}&modes=${encodedModes}&dateTimeOption=${encodedDateTimeOption}&dateTime=${unixTimestamp}`;
    console.log(URL)

    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching route:", error);
        throw error;
    }
}
