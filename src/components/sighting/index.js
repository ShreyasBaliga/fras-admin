import React from "react";
import "./index.css"
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';

class Sightings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false,
      selectedSighting: null
    }
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
  }
  handleModalOpen = (sighting) => {
    this.setState({
      selectedSighting: sighting,
      openModal: true
    })
  }
  handleModalClose = () => {
    this.setState({
      openModal: false
    })
  }
  render() {

    if (this.props.sightings === undefined)
      return (
        <table className="detail_table detail_table-scrollbar">
          <thead>
            <tr>
              <th>Location</th>
              <th>Time</th>
              <th>Match</th>
              <th>Info</th>
            </tr>
          </thead>
        </table>
      )
    else {

      return (
        <div>
          <table className="detail_table detail_table-scrollbar">
            <div style={{ width: "100%", display: "flex", color: "white" }}>
              <div style={{ fontSize: "18px", fontFamily: "Consolas", fontWeight: "bold", width: "36%", textAlign: "center" }}>
                Location
              </div>
              <div style={{ fontSize: "18px", fontFamily: "Consolas", fontWeight: "bold", width: "20%", textAlign: "center" }}>
                Time
              </div>
              <div style={{ fontSize: "18px", fontFamily: "Consolas", fontWeight: "bold", width: "22%", textAlign: "center" }}>
                Match
              </div>
              <div style={{ fontSize: "18px", fontFamily: "Consolas", fontWeight: "bold", width: "22%", textAlign: "center" }}>
                Info
              </div>
            </div >
            <tbody>
              {
                this.props.sightings.docs.length == 0 ?
                  <tr>
                    <td colSpan="4">
                      <Typography component="div" style={{ display: "inline-block" }}>
                        <Box fontSize={18} fontWeight="fontWeightLight" m={1} color="white">
                          NO DATA FOUND
                    </Box>
                      </Typography>
                    </td>
                  </tr> :
                  this.props.sightings.docs.map(function (sighting, index) {
                    let color = "#FF0033"
                    if (sighting.data().accuracy > 0.6)
                      color = "#34E795"
                    else if (sighting.data().accuracy > 0.4 && sighting.data().accuracy < 0.59)
                      color = "#FFF23A"

                    return (
                      <tr key={index} style={{ color: color, fontFamily: "Consolas" }}>
                        <td>{sighting.data().location}</td>
                        <td >{"10:55"}</td>
                        <td>{sighting.data().accuracy * 100}</td>
                        <td>{
                          <IconButton onClick={() => this.handleModalOpen(sighting.data())} style={{ color: color }}>
                            <InfoOutlinedIcon />
                          </IconButton>}
                        </td>
                      </tr>
                    )
                  }.bind(this))
              }
            </tbody>
          </table >
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.openModal}
            onClose={this.handleModalClose}
          >
            {this.state.selectedSighting !== null &&
              < div className="modal">
                <img style={{
                  width: "20%",
                  height: "auto",
                  borderRadius: "15px",
                  display: "inline-block"
                }}
                  src={this.props.personData.imageUrl} />
                <div style={{ width: "20px", display: "inline-block" }}></div>
                <img style={{
                  width: "20%",
                  height: "auto",
                  borderRadius: "15px",
                  display: "inline-block"
                }}
                  src={this.state.selectedSighting.imageWithHighestAccuracy.image === "" ? this.state.selectedSighting.images[0] : this.state.selectedSighting.imageWithHighestAccuracy.image} />
                <div style={{ width: "20px", display: "inline-block" }}></div>
                <Typography component="div" style={{ display: "inline-block" }}>
                  <Box fontSize={33} fontFamily="Consolas" fontWeight="fontWeightBold" m={1} color={this.state.selectedSighting.imageWithHighestAccuracy.accuracy > 0.6 ? "#34E795" : this.state.selectedSighting.imageWithHighestAccuracy.accuracy > 0.4 && this.state.selectedSighting.imageWithHighestAccuracy.accuracy < 0.59 ? "#FFF23A" : "#FF0033"}>
                    {this.state.selectedSighting.imageWithHighestAccuracy.accuracy * 100}%
                  </Box>
                  <Box fontSize={15} fontWeight="fontWeightBold" m={1} color="black">
                    {this.state.selectedSighting.location}<br />10:55
                  </Box>
                  <Box fontSize={15} fontWeight="fontWeightBold" m={1} color="black">
                    Was Alone : {this.state.selectedSighting.wasAlone}
                  </Box>
                  <Box fontSize={15} fontWeight="fontWeightBold" m={1} color="black">
                    For more information contact:
                  </Box>
                  <Box fontSize={15} fontWeight="fontWeightLight" m={1} color="black">
                    {this.state.selectedSighting.contactDetails}
                  </Box>
                </Typography>

              </div>
            }
          </Modal>
        </div >
      );
    }
  }
}

export default Sightings;
