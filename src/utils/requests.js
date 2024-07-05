import axios from "axios";

export async function fetchRoute(addresses, modes) {
    const encodedAddresses = encodeURIComponent(JSON.stringify(addresses));
    const encodedModes = encodeURIComponent(JSON.stringify(modes));

    const URL = `/api/directions?addresses=${encodedAddresses}&modes=${encodedModes}`;

    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching route:", error);
        throw error;
    }
}