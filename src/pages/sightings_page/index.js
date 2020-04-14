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

class SightingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            personData: this.props.location.state.personData,
            sightingData: null,
        }
    }
    componentWillMount() {
        firebase.auth().onAuthStateChanged((authenticated) => {
            if (authenticated === null) {
                history.replace("")
            }
        })
    }
    componentDidMount() {
        var db = firebase.firestore();
        let issue_number = parseInt(this.props.location.state.personData.issueNumber);

        db.collection('sightings').where('issueNumber', '==', issue_number).get().then(snapshots => {

            this.setState({
                isLoading: false,
                sightingData: snapshots
            })
        }, err => {
            console.log(`Encountered error: ${err}`);
        });
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
                                m<span style={{ color: "#34E795" }}>i</span>ss<span style={{ color: "#34E795" }}>i</span>ng
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
                    <div style={{ height: "30px" }}></div>
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
