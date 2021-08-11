import React, { useState } from 'react';
import { config } from './Config';
import { Form, FormGroup, FormControl, Row, FormLabel, Button } from 'react-bootstrap';
import './App.css';

export default function AddPost (props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    var accessToken = await props.getAccessToken(config.scopes);
    var fullName = props.user.displayName;
    var indexOfComma = fullName.indexOf(',');
    var lastName = fullName.substring(0, indexOfComma);
    var firstName = fullName.substring(indexOfComma + 2);
    const formData = {
      "title": title,
      "description": description,
      "username": firstName + " " + lastName.substring(0, 1) + '.'
    }

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'data': formData, 'access': accessToken})
    };

    await fetch(`/api/AddPost`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            window.location.href = '/posts';
        })  
        
  }
  //poop
  if (props.isAuthenticated) {
    return (
      <div className="container-fluid search">
      <div className="addpost justify-content-center row">
      <Form>
        <FormGroup as={Row}>
          <FormLabel>Title: </FormLabel>
          <FormControl
            value={title}
            type="text"
            onChange={e => setTitle(e.target.value)} />
        </FormGroup>
        <FormGroup as={Row}>
          <FormLabel>Description: </FormLabel>
          <FormControl
            value={description}
            type="text"
            rows="3"
            as="textarea"
            onChange={e => setDescription(e.target.value)} />
        </FormGroup>
        <Button
          onClick={e => handleSubmit(e)}>Submit</Button>
      </Form>   
      </div></div>
    )
  }
  else {
    return null;
  }

}

