import React from 'react';
import './index.css'
import history from '../../history';
import PersonDetails from "../../components/peron_details";

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';


import firebase from "../../firebase_config"

const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: '#34E795',
    },
    barColorPrimary: {
        backgroundColor: '#222222',
    },
})(LinearProgress);

const ColorCircularProgress = withStyles({
    root: {
        color: '#34E795',
    },
})(CircularProgress);


var db = firebase.firestore();
var personQuery = db.collection('missing_persons')

class DetailsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openModal: false,
            isLoading: true,
            personData: null,
            childFound: false,
            isModalLoading: false,
        }
        this.handleChildfound = this.handleChildfound.bind(this)
    }
    getData() {
        personQuery.doc(this.props.location.state.issueNumber.toString()).get()
            .then(snapshot => {
                this.setState({
                    isLoading: false,
                    personData: snapshot.data(),
                    childFound: snapshot.data().childFound
                })
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        personQuery.doc(this.props.location.state.issueNumber.toString()).onSnapshot(snapshot => {
            this.setState({
                personData: snapshot.data(),
                childFound: snapshot.data().childFound
            })
        }, err => {
            console.log(`Encountered error: ${err}`);
        });
    }
    componentDidMount() {
        this.getData();
    }

    handleModalOpen = () => {
        this.setState({
            openModal: true
        })
    }
    handleModalClose = () => {
        this.setState({
            openModal: false
        })
    }
    componentWillMount() {
        firebase.auth().onAuthStateChanged((authenticated) => {
            if (authenticated === null) {
                history.replace("")
            }
        })
    }
    handleChildfound() {
        this.setState({
            isModalLoading: true,
        })
        personQuery.doc(this.props.location.state.issueNumber.toString()).update({
            childFound: true
        }).then(function (snapshot) {
            this.handleModalClose()
            this.setState({ isModalLoading: false, childFound: true })
        }.bind(this));
    }
    render() {
        return this.state.isLoading ?
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
            </div > :
            <div className="details_page_container">
                <center>
                    <Box fontSize={40} fontFamily="Consolas" fontWeight="fontWeightLight" color="white">
                        m<span style={{ color: "#34E795" }}>i</span>ss<span style={{ color: "#34E795" }}>i</span>ng
                    </Box>
                </center>
                <div style={{ position: "absolute", right: "50px", top: "25px" }}>
                    <IconButton onClick={() => history.goBack()} style={{ color: "white", padding: "0px" }}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
                <div style={{ height: "50px" }} />
                <div style={{ marginLeft: "100px", marginRight: "80px" }}>
                    <PersonDetails personData={this.state.personData} />
                </div>
                <div style={{ height: "50px" }} />
                {this.state.childFound === false && <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ width: "43%", textAlign: "right" }}>
                        <Button onClick={() => this.handleModalOpen()} variant="contained" style={{ backgroundColor: "#34E795", color: "black", width: "250px", borderWidth: "2px" }}>
                            PERSON FOUND
                    </Button>
                    </div>
                    <div style={{ width: "5%" }} />
                    <div style={{ width: "43%" }}>
                        <Button onClick={() => history.push("add_case_personal", { personData: this.state.personData })} variant="outlined" style={{ borderColor: "white", color: "white", width: "250px", borderWidth: "2px" }}>
                            UPDATE DETAILS
                    </Button>
                    </div>
                </div>
                }
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.openModal}
                    onClose={this.handleModalClose}
                >
                    {this.state.isModalLoading ?
                        <center style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)"
                        }}><ColorCircularProgress />
                        </center> :
                        < div className="modal">
                            <img style={{
                                width: "40%",
                                height: "auto",
                                borderRadius: "15px",
                            }}
                                src={this.state.personData.imageUrl} />
                            <div style={{ width: "20px" }} />
                            <div>
                                <Box fontFamily="Consolas" fontSize={40} fontWeight="fontWeightLight" m={1} color="black">
                                    Is the person found?
                            </Box>
                                <div style={{ height: "20px" }} />
                                <Button onClick={this.handleChildfound} variant="contained" style={{ backgroundColor: "#34E795", color: "black", width: "250px", borderWidth: "2px" }}>
                                    YES, CLOSE ALERT
                            </Button>
                                <div style={{ height: "20px" }} />
                                <Button onClick={() => this.handleModalClose()} variant="outlined" style={{ color: "black", width: "250px", borderWidth: "2px", borderColor: "black" }}>
                                    NO, GO BACK
                            </Button>
                            </div>
                        </div>
                    }
                </Modal>
            </div >

    }
}

export default DetailsPage;