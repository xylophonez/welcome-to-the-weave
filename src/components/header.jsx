import { React, Component } from 'react'
import { Navbar, Container, Button, Image } from 'react-bootstrap'
import logo from '../assets/logo2.png'

export default class Header extends Component {

    render() {
        return(
            <div className="">
                <Navbar sticky="top">
                    <Container>
                        <Navbar.Brand className="justify-content-start" href="#home">
                            <Image className="nav-logo" alt="logo" src={logo}/>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <Button variant="link">About</Button>
                        </Navbar.Text>
                        <Navbar.Text>
                            <Button variant="link">What is Arweave?</Button>
                        </Navbar.Text>
                        <Navbar.Text>
                            <Button variant="link">FAQs</Button>
                        </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        )
    }
}