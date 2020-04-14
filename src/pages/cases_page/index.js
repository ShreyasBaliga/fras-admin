import React from 'react';
import ReactList from 'react-list';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';

import "./index.css"
import history from '../../history';
import firebase from "../../firebase_config"

const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: '#34E795',
    },
    barColorPrimary: {
        backgroundColor: '#00695c',
    },
})(LinearProgress);


class CasesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            casesData: null
        }
        this.renderItem = this.renderItem.bind(this);
        this.getData = this.getData.bind(this);
    }
    getData() {
        var db = firebase.firestore();
        var personQuery = db.collection('missing_persons')
        personQuery.get()
            .then(snapshot => {
                this.setState({
                    isLoading: false,
                    casesData: snapshot.docs
                })
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        personQuery.onSnapshot(snapshot => {
            this.setState({
                casesData: snapshot.docs
            })
        }, err => {
            console.log(`Encountered error: ${err}`);
        });
    }
    componentDidMount() {
        this.getData();
    }
    componentWillMount() {
        firebase.auth().onAuthStateChanged((authenticated) => {
            if (authenticated === null) {
                history.replace("")
            }
        })
    }
    renderItem(index, key) {
        return (
            <div style={{ height: 300, marginBottom: "50px" }} key={key}>
                <img style={{
                    height: "270px",
                    width: "auto",
                    borderRadius: "15px",
                    display: "inline-block",
                    border: "4px solid #34E795"
                }}
                    src={this.state.casesData[index].data().imageUrl} />
                <div style={{ width: "20px", display: "inline-block" }}></div>
                <Typography component="div" style={{ display: "inline-block" }}>
                    <Box paddingTop="0px" fontFamily="Consolas" fontSize={30} fontWeight="fontWeightLight" m={1} color="white">
                        {this.state.casesData[index].data().name}
                    </Box>
                    <Box fontFamily="Consolas" fontSize={30} fontWeight="fontWeightLight" m={1} color="white" lineHeight="100px">
                        STATUS
                        </Box>
                    <Box fontFamily="Consolas" fontSize={30} fontWeight="fontWeightLight" m={1} color="white">
                        MISSING FROM
                        </Box>
                    <Button onClick={() => history.push("sightings", { personData: this.state.casesData[index].data() })} variant="contained" style={{ marginTop: "10px", backgroundColor: "#34E795", color: "black", width: "250px", borderWidth: "2px" }}>
                        MORE INFO
                    </Button>
                </Typography>
                <div style={{ width: "30px", display: "inline-block" }}></div>
                <Typography component="div" style={{ display: "inline-block" }}>
                    <Box fontFamily="Consolas" fontSize={30} fontWeight="fontWeightLight" m={1} color="#34E795">
                        IFRA ALERT ISSUE NO .{this.state.casesData[index].data().issueNumber}
                    </Box>
                    <Box fontFamily="Consolas" fontSize={30} fontWeight="fontWeightLight" m={1} color="#34E795" lineHeight="100px">
                        {this.state.casesData[index].data().childFound ? "FOUND" : "MISSING"}
                    </Box>
                    <Box fontFamily="Consolas" fontSize={30} fontWeight="fontWeightLight" m={1} color="#34E795">
                        {this.state.casesData[index].data().missingFrom}
                    </Box>
                    <Button onClick={() => history.push('details', { issueNumber: this.state.casesData[index].data().issueNumber })} variant="outlined" style={{ marginTop: "10px", borderColor: "white", color: "white", width: "250px", borderWidth: "2px" }}>
                        UPDATE INFO
                    </Button>
                </Typography>
            </div >
        );
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
                <div className="cases_page_container">
                    <div style={{ width: "100%", display: "flex" }}>
                        <div style={{ width: "33%", paddingLeft: "25px" }}>
                            <Button onClick={() => history.push("add_case_personal", { personData: undefined })} variant="outlined" style={{ borderRadius: "15px", backgroundColor: "#222222", borderColor: "white", color: "white", borderWidth: "2px" }}>
                                + ADD ALERT
                            </Button>
                        </div>
                        <div style={{ width: "33%", textAlign: "center" }}>
                            <Typography component="div">
                                <Box fontSize={35} fontFamily="Consolas" fontWeight="fontWeightLight" color="white">
                                    m<span style={{ color: "#34E795" }}>i</span>ss<span style={{ color: "#34E795" }}>i</span>ng
                        </Box>
                            </Typography>
                        </div>
                        <div style={{ width: "33%", textAlign: "right" }} >
                            <Button onClick={() => firebase.auth().signOut()} variant="outlined" style={{ borderRadius: "15px", backgroundColor: "#222222", borderColor: "white", color: "white", borderWidth: "2px" }}>
                                LOGOUT
                            </Button>
                        </div>
                    </div >

                    <div style={{ height: "100px" }}></div>
                    <div style={{ overflow: 'auto', maxHeight: 500, marginLeft: "25px" }}>
                        <ReactList
                            itemRenderer={this.renderItem}
                            length={this.state.casesData.length}
                            type='uniform'
                        />
                    </div >
                </div >
            );
    }
}

export default CasesPage;