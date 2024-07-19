# Mixed Maps

## Overview

Mixed Maps is a web application built with Next.js that enables users to plan and build routes using multiple modes of transportation. It integrates with the Google Maps API to provide users with efficient trip planning and route visualization.

## Demo

You can view a live demo of the application at [mixed-maps.vercel.app](https://mixed-maps.vercel.app).

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/tsaruggan/mixed-maps.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mixed-maps
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up your Google Maps API key:
   - Enable the [Google Maps Directions API](https://developers.google.com/maps/documentation/directions).
   - Create a `.env.local` file in the root of your project and add your API key:

     ```
     API_KEY=your_api_key_here
     ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000` to view the application.
