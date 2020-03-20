import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";


import DetailsPage from "./pages/details_page";
import LogIn from "./pages/login_page";
import CasesPage from "./pages/cases_page";
import history from './history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={LogIn} />
                    <Route path="/cases" component={CasesPage} />
                    <Route path="/details/:issueNumber" component={DetailsPage} />
                </Switch>
            </Router>
        )
    }
}