import React from 'react';
import Box from "@material-ui/core/Box";
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import Button from '@material-ui/core/Button';


// import DateFnsUtils from '@date-io/date-fns';
// import {
//     MuiPickersUtilsProvider,
//     KeyboardDatePicker,
// } from '@material-ui/pickers';

import './index.css'
import history from '../../../history';

// const materialTheme = createMuiTheme({
//     palette: {
//         primary: { 500: '#34E795' },
//     },
// });

const GreenRadio = withStyles({
    root: {
        color: 'white',
        '&$checked': {
            color: '#34E795',
        },
        fontSize: "15px"
    },
    checked: {}
})((props) => <Radio color="default" {...props} />);

const GreenSelect = withStyles({
    root: {
        color: '#34E795',
        fontSize: "18px",
        disableUnderline: true,
        paddingTop: "10px"
    },
    icon: {
        fill: '#34E795',
    },
})((props) => <Select color="default" {...props} />);

class AddCasePageOne extends React.Component {
    constructor(props) {
        super(props);
        if (props.location.state.personData === undefined) {
            this.personData = {
                missingDate: "",
                imageUrl: null,
                name: "",
                missingFrom: "",
                age: "",
                sex: "M",
                race: "Indian",
                hairColor: "Black",
                eyeColor: "Black",
                height: "",
                weight: "",
                displayImageObject: null,
            }
        }
        else {

            this.personData = props.location.state.personData;
        }

        this.state = {
            //selectedDate: new Date(this.personData.reportDate),
            name: this.personData.name,
            age: this.personData.age,
            eyeColor: this.personData.eyeColor,
            height: this.personData.height,
            weight: this.personData.weight,
            selectedGender: this.personData.sex,
            selectedRace: this.personData.race,
            selectedHairColor: this.personData.hairColor,
            imageFile: this.personData.imageUrl,
            imageFileObject: this.personData.displayImageObject,
            isImageValidated: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleDate = this.handleDate.bind(this);
        this.handleSelectedGender = this.handleSelectedGender.bind(this);
        this.handleSelectedRace = this.handleSelectedRace.bind(this);
        this.handleSelectedHairColor = this.handleSelectedHairColor.bind(this);
        this.handleSelectedEyeColor = this.handleSelectedEyeColor.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);

    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.imageFileObject === null) {
            this.setState({
                isImageValidated: true
            })
        }
        else {
            this.personData.name = this.state.name;
            this.personData.eyeColor = this.state.eyeColor;
            this.personData.sex = this.state.selectedGender;
            this.personData.race = this.state.selectedRace;
            this.personData.hairColor = this.state.selectedHairColor;
            this.personData.imageUrl = this.state.imageFile;
            this.personData.displayImageObject = this.state.imageFileObject;
            this.personData.height = this.state.height;
            this.personData.weight = this.state.weight;
            this.personData.age = this.state.age;
            history.replace("add_case_additional", { personData: this.personData })
        }
    }
    // handleDate(date) {
    //     this.setState({
    //         selectedDate: date,

    //     })
    // }
    handleSelectedGender(event) {
        this.setState({
            selectedGender: event.target.value,
        })
    }
    handleSelectedRace(event) {
        this.setState({
            selectedRace: event.target.value,
        })
    }
    handleSelectedEyeColor(event) {
        this.setState({
            eyeColor: event.target.value,
        })
    }
    handleSelectedHairColor(event) {
        this.setState({
            selectedHairColor: event.target.value,
        })
    }
    handleFileSelect(event) {
        this.setState({
            imageFile: URL.createObjectURL(event.target.files[0]),
            imageFileObject: event.target.files[0],
            isImageValidated: false,
        })
    }
    render() {
        return (
            <div className="case_page_1_container">
                <div className="left-panel">
                    <div style={{ height: "100px" }} />
                    <Box marginTop="0px" fontFamily="Consolas" fontSize={20} fontWeight="fontWeightBold" m={1} color="white">
                        Personal
                        </Box>
                    <Box fontFamily="Consolas" fontSize={20} fontWeight="fontWeightBold" m={1} color="#707070" lineHeight="70px">
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
                        <IconButton onClick={() => history.goBack()} style={{ color: "white" }}>
                            <ArrowBackIcon />
                        </IconButton>
                    </div>
                    <div style={{ height: "50px" }} />
                    <div style={{ paddingLeft: "20%" }}>
                        <label>Add an Image for display</label>
                        <div style={{ height: "20px" }} />
                        {this.state.imageFile !== null ? <div className="selcted_image" >
                            <IconButton className="clearButtonParent" onClick={() => this.setState({ imageFile: null, imageFileObject: null })}>
                                <DeleteRoundedIcon className="clearButton" />
                            </IconButton>
                            <img src={this.state.imageFile} />
                        </div> :
                            <div className="image">
                                <center style={{
                                    position: "relative",
                                    top: "50%",
                                    transform: "translate(0%, -50%)"
                                }}>
                                    <input accept="image/*" onChange={this.handleFileSelect} id="myInput" type="file" ref={(ref) => this.myInput = ref} style={{ display: 'none' }} />
                                    <IconButton onClick={(e) => this.myInput.click()} style={{ "color": "#34E795" }}>
                                        <AddIcon />
                                    </IconButton>
                                </center>
                            </div>
                        }
                        <div style={{ height: "5px" }} />
                        {this.state.isImageValidated && <span style={{ color: "red", fontFamily: "Consolas" }}>Please choose an image!</span>}
                        <div style={{ height: "10px" }} />
                        <form name="case_details_form" onSubmit={this.handleSubmit} method="POST">
                            <label>Full Name</label>
                            <input onChange={(e) => this.setState({ name: e.target.value })} value={this.state.name} className="input" type="text" autoComplete="off" required></input>
                            <div style={{ height: "10px" }} />
                            <label>Age</label>
                            <input onChange={(e) => this.setState({ age: e.target.value })} value={this.state.age} className="input" type="text" autoComplete="off" required pattern="^[0-9]*$"></input>
                            <div style={{ height: "20px" }} />
                            <div style={{ display: 'inline-flex' }} >
                                {/* <ThemeProvider theme={materialTheme}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            style={{ marginTop: "0px" }}
                                            disableToolbar
                                            format="dd MMMM yyyy"
                                            value={this.state.selectedDate}
                                            onChange={this.handleDate}
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Date"
                                            KeyboardButtonProps={{
                                                'style': { 'padding': '0px', 'width': '0px' }
                                            }}
                                            InputLabelProps={{
                                                'style': { 'color': "white", 'fontFamily': 'Consolas', 'fontSize': '25px' }
                                            }}
                                            InputProps={{
                                                'style': { 'width': "70%", 'color': "#34E795", 'fontFamily': 'Consolas', 'fontSize': '18px', "paddingTop": "5px" },
                                                disableUnderline: true
                                            }}
                                            keyboardIcon={<CalendarTodayIcon style={{ color: "#34E795" }} />}
                                        />
                                    </MuiPickersUtilsProvider>
                                </ThemeProvider>
                                <div style={{ width: "20px" }} /> */}
                                <div>
                                    <FormLabel style={{
                                        color: "white",
                                        fontFamily: "Consolas",
                                        fontSize: "18px"
                                    }} component="legend">Gender</FormLabel>
                                    <RadioGroup label="Gendersds" row defaultValue="M">
                                        <FormControlLabel value="end" control={<GreenRadio
                                            value="M"
                                            checked={this.state.selectedGender === 'M'}
                                            onChange={this.handleSelectedGender}
                                        />} label="M" />
                                        <FormControlLabel value="end" control={<GreenRadio
                                            value="F"
                                            checked={this.state.selectedGender === 'F'}
                                            onChange={this.handleSelectedGender}
                                        />} label="F" />
                                        <FormControlLabel value="end" control={<GreenRadio
                                            value="Other"
                                            checked={this.state.selectedGender === 'Other'}
                                            onChange={this.handleSelectedGender}
                                        />} label="Other" />
                                    </RadioGroup>
                                </div>
                                <div style={{ width: "50px" }} />
                                <div>
                                    <FormLabel style={{
                                        color: "white",
                                        fontFamily: "Consolas",
                                        fontSize: "18px"
                                    }} component="legend">Race</FormLabel>
                                    <GreenSelect
                                        value={this.state.selectedRace}
                                        onChange={this.handleSelectedRace}
                                        disableUnderline
                                    >
                                        <MenuItem value={"Indian"}>Indian</MenuItem>
                                        <MenuItem value={"American"}>American</MenuItem>
                                        <MenuItem value={"Mexican"}>Mexican</MenuItem>
                                    </GreenSelect>
                                </div>
                                <div style={{ width: "50px" }} />
                                <div>
                                    <FormLabel style={{
                                        color: "white",
                                        fontFamily: "Consolas",
                                        fontSize: "18px"
                                    }} component="legend">Hair Color</FormLabel>
                                    <GreenSelect
                                        value={this.state.selectedHairColor}
                                        onChange={this.handleSelectedHairColor}
                                        disableUnderline
                                    >
                                        <MenuItem value={"Black"}>Black</MenuItem>
                                        <MenuItem value={"Brown"}>Brown</MenuItem>
                                        <MenuItem value={"Grey"}>Grey</MenuItem>
                                    </GreenSelect>
                                </div>
                                <div style={{ width: "50px" }} />
                                <div>
                                    <FormLabel style={{
                                        color: "white",
                                        fontFamily: "Consolas",
                                        fontSize: "18px"
                                    }} component="legend">Eye Color</FormLabel>
                                    <GreenSelect
                                        value={this.state.eyeColor}
                                        onChange={this.handleSelectedEyeColor}
                                        disableUnderline
                                    >
                                        <MenuItem value={"Black"}>Black</MenuItem>
                                        <MenuItem value={"Brown"}>Brown</MenuItem>
                                        <MenuItem value={"Grey"}>Grey</MenuItem>
                                    </GreenSelect>
                                </div>
                            </div>
                            <div style={{ height: "10px" }} />
                            <label>Height<span style={{ color: "#34E795" }}> (in meters)</span></label>
                            <input onChange={(e) => this.setState({ height: e.target.value })} value={this.state.height} className="input" type="text" autoComplete="off" required pattern="^[-+]?\d*\.?\d*$"></input>
                            <div style={{ height: "10px" }} />
                            <label>Weight<span style={{ color: "#34E795" }}> (in kg)</span></label>
                            <input onChange={(e) => this.setState({ weight: e.target.value })} value={this.state.weight} className="input" type="text" autoComplete="off" required pattern="^[-+]?\d*\.?\d*$"></input>
                            <div style={{ height: "40px" }} />
                            <div style={{ width: "95%", textAlign: "right" }}>
                                <Button type="submit" style={{ padding: "5px 15px", fontWeight: "bold", borderRadius: "10px", backgroundColor: "white", color: "black", fontSize: "25px", fontFamily: "Consolas" }}>
                                    NEXT >
                                </Button>
                            </div>
                        </form>
                    </div>
                </div >
            </div >
        );
    }
}

export default AddCasePageOne