import React from 'react';
import './index.css'
import history from '../../history';
import PersonDetails from "../../components/peron_details"
import firebase from "../../firebase_config"

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

class DetailsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openModal: false
        }
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
    render() {
        return (
            <div className="root">
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
                    <PersonDetails personData={this.props.location.state.personData} />
                </div>
                <div style={{ height: "50px" }} />
                <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ width: "43%", textAlign: "right" }}>
                        <Button onClick={() => this.handleModalOpen()} variant="contained" style={{ backgroundColor: "#34E795", color: "black", width: "250px", borderWidth: "2px" }}>
                            CHILD FOUND
                    </Button>
                    </div>
                    <div style={{ width: "5%" }} />
                    <div style={{ width: "43%" }}>
                        <Button variant="outlined" style={{ borderColor: "white", color: "white", width: "250px", borderWidth: "2px" }}>
                            UPDATE DETAILS
                    </Button>
                    </div>
                </div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.openModal}
                    onClose={this.handleModalClose}
                >
                    < div className="modal">
                        <img style={{
                            width: "40%",
                            height: "auto",
                            borderRadius: "15px",
                        }}
                            src={this.props.location.state.personData.imageUrl} />
                        <div style={{ width: "20px" }} />
                        <div>
                            <Box fontFamily="Consolas" fontSize={40} fontWeight="fontWeightLight" m={1} color="black">
                                Is the child found?
                            </Box>
                            <div style={{ height: "20px" }} />
                            <Button variant="contained" style={{ backgroundColor: "#34E795", color: "black", width: "250px", borderWidth: "2px" }}>
                                YES, CLOSE ALERT
                            </Button>
                            <div style={{ height: "20px" }} />
                            <Button onClick={() => this.handleModalClose()} variant="outlined" style={{ color: "black", width: "250px", borderWidth: "2px", borderColor: "black" }}>
                                NO, GO BACK
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div >
        );
    }
}

export default DetailsPage;