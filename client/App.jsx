import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";

import NavBar from './components/NavBar.jsx';

import './stylesheet/styles.scss';

// Routers here
import Home from './pages/Home.jsx';
import Favorites from './pages/Favorites.jsx';
import SignUp from './pages/SignUp.jsx';
import Results from './pages/Results.jsx';


class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null, // will reassigned as the user object sent back from server after client signs up/logins // {firstName: string, lastName: username: string}
      closedLocations: null,    // closed locations: object with keys as the placeIDs and values of true; -> will be created when client receives results back from fetch request   
      //longitude: number -> will be created after component mounts
      //latitude: number -> will be created after component mounts
      preferredLocations: null,// preferredLocations: object with keys as the placeIDs and values of true; -> will be created when client receive user info after user logins
      
      // results: an array of objects // will be created when server sends back retrieved list of results
    };

    this.updateUserCoordinates = this.updateUserCoordinates.bind(this);
    this.searchButtonHandler = this.searchButtonHandler.bind(this);
    this.categoryButtonHandler = this.categoryButtonHandler.bind(this);
  }

  categoryButtonHandler(event) {
    event.preventDefault();
    console.log(event.target.value)
  }

  updateUserCoordinates(latitude, longitude){
    // updates the state with the user's current location
    const userLat = latitude;
    const userLong = longitude;

    this.setState((prevState) => {
      const newState = {...prevState};
      newState.latitude = userLat;
      newState.longitude = userLong;
      return newState;
    })
  }


  searchButtonHandler(term){
    // fetch request to server Api as POST
    // send body with friend address
      // send over friend address 
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        term: term,
      }),
    })
    .then((data) => data.json())
    .then((data) => {
      //console.log(data.recommendations)
       this.setState((prevState) => {
        const newState = {...prevState};
        newState.results = data.results;
        newState.closedLocations = data.closedLocations;
        return newState;
      })

    })
    .catch((err) => console.log(err));
  }

  searchButtonHandler() {
    // send fetch request to server
    // update state with recieved results data
    // fetch()
  }
  

  componentDidMount(){
    // grab the user's location using browser's location and updates state -> client needs to give permission to access location
    const successfulLookup = (position) => {
      const { latitude, longitude } =  position.coords;
      this.updateUserCoordinates(latitude, longitude);
    };
  
    navigator.geolocation.getCurrentPosition(successfulLookup, console.log);
  }

  componentDidUpdate(){
    console.log('State updated: ', this.state);
  }


  render() {

    // appHeader -> is fixed stagnant/constant throughout entire UX. NavBar component will change depending on App's state
    return (

      <Router>
        <div className='appHeader'>
          <Link to='/'><img id='logo' src='./assets/locallysrcdlogo.png' alt='Locally SRCD Logo'></img></Link>
          <NavBar />
        </div>

        <Switch>
          <Route path='/signup' component={SignUp} />
          <Route path='/favorites' component={Favorites} />
          <Route path='/results' render={() => (<Results state={this.state} />)} />
          <Route path='/' exact render={() => (<Home state={this.state} catBtnHandler={this.categoryButtonHandler} searchButtonHandler={this.searchButtonHandler} />)} />

        </Switch>

      </Router>

    )};
}

export default App;


/*         
<Route path='/favorites' component={Favorites} />
<Route path='/' component={Home} /> 
<Route path='/signup' component={SignUp} />        
        
        */