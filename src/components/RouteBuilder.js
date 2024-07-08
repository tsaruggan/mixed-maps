import React, { Component } from 'react';
import RouteBuildingBlock from './RouteBuildingBlock';
import ActionButton from './ActionButton';
import styles from "@/styles/Home.module.css";
import DateTimeSelector from './DateTimeSelector';

const defaultMode = "transit"

class RouteBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addresses: ["", ""],
            modes: [defaultMode],
            dateTimeOption: "Leave now",
            dateTime: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
        };
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRoute = this.handleRoute.bind(this);
        this.handleDateTimeOptionChange = this.handleDateTimeOptionChange.bind(this);
        this.handleDateTimeChange = this.handleDateTimeChange.bind(this);
        this.deleteLast = this.deleteLast.bind(this);
    }

    handleDateTimeOptionChange(dateTimeOption) {
        this.setState({ dateTimeOption: dateTimeOption });
    }

    handleDateTimeChange(dateTime) {
        try {
            this.setState({ dateTime: dateTime });
        } catch (error) {
            console.error('Error setting dateTime:', error);
            const currentDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            this.setState({ dateTime: currentDateTime });
        }
    }    

    handleAddressChange(index, addressType, value) {
        const newAddresses = [...this.state.addresses];

        if (addressType == "starting") {
            newAddresses[index] = value;
        } else if (addressType == "destination") {
            newAddresses[index + 1] = value;
        }
        this.setState({ addresses: newAddresses });
    }

    handleModeChange(index, value) {
        const newModes = [...this.state.modes];
        newModes[index] = value
        this.setState({ modes: newModes });
    }

    handleAdd() {
        const newAddresses = [...this.state.addresses];
        newAddresses.push("");

        const newModes = [...this.state.modes];
        newModes.push(defaultMode);

        this.setState({ addresses: newAddresses, modes: newModes });
    }

    handleRoute() {
        this.props.onRoute(this.state.addresses, this.state.modes, this.state.dateTimeOption, this.state.dateTime);
    }

    deleteLast() {
        const newAddresses = [...this.state.addresses];
        newAddresses.pop();

        const newModes = [...this.state.modes];
        newModes.pop();

        this.setState({ addresses: newAddresses, modes: newModes });
    }

    render() {
        const addDisabled = this.state.addresses.at(-1) == "" || this.state.addresses.at(-2) == "";
        return (
            <div className={styles.routeBuilder}>
                {this.state.addresses.slice(0, -1).map((_, index) => (
                    <RouteBuildingBlock
                        key={index}
                        index={index}
                        startingAddress={this.state.addresses[index]}
                        destinationAddress={this.state.addresses[index + 1]}
                        mode={this.state.modes[index]}
                        onAddressChange={this.handleAddressChange}
                        onModeChange={this.handleModeChange}
                        deletable={index != 0 && index == this.state.addresses.length-2}
                        onDelete={this.deleteLast}
                    />
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <DateTimeSelector
                        selectedOption={this.state.dateTimeOption}
                        selectedDate={this.state.dateTime}
                        onOptionChange={this.handleDateTimeOptionChange}
                        onDateChange={this.handleDateTimeChange}
                    />
                    <div style={{ display: 'flex', justifyContent: 'end', gap: '12px' }}>
                        <ActionButton
                            text={"Add +"}
                            handleOnClick={this.handleAdd}
                            backgroundColor={"rgba(115, 200, 144, 1)"}
                            disabled={addDisabled}
                        />
                        <ActionButton
                            text={"Route"}
                            handleOnClick={this.handleRoute}
                            backgroundColor={"rgba(121, 196, 229, 1)"}
                            disabled={addDisabled}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default RouteBuilder;
