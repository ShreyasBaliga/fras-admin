import React from 'react';
import './index.css'

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

function Row(props) {
    return <tr>
        <div style={{ display: "flex", padding: "2px 20px" }}>
            <div style={{ width: "20%", color: "#34E795" }}>
                <Box fontSize={19} fontFamily="Consolas" fontWeight="fontWeightBold" m={1}>
                    {props.propertyName}
                </Box>
            </div>
            <div style={{ width: "80%", color: "white" }}>
                <Box fontSize={19} fontFamily="Consolas" fontWeight="fontWeightBold" m={1}>
                    {props.value}
                </Box>
            </div>
        </div>
    </tr>
}

class PersonDetails extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.personData)
    }
    Row(props) {
        return <tr>
            <div style={{ display: "flex", padding: "2px 20px" }}>
                <div style={{ width: "20%", color: "#34E795" }}>
                    <Box fontSize={19} fontFamily="Consolas" fontWeight="fontWeightBold" m={1}>
                        {props.propertyName}
                    </Box>
                </div>
                <div style={{ width: "80%", color: "white" }}>
                    <Box fontSize={19} fontFamily="Consolas" fontWeight="fontWeightBold" m={1}>
                        {props.value}
                    </Box>
                </div>
            </div>
        </tr>
    }
    render() {
        const d = new Date(this.props.personData.missingDate);
        const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
        const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(d)
        return (
            <Grid container spacing={5}>
                <Grid item xs={4} >
                    <div>
                        <img style={{
                            width: "auto",
                            height: "450px",
                            borderRadius: "15px",
                            border: "4px solid #34E795",
                        }}
                            src={this.props.personData.imageUrl} />
                    </div>
                </Grid>
                <Grid item xs={8}>
                    <table>
                        <tr>
                            <div style={{ backgroundColor: "#34E795", color: "#222222", padding: "2px 20px" }}>
                                <Box fontSize={36} fontFamily="Consolas" fontWeight="fontWeightBold" m={1}>
                                    {this.props.personData.name}
                                </Box>
                                <Box fontSize={20} fontFamily="Consolas" fontWeight="fontWeightLight" m={1}>
                                    {this.props.personData.issueNumber === undefined ? "FRAS ALERT NOT SENT" : "FRAS ALERT NO." + this.props.personData.issueNumber}
                                </Box>
                            </div>
                        </tr>
                        <Row propertyName="MISSING DATE" value={mo + " " + da + ", " + ye} />
                        <Row propertyName="MISSING FROM" value={this.props.personData.missingFrom} />
                        <Row propertyName="AGE" value={this.props.personData.age} />
                        <Row propertyName="SEX" value={this.props.personData.sex} />
                        <Row propertyName="RACE" value={this.props.personData.race} />
                        <Row propertyName="HAIR COLOR" value={this.props.personData.hairColor} />
                        <Row propertyName="EYE COLOR" value={this.props.personData.eyeColor} />
                        <Row propertyName="HEIGHT" value={this.props.personData.height} />
                        <Row propertyName="WEIGHT" value={this.props.personData.weight} />
                    </table>
                </Grid>
            </Grid >
        );
    }
}

export default PersonDetails;