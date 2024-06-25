import React, { Component } from 'react';
import RouteBuildingBlock from './RouteBuildingBlock';
import styles from "@/styles/Home.module.css";

class RouteBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routes: [
                { startingAddress: '', destinationAddress: '' },
                { startingAddress: '', destinationAddress: '' },
                { startingAddress: '', destinationAddress: '' }
            ]
        };
        this.handleAddressChange = this.handleAddressChange.bind(this);
    }

    handleAddressChange(index, addressType, value) {
        const newRoutes = [...this.state.routes];
        newRoutes[index][addressType] = value;

        // Propagate changes to subsequent blocks if updating destination address
        if (addressType === 'destinationAddress' && index < newRoutes.length - 1) {
            newRoutes[index + 1].startingAddress = value;
        }

        this.setState({ routes: newRoutes });
    }

    render() {
        return (
            <div className={styles.routeBuilder}>
                {this.state.routes.map((route, index) => (
                    <RouteBuildingBlock
                        key={index}
                        index={index}
                        startingAddress={route.startingAddress}
                        destinationAddress={route.destinationAddress}
                        onAddressChange={this.handleAddressChange}
                    />
                ))}
            </div>
        );
    }
}

export default RouteBuilder;