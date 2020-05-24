import React from "react";
import Map from "../../components/map";
import Sightings from "../../components/sighting"
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import history from '../../history';
import Switch from '@material-ui/core/Switch';


import "./index.css"

import firebase from "../../firebase_config"

const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: '#34E795',
    },
    barColorPrimary: {
        backgroundColor: '#00695c',
    },
})(LinearProgress);
const GreenSwitch = withStyles({
    switchBase: {
        color: '#34E795',
        '&$checked': {
            color: '#34E795',
        },
        '&$checked + $track': {
            backgroundColor: '#00695c',
        },
    },
    checked: {},
    track: {},
})(Switch);
var db = firebase.firestore();

class SightingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            personData: this.props.location.state.personData,
            sightingData: null,
            customApi: false
        }

        this.getData = this.getData.bind(this)
        this.handleSwitch = this.handleSwitch.bind(this)
    }
    getData(collectionName) {
        let issue_number = parseInt(this.props.location.state.personData.issueNumber);
        db.collection(collectionName).where('issueNumber', '==', issue_number).get().then(snapshots => {
            this.setState({
                isLoading: false,
                sightingData: snapshots
            })
        }, err => {
            console.log(`Encountered error: ${err}`);
        });
    }
    componentWillMount() {
        firebase.auth().onAuthStateChanged((authenticated) => {
            if (authenticated === null) {
                history.replace("")
            }
        })
    }
    componentDidMount() {
        this.getData('sightings')
    }
    handleSwitch(event) {
        if (event.target.checked)
            this.getData('sightings_custom_api')
        else
            this.getData('sightings')
        this.setState({
            customApi: event.target.checked
        })

    }
    render() {
        return this.state.isLoading ? (
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#222222",
                }}>
                <ColorLinearProgress />
            </div >

        ) : (
                <div className="sighting_page_container">
                    <div style={{ display: "flex" }} >
                        <img style={{
                            width: "10%",
                            borderRadius: "15px",
                            display: "inline-block"
                        }}
                            src={this.state.personData.imageUrl} />
                        <div style={{ width: "20px", display: "inline-block" }} />
                        <Typography component="div" style={{ display: "inline-block" }}>
                            <Box fontSize={30} fontFamily="Consolas" fontWeight="fontWeightBold" m={1} color="white">
                                F.R.A.S
                        </Box>
                            <Box fontSize={18} fontFamily="Consolas" fontWeight="fontWeightLight" m={1} color="white">
                                {this.state.personData.name.toUpperCase()}
                            </Box>
                            <Box fontSize={18} fontFamily="Consolas" fontWeight="fontWeightLight" m={1} color="white">
                                ISSUE NO .{this.state.personData.issueNumber}
                            </Box>
                        </Typography>
                        <div style={{ width: "90%", display: "inline-block" }} />
                        <div>
                            <IconButton onClick={() => history.goBack()} style={{ color: "white" }}>
                                <ArrowBackIcon />
                            </IconButton>
                        </div>

                    </div>
                    <div style={{ height: "50px", display: "block", textAlign: "end", color: "white" }}>
                        Custom API
                        <GreenSwitch
                            checked={this.state.customApi}
                            onChange={this.handleSwitch}
                            inputProps={{ 'color': 'red' }}
                        />
                    </div>
                    {
                        this.state.sightingData !== null &&
                        <Grid container spacing={5}>
                            <Grid item xs>
                                <div style={{ height: "20px" }}></div>
                                <Map sightings={this.state.sightingData} />
                            </Grid>
                            <Grid item xs>
                                <Sightings sightings={this.state.sightingData} personData={this.state.personData} />
                            </Grid>
                        </Grid>
                    }
                </div >
            );
    }
}
export default SightingsPage;
