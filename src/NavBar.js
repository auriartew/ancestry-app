import React from 'react';
import {NavLink as RouterNavLink} from 'react-router-dom';
import {
    Button,
    Collapse,
    Col,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav, 
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form,
    FormGroup,
    Input
} from 'reactstrap';

import './App.css';

function UserAvatar(props) {
    if (props.user.avatar) {
        return (<img
        src={props.user.avatar} alt="user"
        className="rounded-circle align-self-center mr-2"
        style={{ width: '32px' }}></img>);
    }

    return (<i
        className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"
        style={{ width: '32px' }}></i>);
}

function AuthNavItem(props) {
    if (props.isAuthenticated) {
        return (
            <UncontrolledDropdown>
                <DropdownToggle nav caret>
                    <UserAvatar user={props.user} />
                </DropdownToggle>
                <DropdownMenu right>
                    <h5 className="dropdown-item-text mb-0">{props.user.displayName}</h5>
                    <p className="dropdown-item-text text-muted mb-0">{props.user.email}</p>
                    <DropdownItem divider />
                    <DropdownItem onClick={props.authButtonMethod}>Sign Out</DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }

    return (
        <NavItem>
            <Button
                onClick={props.authButtonMethod}
                className="border-0">Sign In</Button>
        </NavItem>
    );
}


export default class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        let searchBar = null;
        if (this.props.isAuthenticated) {
            searchBar = (<Form inline>
                            <FormGroup>
                            <Col md={12}>
                            <Input type="text" name="search" id="searchBar" placeholder="Search" />
                            </Col>
                            </FormGroup>
                            
                        </Form>)
        }

        return (
            <div>
                <Navbar className="nav-bar" expand="md" fixed="top">
                    
                        <NavbarBrand className="nav-link" href="/">Florida Genealogy</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="mr-auto" navbar>
                                <NavItem>
                                    <RouterNavLink to="/" className="nav-link" exact>Home</RouterNavLink>
                                </NavItem>
                                {(this.props.isAuthenticated && (<UncontrolledDropdown>
                                    <DropdownToggle nav caret>
                                        Family
                                    </DropdownToggle>                      
                                    <DropdownMenu right>
                                        <DropdownItem>
                                            <RouterNavLink to={`/family`} className="nav-link"> Family </RouterNavLink>
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>
                                            <RouterNavLink to={`/addfamily`} className="nav-link"> Add </RouterNavLink>
                                        </DropdownItem>    
                                    </DropdownMenu>
                                </UncontrolledDropdown>))}
                                {(this.props.isAuthenticated && (<UncontrolledDropdown>
                                    <DropdownToggle nav caret>
                                        Post
                                    </DropdownToggle>                      
                                    <DropdownMenu right>
                                        <DropdownItem>
                                            <RouterNavLink to={`/posts`} className="nav-link"> Post </RouterNavLink>
                                        </DropdownItem>
                                        <DropdownItem divider/>
                                        <DropdownItem>
                                            <RouterNavLink to={`/addpost`} className="nav-link"> Add Post </RouterNavLink>
                                        </DropdownItem>    
                                    </DropdownMenu>
                                </UncontrolledDropdown>))}
                            </Nav>
                            {searchBar}
                            <Nav className="justify-content-end" navbar>
                                <NavItem>
                                    <NavLink href="https://developer.microsoft.com/graph/docs/concepts/overview" target="_blank">
                                        <i className="fas fa-external-link-alt mr-1"></i>
                                        Docs
                                    </NavLink>
                                </NavItem>
                                <AuthNavItem
                                    isAuthenticated={this.props.isAuthenticated}
                                    authButtonMethod={this.props.authButtonMethod}
                                    user={this.props.user} />
                            </Nav>
                        </Collapse>
                    
                </Navbar>
            </div>
        );
    }

}