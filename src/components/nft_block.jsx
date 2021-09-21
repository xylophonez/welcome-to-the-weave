import { React, Component } from 'react'
import {Image, Container } from 'react-bootstrap'
import jellyfish from '../assets/jellyfish.png'
import atomic from '../assets/atomic.png'

export default class NftBlock extends Component {

    render() {
        return(
            <div className="blue-grad">
                <Container className="hero-secondary">
                    <h1 className="hero-secondary-title">More goodness for you!</h1>
                    <h2 className="p-2">After completing the above, you get a limited edition NFT.</h2>
                    <h5 className="hero-secondary-body">The immortal jellyfish is the only organism known to have immortality on Earth.</h5>
                    <h5 className="hero-secondary-body">This represents the data immortality that Arweave provides.</h5>
                    <Image alt="immortal jellyfish nft" className="mw-100 p-4" src={jellyfish}/>
                    <h5 className="hero-secondary-sm p-2">The first 10,000 individuals to reach a verification score of 75 get one.</h5>
                    <h5 className="hero-secondary-sm p-2">Only <strong>597</strong> immortal jellyfish left.</h5>
                    <h5 className="hero-secondary-sm p-2 pb-4">visit <a className="white-link" href="https://immortaljelly.fish">immortaljelly.fish</a> to see them all.</h5>
                    <Image alt="atomic nft logo" src={atomic} />
                    <p className="small p-2">all immortal jellyfish are atomic NFTs</p>
                </Container>
            </div>
        )
    }
}