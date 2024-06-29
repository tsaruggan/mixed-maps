import React, { Component } from 'react';
import styles from "@/styles/Home.module.css";

// const routeDirections = [
//     {
//         title: "Driving directions via ON-401 E",
//         eta: "ETA 12:54 PM",
//         duration: "18-24 min",
//         detail: "20.8 km",
//         color: "rgba(38, 70, 83, 0.25)"
//     },
//     {
//         title: "Transit directions from Kipling Station",
//         eta: "ETA 1:42 PM",
//         duration: "45 min",
//         detail: "🚶‍♂️ > ❷ > ❶",
//         color: "rgba(42, 157, 143, 0.25)"
//     },
//     {
//         title: "Biking directions via Martin Goodman Trl",
//         eta: "ETA 2:00 PM",
//         duration: "18 min",
//         detail: "4.6 km",
//         color: "rgba(233, 196, 106, 0.25)"
//     }
// ]

const travelModes = [
    { name: "driving", color: "rgba(38, 70, 83, 0.25)" },
    { name: "transit", color: "rgba(42, 157, 143, 0.25)" },
    { name: "bicycling", color: "rgba(233, 196, 106, 0.25)" },
    { name: "walking", color: "rgba(244, 162, 97, 0.25)" }
]

class RouteOverview extends Component {
    render() {
        return (
            <div className={styles.routeOverviewContainer}>
                <div className={styles.routeDetailsContainer}>
                    <div className={styles.routeDetailsTitleContainer}>
                        <p>ETA 2:00 PM – Jun 23, 2024</p>
                        <p>1 hr 30 min commute</p>
                    </div>
                    
                    {this.props.directions.map((direction, index) => (
                        <RouteDirectionsBlock
                            key={index} 
                            title={direction.title}
                            eta={direction.eta.text}
                            duration={direction.duration.text}
                            detail={direction.distance.text}
                            color={travelModes.find(mode => mode.name === direction.travelMode).color}
                        />
                ))}
                </div>
            </div>
        );
    }
}

export default RouteOverview;

function RouteDirectionsBlock(props) {
    return (
        <div className={styles.routeDirectionsBlock} style={{backgroundColor: props.color}}>
            <div>
                <p style={{fontWeight: '700'}}>{props.title}</p>
                <p>ETA {props.eta}</p>
            </div>
            <div style={{textAlign: 'end'}}>
                <p style={{fontWeight: '700'}}>{props.duration}</p>
                <p>{props.detail}</p>
            </div>
        </div>
    );
}
