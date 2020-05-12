import React from 'react';
import Box from "@material-ui/core/Box";
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';

import './index.css'
import history from '../../../history';
import firebase from "../../../firebase_config"
import PersonDetails from "../../../components/peron_details"

const axios = require('axios');

var storageRef = firebase.storage().ref();
var db = firebase.firestore();

const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: '#34E795',
    },
    barColorPrimary: {
        backgroundColor: '#00695c',
    },
})(LinearProgress);

class AddCasePageThree extends React.Component {
    constructor(props) {
        super(props);
        this.personData = props.location.state.personData;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadDetails = this.uploadDetails.bind(this);
        this.state = {
            isLoading: false
        }
    } nextIssueNumber



    uploadDetails(imageUrl) {

        if (this.personData.issueNumber === undefined) {

            let data = JSON.stringify({
                url: imageUrl === undefined ? this.personData.imageUrl : imageUrl,
            });

            axios
                .post('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_02&returnRecognitionModel=false&detectionModel=detection_02',
                    data,
                    {
                        headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': 'e466501640774684ab08c3283e58243e' }
                    }).then(res => {
                        db.collection('next_issue_number').doc('number').get().then(function (doc) {
                            db.collection('missing_persons').doc(doc.data().issueNumber.toString()).set({
                                missingDate: this.personData.missingDate,
                                imageUrl: imageUrl === undefined ? this.personData.imageUrl : imageUrl,
                                name: this.personData.name,
                                issueNumber: doc.data().issueNumber,
                                missingFrom: this.personData.missingFrom,
                                age: parseInt(this.personData.age),
                                sex: this.personData.sex,
                                race: this.personData.race,
                                hairColor: this.personData.hairColor,
                                eyeColor: this.personData.eyeColor,
                                height: parseFloat(this.personData.height),
                                weight: parseFloat(this.personData.weight),
                                lastWearing: this.personData.lastWearing,
                                additionalInfo: this.personData.additionalInfo === undefined ? "" : this.personData.additionalInfo,
                                lat: this.personData.lat,
                                lng: this.personData.lng,
                                childFound: false,
                                faceId: res.data[0]['faceId']
                            }).then(function (snapshot) {
                                db.collection('next_issue_number').doc('number').set({
                                    issueNumber: doc.data().issueNumber + 1,
                                }).then((d) => history.replace("details", { issueNumber: doc.data().issueNumber }))
                            }.bind(this));
                        }.bind(this)
                        );
                    });
        }
        else {
            db.collection('missing_persons').doc(this.personData.issueNumber.toString()).update({
                missingDate: this.personData.missingDate,
                imageUrl: imageUrl === undefined ? this.personData.imageUrl : imageUrl,
                name: this.personData.name,
                missingFrom: this.personData.missingFrom,
                age: parseInt(this.personData.age),
                sex: this.personData.sex,
                race: this.personData.race,
                hairColor: this.personData.hairColor,
                eyeColor: this.personData.eyeColor,
                height: parseFloat(this.personData.height),
                weight: parseFloat(this.personData.weight),
                lastWearing: this.personData.lastWearing,
                additionalInfo: this.personData.additionalInfo === undefined ? "" : this.personData.additionalInfo,
                lat: this.personData.lat,
                lng: this.personData.lng,
            }).then(function (snapshot) {
                history.goBack()
            }.bind(this));
        }
    }

    handleSubmit() {
        this.setState({
            isLoading: true
        })
        if (this.personData.displayImageObject !== undefined) {
            storageRef
                .child("missing_persons/" + this.personData.displayImageObject.name)
                .put(this.personData.displayImageObject, { contentType: this.personData.displayImageObject.type }).then(function (snapshot) {
                    snapshot.ref.getDownloadURL().then(function (imageUrl) {
                        this.uploadDetails(imageUrl)
                    }.bind(this));
                }.bind(this));
        }
        else {
            this.uploadDetails()
        }
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

            <div className="case_page_3_container">
                <div className="left-side">
                    <div style={{ height: "100px" }} />
                    <Box marginTop="0px" fontFamily="Consolas" fontSize={20} fontWeight="fontWeightBold" m={1} color="#707070">
                        Personal
                        </Box>
                    <Box fontFamily="Consolas" fontSize={20} fontWeight="fontWeightBold" m={1} color="#707070" lineHeight="70px">
                        Additional
                        </Box>
                    <Box fontFamily="Consolas" fontSize={20} fontWeight="fontWeightBold" m={1} color="white">
                        Finish
                        </Box>
                </div>
                <div className="right-side" style={{ display: "inline-block" }}>
                    <div>
                        <div style={{ width: "100%", textAlign: "center", paddingTop: "25px" }}>
                            <Box fontSize={35} fontFamily="Consolas" fontWeight="fontWeightLi,ght" color="white">
                                m<span style={{ color: "#34E795" }}>i</span>ss<span style={{ color: "#34E795" }}>i</span>ng
                        </Box>
                        </div>
                        <div style={{ position: "absolute", top: 10, right: "50px" }}>
                            <IconButton onClick={() => history.replace("add_case_additional", { personData: this.personData })} style={{ color: "white" }}>
                                <ArrowBackIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div style={{ height: "50px" }} />
                    <div style={{ padding: "0px 65px" }}>
                        <PersonDetails personData={this.personData} />
                    </div>
                    <div style={{ height: "50px" }} />
                    <div style={{ width: "95%", textAlign: "right" }}>
                        <Button onClick={this.handleSubmit} style={{ padding: "5px 15px", fontWeight: "bold", borderRadius: "10px", backgroundColor: "#34E795", color: "black", fontSize: "25px", fontFamily: "Consolas" }}>
                            {this.personData.issueNumber === undefined ? "SEND OUT ALERT" : "UPDATE"}
                        </Button>
                    </div>
                </div>
            </div >
    }
}

export default AddCasePageThree