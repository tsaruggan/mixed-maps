import React, { Component, useState } from 'react';
import styles from "@/styles/Home.module.css";

import RouteDirectionsBlock from './RouteDirectionsBlock';

const travelModes = [
    { name: "driving", color: "rgba(38, 70, 83, 0.25)" },
    { name: "transit", color: "rgba(42, 157, 143, 0.25)" },
    { name: "bicycling", color: "rgba(233, 196, 106, 0.25)" },
    { name: "walking", color: "rgba(244, 162, 97, 0.25)" }
]

class RouteOverview extends Component {
    constructor(props) {
        super(props);
    }

    renderRouteOverview() {
        if (this.props.route.directions == null) {
            return (<></>);
        }

        return (
            <div className={styles.routeDetailsContainer}>
                <div className={styles.routeDetailsTitleContainer}>
                    <p>{`ETA ${this.props.route.eta.text}`}</p>
                    <p>{`${this.props.route.duration.text}`}</p>
                </div>

                {this.props.route.directions.map((direction, index) => (
                    <RouteDirectionsBlock
                        key={direction.title}
                        index={index}
                        travelMode={direction.travelMode}
                        title={direction.title}
                        eta={direction.eta.text}
                        duration={direction.duration.text}
                        distance={direction.distance.text}
                        color={travelModes.find(mode => mode.name === direction.travelMode).color}
                        instructions={direction.instructions}
                        startAddress={direction.startAddress}
                        endAddress={direction.endAddress}
                    />
                ))}
            </div>
        );
    }

    render() {
        return (
            <div className={styles.routeOverviewContainer}>
                {this.renderRouteOverview()}
            </div>
        );
    }
}

export default RouteOverview;