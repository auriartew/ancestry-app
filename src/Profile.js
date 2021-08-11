import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Grandma from './grandmother.svg';
import { config } from './Config';
import {FormControl, FormLabel, Row, Form, Col} from 'react-bootstrap';
import withAuthProvider from './AuthProvider';
import {
    BrowserRouter as 
    Route,
    Link,
    useParams,
  } from "react-router-dom";
import './Profile.css';
import woman from './woman.png';

function AboutSection(props) {
    return (
        <p>{props.about}</p>
    )
}

class Profile extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            firstName: "",
            lastName: "",
            dob: "",
            about: "",
            editMode: false,
            isLoading: true,
            access: null,
        }
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value})          
    }

    handleClick(event, val) {   
        this.setState({[event.target.name]: val})
    }

    async handleSubmit(event) {
        event.preventDefault();

        var filledInData = {};
        Object.keys(this.state).map((key) => {
            if (this.state[key] !== "" && (key!== "isLoading") && (key!== "editMode")) {
                filledInData[key] = this.state[key];
            }
        });
        console.log(filledInData);

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filledInData)
        };
        this.setState({isLoading: true});
        fetch('/api/UpdateProfileInfo', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("data" + data);
                this.setState({isLoading: false});    
                alert('saved');
                
            },
            (error) => {
                console.log(error)
            })
    }

    async componentDidMount() {
        if (this.props.user)
        {
          try {
            // Get the user's access token
            var accessToken = await this.props.getAccessToken(config.scopes);
            this.setState({
                access: accessToken
            })
            
            const requestOptions = {
                method: 'GET',
                headers: {'Content-Type': 'application/json', 'access': this.state.access},
            };

            fetch(`/api/GetProfileInfo`, requestOptions, {})
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);            
                this.setState({
                    firstName: data["firstName"]
                })
                this.setState({
                    lastName: data["lastName"]
                })
                this.setState({
                    dob: data["dob"]
                })
                this.setState({
                    about: data["about"]
                })
                this.setState({editMode: false});
            })
            .catch((error) => console.log(error));
                         
          }
          catch (err) {
            console.log(err)            
          }
        }
      }

      
    render() {
        let match=this.props.match;
        console.log(this.props.user.displayName)
        if(this.props.isAuthenticated) {
            if (!this.state.editMode) {
                return (
                    <div className="profile-container">
                        <div className="top-part">
                            <div className="image-section">
                                <img className="profile-image" src={woman} />
                            </div>
                            <div className="basic-info">
                                <h1>{this.props.user.displayName}</h1>
                                <p>{this.state.dob}</p>
                                <button 
                                    className="btn"
                                    name="editMode" 
                                    value={this.state.editMode} 
                                    onClick={(e) => this.handleClick(e, !(this.state.editMode))}>Edit</button>
                                <p className="tab">About</p>
                                
                            </div>
                        </div>
                        <div className="main-part">
                        <div className="main-content">
                        {<AboutSection about={this.state.about} />}
                        </div>
                        
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div className="profile-container">
                        <div className="top-part">
                            <div className="image-section">
                                <img className="profile-image" src={woman} />
                            </div>
                            <div className="basic-info">
                            <h1>Update Profile Info</h1>
                            </div>
                        </div>
                        <div className="form-part">
                            <div className="form-container">
                            <Form>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                First Name:
                                </Form.Label>
                                <Col>
                                <Form.Control 
                                    type="text" name="firstName"
                                    value={this.state.firstName || ""} 
                                    onChange={this.handleChange}  
                                />
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                Last Name:
                                </Form.Label>
                                <Col>
                                <Form.Control 
                                    type="text" name="lastName"
                                    value={this.state.lastName || ""} 
                                    onChange={this.handleChange} 
                                />
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                Date of Birth:
                                </Form.Label>
                                <Col>
                                <Form.Control 
                                    type="text" name="dob"
                                    value={this.state.dob || ""} 
                                    onChange={this.handleChange}
                                />
                                </Col>
                            </Form.Row>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>About:</Form.Label>
                                <Form.Control as="textarea" rows={3} 
                                    type="text" 
                                    id="about"
                                    name="about"
                                    value={this.state.about || ""} 
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <button className="btn" onClick={this.handleSubmit}>Save</button>
                                    <button 
                                        className="btn"
                                        name="editMode" 
                                        value={this.state.editMode} 
                                        onClick={(e) => this.handleClick(e, !(this.state.editMode))}>Cancel</button>
                            </Form>
                            </div>
                        
                        </div>
                    </div>    
                )
            }
            /** 
            return (
            <div className="profile-container">
                <div className="profile-box">
                    <p>Please fill out your profile information</p>
                    <Form>
                    <div className="form-group">
                        <label>First Name: </label>
                        <FormControl type="text" name="firstName"
                            value={this.state.firstName || ""} 
                            onChange={this.handleChange}  
                            className="animated fadein"
                        />  
                    </div>
                    <div className="form-group">
                        <label>Last Name: </label>
                        <FormControl type="text" name="lastName"
                                    value={this.state.lastName || ""} 
                                    onChange={this.handleChange}  
                                    className="animated fadein"
                        />  
                    </div>
                    <div className="form-group">
                        <label>Date of Birth: </label>
                        <FormControl type="text" name="dob"
                                    value={this.state.dob || ""} 
                                    onChange={this.handleChange}  
                                    className="animated fadein"
                        />  
                    </div>
                    <button className="btn" onClick={this.handleSubmit}>Save</button>
                    </Form> 
                </div>
            </div>  
            )*/
        }
        else {
            return null;
        }
    }

}
export default withAuthProvider(Profile);