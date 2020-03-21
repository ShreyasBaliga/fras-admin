import React from "react";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import firebase from "../../firebase_config"

import history from '../../history';

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import "./index.css"


class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      email_error: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }
  handleClick() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(function (res) {
        firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.SESSION)
          .then(() => history.replace('/cases'));
      })
      .catch(function (error) {
        alert("Email or Password wrong.Please try again");
      });

  }
  handleEmail(event) {
    this.setState({
      email: event.target.value
    });
  }
  handlePassword(e) {
    this.setState({
      password: e.target.value
    });
  }
  render() {
    return (
      <div className="main">
        <div className="above">
          <center>
            <Typography component="div" style={{ display: "inline-block" }}>
              <Box fontSize={40} fontFamily="Consolas" fontWeight="fontWeightBold" m={1} color="white">
                m<span style={{ color: "#34E795" }}>i</span>ss<span style={{ color: "#34E795" }}>i</span>ng
                        </Box>
            </Typography>
          </center>
          <div className="main_container">
            <div className="form_container">
              <ValidatorForm
                ref="form"
                onSubmit={this.handleClick}
                onError={errors => console.log(errors)}
              >
                <TextValidator
                  fullWidth
                  autoFocus
                  margin="normal"
                  label="Email"
                  onChange={this.handleEmail}
                  name="email"
                  value={this.state.email}
                  validators={["required", "isEmail"]}
                  errorMessages={["This field is required", "Email is not valid"]}
                />
                <div style={{ height: "30px" }} />
                <TextValidator
                  fullWidth
                  margin="normal"
                  label="Password"
                  onChange={this.handlePassword}
                  name="password"
                  type="password"
                  validators={["required"]}
                  errorMessages={["This field is required"]}
                  value={this.state.password}
                />
                <div style={{ height: "40px" }} />
                <Button
                  type="submit"
                  style={{ backgroundColor: "#34E795", color: "white", borderRadius: "15px", padding: "10px" }}
                  fullWidth
                  variant="contained"
                >
                  Sign In
            </Button>
              </ValidatorForm>
            </div>
            <span style={{ fontWeight: "bold", fontFamily: "Consolas", color: "#707070" }}>Don't have credentials to monitor the missing persons directory?
            Request your division head or the Head of your PD for permission.</span>
          </div>
        </div>
      </div >
    );
  }
}
export default LogIn;