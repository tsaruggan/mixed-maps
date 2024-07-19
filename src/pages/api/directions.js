import axios from "axios";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let { addresses, modes, arriveBy, departAt, timeZone } = req.query;

    const addressArray = JSON.parse(decodeURIComponent(addresses));
    const modesArray = JSON.parse(decodeURIComponent(modes));
    const decodedTimeZone = decodeURIComponent(timeZone);

    let route = null;
    try {
      if (departAt) {
        route = await routeTripFromDeparture(addressArray, modesArray, Number(departAt), decodedTimeZone);
      } else if (arriveBy) {
        route = await routeTripFromArrival(addressArray, modesArray, Number(arriveBy), decodedTimeZone);
      } else { 
        const now = Math.floor(Date.now() / 1000);
        route = await routeTripFromDeparture(addressArray, modesArray, now, decodedTimeZone);
      }
      res.status(200).json(route);
    } catch (error) {
      console.error('Error processing request:', error.message);
      res.status(500).json({ error: 'Failed to fetch directions. Please try again later.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function routeTripFromDeparture(addresses, modes, departAt, timeZone) {
  let departureTime = departAt;
  let directions = [];
  for (let i = 0; i < addresses.length-1; i++) {
    let startAddress = addresses[i];
    let endAddress = addresses[i+1];
    let mode = modes[i];

    try {
      let directionResponse = await getDirectionsFromDeparture(startAddress, endAddress, mode, departureTime);

      if (!validateDirectionResponse(directionResponse)) {
        throw new Error(`Invalid response`);
      }

      let direction = parseDirectionResponseFromDeparture(directionResponse, departureTime);
      directions.push(direction);

      departureTime = direction.eta.value;
    } catch (error) {
      console.error(`Error fetching directions from ${startAddress} to ${endAddress}:`, error.message);
      throw error;
    }
  }

  let eta = getRouteETA(directions, timeZone);
  let duration = getRouteDuration(departAt, eta.value);

  const result = {"directions": directions, "eta": eta, "duration": duration};
  return result;
}

async function routeTripFromArrival(addresses, modes, arriveBy, timeZone) {
  let arrivalTime = arriveBy;
  let directions = [];
  for (let i = 0; i < addresses.length-1; i++) {
    let startAddress = addresses[addresses.length-1-i-1];
    let endAddress = addresses[addresses.length-1-i];
    let mode = modes[modes.length-1-i];

    try {
      let directionResponse = await getDirectionsFromArrival(startAddress, endAddress, mode, arrivalTime);

      if (!validateDirectionResponse(directionResponse)) {
        throw new Error(`Invalid response`);
      }

      let direction = parseDirectionResponseFromArrival(directionResponse, arrivalTime);
      directions.unshift(direction);
      
      arrivalTime = computeNewArrivalTime(arrivalTime, direction.duration.value);
    } catch (error) {
      console.error(`Error fetching directions from ${startAddress} to ${endAddress}:`, error.message);
      throw error;
    }
  }

  let eta = getRouteETA(directions, timeZone);
  let departureTime = directions[0].eta.value - directions[0].duration.value;
  let duration = getRouteDuration(departureTime, eta.value);

  const result = {"directions": directions, "eta": eta, "duration": duration, departureTime: formatETA(departureTime, timeZone)};
  return result;
}

function computeNewArrivalTime(currentArrivalTime, durationVal) {
  let newArrivalTime = currentArrivalTime - durationVal;
  // Convert the timestamp to milliseconds
  let milliseconds = newArrivalTime * 1000;
  let date = new Date(milliseconds);

  // Subtract the current seconds to round down to the start of the current minute
  newArrivalTime -= date.getSeconds();
  return newArrivalTime;
}

function getRouteDuration(departureTime, eta) {
  const durationSeconds = eta - departureTime;
  const durationMinutes = Math.ceil(durationSeconds / 60);

  if (durationMinutes === 1) {
    return { text: '1 min', value: durationSeconds };
  } else if (durationMinutes < 60) {
    return { text: `${durationMinutes} mins`, value: durationSeconds };
  } else {
    const hours = Math.floor(durationMinutes / 60);
    const remainingMinutes = durationMinutes % 60;
      
    if (remainingMinutes === 0) {
      return { text: `${hours} hour${hours > 1 ? 's' : ''}`, value: durationSeconds };
    } else {
      return { text: `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} mins`, value: durationSeconds };
    }
  }
}

function getRouteETA(directions, timeZone) {
  const value = directions.at(-1).eta.value;
  const roundedValue = Math.ceil(value / 60) * 60;
  const text = formatETAFull(roundedValue, timeZone);
  const eta = {"text": text, "value": roundedValue};
  return eta;
}

async function request(url) {
  try {
    const response = await axios.get(url);
    return response.data; 
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    throw new Error('Error fetching data'); 
  }
}

async function getDirectionsFromDeparture(startAddress, destinationAddress, mode, departureTime) {
  try {
    const apiKey = process.env.API_KEY;
    const encodedStartAddress = encodeURIComponent(startAddress);
    const encodedDestinationAddress = encodeURIComponent(destinationAddress);
    const url = `https://maps.googleapis.com/maps/api/directions/json?mode=${mode}&departure_time=${departureTime}&destination=${encodedDestinationAddress}&origin=${encodedStartAddress}&key=${apiKey}`;
      
    const directions = await request(url);
    return directions;
  } catch (error) {
    console.error(`Error getting directions from ${startAddress} to ${destinationAddress}:`, error.message);
    throw error;
  }
}

async function getDirectionsFromArrival(startAddress, destinationAddress, mode, arrivalTime) {
  try {
    const apiKey = process.env.API_KEY;
    const encodedStartAddress = encodeURIComponent(startAddress);
    const encodedDestinationAddress = encodeURIComponent(destinationAddress);
    const url = `https://maps.googleapis.com/maps/api/directions/json?mode=${mode}&arrival_time=${arrivalTime}&destination=${encodedDestinationAddress}&origin=${encodedStartAddress}&key=${apiKey}`;
      
    const directions = await request(url);
    return directions;
  } catch (error) {
    console.error(`Error getting directions from ${startAddress} to ${destinationAddress}:`, error.message);
    throw error;
  }
}

function parseDirectionResponseFromDeparture(response, departureTime) {
  const travelMode = getTravelMode(response);
  const title = getTitle(response, travelMode);
  const startAddress = getStartAddress(response);
  const endAddress = getEndAddress(response);
  const distance = getDistance(response);
  const duration = getDuration(response);
  const eta = getETAFromDeparture(response, departureTime, duration.value);
  const instructions = getInstructions(response, travelMode);
  let direction = {
    "travelMode": travelMode,
    "title": title,
    "startAddress": startAddress,
    "endAddress": endAddress,
    "distance": distance,
    "duration": duration,
    "eta": eta,
    "instructions": instructions
  };
  return direction;
}

function parseDirectionResponseFromArrival(response, arrivalTime) {
  const travelMode = getTravelMode(response);
  const title = getTitle(response, travelMode);
  const startAddress = getStartAddress(response);
  const endAddress = getEndAddress(response);
  const distance = getDistance(response);
  const duration = getDuration(response);
  const eta = getETAFromArrival(response, arrivalTime);
  const instructions = getInstructions(response, travelMode);
  let direction = {
    "travelMode": travelMode,
    "title": title,
    "startAddress": startAddress,
    "endAddress": endAddress,
    "distance": distance,
    "duration": duration,
    "eta": eta,
    "instructions": instructions
  };
  return direction;
}

function getTravelMode(direction) {
  const steps = direction.routes[0].legs[0].steps;
  for (const step of steps) {
    const travelMode = step.travel_mode
    if (travelMode == "DRIVING")  {
      return "driving";
    } else if (travelMode == "TRANSIT") {
      return "transit";
    } else if (travelMode == "BICYCLING") {
      return "bicycling";
    }
  }
  return "walking";
}

function cleanStopName(stopName) {
  // extract the station name from a formatted string
  const regex = /\(([^)]+)\)/;
  const match = regex.exec(stopName);
  const stationName = match ? match[1] : stopName;
  
  // replace " at " and " At " with "@"
  const cleanedStopName = stationName.replace(/\s(at|At)\s/g, ' @ ');

  return cleanedStopName;
}

function getTransitTitle(steps) {
  const vehicleGroups = {
    "Subway": ["SUBWAY", "METRO_RAIL"],
    "Train": ["HIGH_SPEED_TRAIN", "LONG_DISTANCE_TRAIN", "HEAVY_RAIL", "COMMUTER_TRAIN", "RAIL", "TRAM", "MONORAIL"],
    "Bus": ["BUS", "INTERCITY_BUS", "TROLLEYBUS", "SHARE_TAXI"],
    "Transit": ["FERRY", "CABLE_CAR", "GONDOLA_LIFT", "FUNICULAR", "OTHER"]
  };

  let trips = [];
  let currentTrip = { mode: null, stops: [] };

  for (let step of steps) {
    if (step.travel_mode === "TRANSIT") {
      const type = step.transit_details.line.vehicle.type;
      let group = "Other";
      for (let groupName in vehicleGroups) {
        if (vehicleGroups[groupName].includes(type)) {
          group = groupName;
          break;
        }
      }

      if (currentTrip.mode && currentTrip.mode !== group) {
        trips.push(currentTrip);
        currentTrip = { mode: group, stops: [] };
      }

      if (!currentTrip.mode) {
        currentTrip.mode = group;
      }
      const stopName = cleanStopName(step.transit_details.arrival_stop.name);
      currentTrip.stops.push(stopName);
    }
  }

  if (currentTrip.mode) {
    trips.push(currentTrip);
  }

  if (trips.length === 1) {
    const mode = trips[0].mode;
    return `${mode} to ${trips[0].stops.at(-1)}`;
  } else if (trips.length === 2) {
    const firstTripMode = trips[0].mode;
    const secondTripMode = trips[1].mode;
    const firstFinalStop = trips[0].stops.at(-1);
    const secondFinalStop = trips[1].stops.at(-1);
    return `${firstTripMode} to ${firstFinalStop}, ${secondTripMode} to ${secondFinalStop}`;
  } else if (trips.length > 2) {
    return `Transit to ${trips.at(-1).stops.at(-1)}`;
  } else {
    const lastStep = steps.at(-1);
    return `Transit to ${lastStep.end_address}`;
  }
}

function getTitle(direction, travelMode) {
  const summary = direction.routes[0].summary;
  
  if (travelMode === "driving") {
    return "Driving via " + summary;
  } else if (travelMode === "bicycling") {
    return "Biking along " + summary;
  } else if (travelMode === "walking") {
    return "Walking thru " + summary;
  } else if (travelMode === "transit") {
    const steps = direction.routes[0].legs[0].steps;
    return getTransitTitle(steps);
  }
}

function getDuration(direction) {
  let duration = direction.routes[0].legs[0].duration;
  if (direction.routes[0].legs[0].duration_in_traffic) {
    duration = direction.routes[0].legs[0].duration_in_traffic;
  }
  
  // Round up the duration value to the nearest minute
  const roundedDurationValue = Math.ceil(duration.value / 60) * 60;
  
  return { "text": duration.text, "value": roundedDurationValue };
}

function getDistance(direction) {
  const distance = direction.routes[0].legs[0].distance;
  return {"text": distance.text, "value": distance.value};
}

function getETAFromDeparture(direction, departureTime, duration, timeZone) {
  let arrivalTime;

  if (direction.routes[0].legs[0].arrival_time) {
    arrivalTime = direction.routes[0].legs[0].arrival_time.value;
  } else {
    arrivalTime = departureTime + duration;
  }

  // Round up the arrivalTime to the nearest minute
  const timestampInMilliseconds = arrivalTime * 1000;
  let date = new Date(timestampInMilliseconds);

  if (date.getSeconds() > 0) {
    // Add the remaining seconds to move to the start of the next minute
    const remainingSeconds = 60 - date.getSeconds();
    arrivalTime += remainingSeconds;
  }

  const formattedETA = formatETA(arrivalTime, timeZone);
  const eta = {"text": formattedETA, "value": arrivalTime};
  return eta;
}

function getETAFromArrival(direction, arrivalTime, timeZone) {
  let correctArrivalTime;

  if (direction.routes[0].legs[0].arrival_time) {
    correctArrivalTime = direction.routes[0].legs[0].arrival_time.value;
  } else {
    correctArrivalTime = arrivalTime;
  }

  // Convert the timestamp to milliseconds
  const timestampInMilliseconds = correctArrivalTime * 1000;
  let date = new Date(timestampInMilliseconds);

  // Subtract the current seconds to round down to the start of the current minute
  correctArrivalTime -= date.getSeconds();

  const formattedETA = formatETA(correctArrivalTime, timeZone);
  const eta = { "text": formattedETA, "value": correctArrivalTime };
  return eta;
}

function formatETA(eta, timeZone) {
  // Convert eta to milliseconds
  let timestampInMilliseconds = eta * 1000;

  // Create a Date object from the timestamp
  let date = new Date(timestampInMilliseconds);

  // Get the time in the current timezone with 12-hour format and AM/PM
  const options = { 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true, 
    timeZone: timeZone 
  };
  const formattedETA = date.toLocaleTimeString('en-US', options);

  return formattedETA;
}

function formatETAFull(eta, timeZone) {
  // Convert eta to milliseconds
  const timestampInMilliseconds = eta * 1000;

  // Create a Date object from the timestamp
  const date = new Date(timestampInMilliseconds);

  // Define options for date and time formatting
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: timeZone  // Specify the time zone here
  };

  const dateOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: timeZone  // Specify the time zone here
  };

  // Format time and date
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
  const formattedDate = date.toLocaleDateString('en-US', dateOptions);

  // Combine the formatted time and date
  return `${formattedTime} – ${formattedDate}`;
}

function getInstructions(direction, travelMode) {
  if (travelMode == "transit") {
    return getTransitInstructions(direction);
  } else  {
    let instructions = [];
    let steps = direction.routes[0].legs[0].steps;
    for (let step of steps) {
      let instruction = {};
      instruction["description"] = step.html_instructions;
      instruction["distance"] = step.distance;
      instruction["duration"] = step.duration;
      instructions.push(instruction);
    }
    return instructions;
  }
}

function getTransitInstructions(direction) {
  let instructions = [];
  let steps = direction.routes[0].legs[0].steps;
  for (let step of steps) {
    let instruction = {};
    instruction["mode"] = step.travel_mode.toLowerCase();
    if (instruction["mode"] == "walking") {
      instruction["description"] = step.html_instructions;
      instruction["distance"] = step.distance;
      instruction["duration"] = step.duration;
    } else if (instruction["mode"] == "transit") { 
      instruction["description"] = step.transit_details.headsign;
      instruction["distance"] = step.distance;
      instruction["duration"] = step.duration;
      instruction["arrivalStop"] = cleanStopName(step.transit_details.arrival_stop.name);
      instruction["departureStop"] = cleanStopName(step.transit_details.departure_stop.name);
      instruction["arrivalTime"] = step.transit_details.arrival_time;
      instruction["departureTime"] = step.transit_details.departure_time;

      let vehicle = step.transit_details.line.vehicle;
      vehicle.localIcon = vehicle.local_icon
      delete vehicle.local_icon;

      instruction["transitDetails"] = {
        "color": step.transit_details.line.color,
        "shortName": step.transit_details.line.short_name,
        "numStops": step.transit_details.num_stops ? step.transit_details.num_stops : 0,
        "vehicle": vehicle,
      }
    }
    instructions.push(instruction);
  }
  return instructions;
}

function getStartAddress(direction) {
  return direction.routes[0].legs[0].start_address;
}

function getEndAddress(direction) {
  return direction.routes[0].legs[0].end_address;
}

function validateDirectionResponse(response) {
  // Check if the response contains routes array and it's not empty
  if (!response.routes || !Array.isArray(response.routes) || response.routes.length === 0) {
    return false;
  }

  // Check if the first route object contains legs array and it's not empty
  const firstRoute = response.routes[0];
  if (!firstRoute.legs || !Array.isArray(firstRoute.legs) || firstRoute.legs.length === 0) {
    return false;
  }

  // Additional checks if needed (e.g., checking specific properties within legs)

  // If all checks pass
  return true;
}
