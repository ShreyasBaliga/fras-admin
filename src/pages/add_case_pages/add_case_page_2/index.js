import React from 'react';
import Box from "@material-ui/core/Box";
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import AddIcon from '@material-ui/icons/Add';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import Button from '@material-ui/core/Button';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';

import './index.css'
import history from '../../../history';


const materialTheme = createMuiTheme({
    palette: {
        primary: { 500: '#34E795' },
    },
});

function SlectedImages(props) {
    let image_elements = []

    props.images.map((item, key) => {
        image_elements.push(
            < div key={key} className="selcted_image" >
                <IconButton className="clearButtonParent" onClick={() => props.deleteFunction(item)}>
                    <DeleteRoundedIcon className="clearButton" />
                </IconButton>
                <img src={URL.createObjectURL(item)} />
            </div >);
    })
    return (
        <div style={{ display: "inline-flex" }}>
            {image_elements}
        </div>
    );
}

class AddCasePageTwo extends React.Component {
    constructor(props) {
        super(props);
        this.personData = props.location.state.personData;
        this.state = {
            missingFrom: this.personData.missingFrom,
            lastWearing: this.personData.lastWearing,
            additionalInfo: this.personData.additionalInfo,
            selectedDate: this.personData.missingDate !== "" ? new Date(this.personData.missingDate) : new Date(),
            imageFiles: [],
            lat: this.personData.lat,
            lng: this.personData.lng,
            isLocationValidated: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleFilesSelect = this.handleFilesSelect.bind(this);
        this.handleMissingFrom = this.handleMissingFrom.bind(this);
        this.handlePlaceSelect = this.handlePlaceSelect.bind(this);

    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.lat === undefined || this.state.lat === null) {
            this.setState({
                isLocationValidated: true
            })
        }
        else {
            this.personData.missingFrom = this.state.missingFrom;
            this.personData.missingDate = this.state.selectedDate.toISOString();
            this.personData.lastWearing = this.state.lastWearing;
            this.personData.additionalInfo = this.state.additionalInfo;
            this.personData.lat = this.state.lat;
            this.personData.lng = this.state.lng;
            history.replace("add_case_finish", { personData: this.personData })
        }
    }
    handleDate(date) {
        this.setState({
            selectedDate: date,

        })
    }
    handleFilesSelect(event) {
        this.setState({
            imageFiles: [...this.state.imageFiles, event.target.files[0]]
        })
    }
    handleMissingFrom = address => {
        this.setState({ missingFrom: address });
    };

    handlePlaceSelect = address => {

        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.setState({ missingFrom: address, lat: latLng.lat, lng: latLng.lng, isLocationValidated: false }))
            .catch(error => console.error('Error', error));
    };
    render() {
        return (
            <div className="case_page_2_container">
                <div className="left-panel">
                    <div style={{ height: "100px" }} />
                    <Box marginTop="0px" fontFamily="Consolas" fontSize={20} fontWeight="fontWeightBold" m={1} color="#707070">
                        Personal
                        </Box>
                    <Box fontFamily="Consolas" fontSize={20} fontWeight="fontWeightBold" m={1} color="white" lineHeight="70px">
                        Additional
                        </Box>
                    <Box fontFamily="Consolas" fontSize={20} fontWeight="fontWeightBold" m={1} color="#707070">
                        Finish
                        </Box>
                </div>
                <div className="right-panel">
                    <div style={{ width: "100%", textAlign: "center", paddingTop: "25px" }}>
                        <Box fontSize={35} fontFamily="Consolas" fontWeight="fontWeightLight" color="white">
                            F.R.A.S
                        </Box>
                    </div>
                    <div style={{ position: "absolute", top: 10, right: "50px" }}>
                        <IconButton onClick={() => history.replace("add_case_personal", { personData: this.personData })} style={{ color: "white" }}>
                            <ArrowBackIcon />
                        </IconButton>
                    </div>
                    <div style={{ height: "50px" }} />
                    <div style={{ paddingLeft: "20%" }}>
                        {/* <label>Add Images for training <span style={{ color: "#34E795" }}>(The more images you add the better)</span></label>
                        <div style={{ height: "20px" }} />
                        <div style={{ display: "inline-flex" }}>
                            <SlectedImages images={this.state.imageFiles} deleteFunction={function (image) {
                                const imageFiles = this.state.imageFiles.filter(item => item !== image);
                                this.setState({ imageFiles: imageFiles })
                            }.bind(this)} />
                            <div className="image">
                                <center style={{
                                    position: "relative",
                                    top: "50%",
                                    transform: "translate(0%, -50%)"
                                }}>
                                    <input accept="image/*" onChange={this.handleFilesSelect} id="myInput" type="file" ref={(ref) => this.myInput = ref} style={{ display: 'none' }} />
                                    <IconButton onClick={(e) => this.myInput.click()} style={{ "color": "#34E795" }}>
                                        <AddIcon />
                                    </IconButton>
                                </center>
                            </div>
                        </div> */}
                        <div style={{ height: "20px" }} />
                        <form name="case_details_form" onSubmit={this.handleSubmit} method="POST">
                            <label>Where did you see him/her last?</label>
                            <PlacesAutocomplete
                                value={this.state.missingFrom}
                                onChange={this.handleMissingFrom}
                                onSelect={this.handlePlaceSelect}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div>
                                        <input
                                            {...getInputProps({
                                                placeholder: 'Search Places',
                                                className: 'input',
                                            })}
                                            required
                                        />
                                        <div className="autocomplete-dropdown-container">
                                            {loading && <div style={{ color: "#34E795" }}>Loading...</div>}
                                            {suggestions.map(suggestion => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                        })}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>
                            <div style={{ height: "10px" }} />
                            {this.state.isLocationValidated && <span style={{ color: "red", fontFamily: "Consolas" }}>Please choose a valid location!</span>}
                            <div style={{ height: "30px" }} />
                            <label>When did you see him/her last?</label>

                            <div>
                                <ThemeProvider theme={materialTheme}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDateTimePicker
                                            allowKeyboardControl={false}
                                            InputProps={{
                                                'style': { "width": "130%", 'color': "#34E795", 'fontFamily': 'Consolas', 'fontSize': '18px' },
                                                disableUnderline: true
                                            }}
                                            keyboardIcon={<CalendarTodayIcon style={{ color: "#34E795" }} />}
                                            onError={console.log}
                                            value={this.state.selectedDate}
                                            onChange={this.handleDate}
                                            format="hh:mm a, EEE, dd MMM yyyy"
                                        />
                                    </MuiPickersUtilsProvider>
                                </ThemeProvider>
                            </div>
                            <div style={{ height: "30px" }} />

                            <label>What was he/she last wearing?</label>
                            <input onChange={(e) => this.setState({ lastWearing: e.target.value })} value={this.state.lastWearing} className="input" type="text" id="height" name="height" autoComplete="off" required />

                            <div style={{ height: "30px" }} />

                            <label>Any additional information<span style={{ color: "#34E795" }}>(Optional)</span></label>
                            <input onChange={(e) => this.setState({ additionalInfo: e.target.value })} value={this.state.additionalInfo} className="input" type="text" id="fullName" name="fullName" autoComplete="off" />

                            <div style={{ height: "50px" }} />

                            <div style={{ width: "95%", textAlign: "right" }}>
                                <Button type="submit" style={{ padding: "5px 15px", fontWeight: "bold", borderRadius: "10px", backgroundColor: "white", color: "black", fontSize: "25px", fontFamily: "Consolas" }}>
                                    NEXT >
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        );
    }
}

export default AddCasePageTwo