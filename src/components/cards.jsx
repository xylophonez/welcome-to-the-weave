import { React, Component } from 'react'
import { Button, Card, Container, Row, Col } from 'react-bootstrap'
import { getVerification } from "arverify";
import Twitter from '../assets/twitter.png'
import Arconnect from '../assets/arconnect2.png'
import Arverify from '../assets/arverify2.png'
import { BsCheck } from 'react-icons/bs'
import Arweave from 'arweave'
import ArDB from "ardb";
import Swal from 'sweetalert2'


const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 100000,
  logging: false,
});

const ardb = new ArDB(arweave);


export default class Cards extends Component {

    constructor(props) {
        super()
        this.state = {
            test:false
        }
    }

    arconnect = () => { 
            const installed = window.arweaveWallet ? true : false
            return installed;
    }

    triggerAppInstallAlert = (title, app, icon, url) => {
        Swal.fire({
            title: `<h4>${title}</h4>`,
            html: 'If you need assistance, tweet <a href="http://twitter.com/onlyarweave">@onlyarweave</a>',
            imageUrl: icon,
            showDenyButton: true,
            showConfirmButton: true,
            denyButtonText: 'Later',
            confirmButtonText: `${app === 'ArDrive' ? 'Use' : 'Install'} ${app}`,
            confirmButtonColor: '#07ABF2',
            denyButtonColor: 'gray'
            
        }).then((value) => {
            if (value.isConfirmed) {
                    window.open(url, '_blank').focus();
            }
        })
    }

    triggerGetVerifiedAlert = async () => {
        Swal.fire({
            title: '<h4>Share your verification link to get verified</h4>',
            html: 'If you need assistance, tweet <a href="http://twitter.com/onlyarweave">@onlyarweave</a>',
            showDenyButton: true,
            showConfirmButton: true,
            denyButtonText: 'Later',
            confirmButtonText: 'Get 20% verified!',
            confirmButtonColor: '#07ABF2',
            denyButtonColor: 'gray'
            
        }).then((value) => {
            if (value.isConfirmed) {
                window.open(`https://trust.arverify.org`, '_blank').focus();

            }
        })
    }

    onInstallArConnectClick = async () => {

        if (!this.arconnect()) {
            this.triggerAppInstallAlert('Install ArConnect to complete this step', 'Arconnect', Arconnect, 'https://arconnect.io')
        } else {
            await this.walletAddr()
        }
            if (this.state.addr) {
                this.setState({arconnectInstalled: true})
            } else {
                this.triggerAppInstallAlert('Install ArConnect to complete this step', 'Arconnect', Arconnect, 'https://arconnect.io')
      }
    }

    walletAddr = async () => {
        let permissions
           try {
                 permissions = await window.arweaveWallet.getPermissions()
           } catch {
               permissions = []
            }
        if (permissions.length === 0 && window.arweaveWallet) {
                window.arweaveWallet.connect(['ACCESS_ADDRESS'])
        } else {
            const addr = await window.arweaveWallet.getActiveAddress()
            this.setState({addr})
            return addr
        }
    }

    onArVerifyClick = async () => {
        if (!this.state.arconnectInstalled) {
          this.triggerAppInstallAlert('Install ArConnect to complete this step', 'Arconnect', Arconnect, 'https://arconnect.io')
        } else {
        let v = await this.checkIfVerified()
        this.setState({verification: v})
        let p = v.percentage
        if (p > 19) {
            this.setState({verifiedTwenty: true})
            this.setState({verifiedClass: 'success'})
        }
        else{
            this.setState({verifiedTwenty: false})
            this.setState({verifiedClass: 'default'})
            if (this.state.addr) {
                this.triggerGetVerifiedAlert()
            }
        }

        if (!v) {
          this.triggerAppInstallAlert('Install ArVerify to complete this step', 'ArVerify', Arverify, 'https://arverify.org')
        }

       if (this.state.verification.percentage === 'undefined') {
         //   this.triggerAppInstallAlert('Install ArVerify to complete this step', 'ArVerify', Arverify, 'https://arverify.org')
        }
        if (this.state.verification && this.state.verification.percentage && (this.state.verification.percentage < 19)) {
            console.log('i should fire')
            this.triggerGetVerifiedAlert()
        }
        if (this.state.arconnectInstalled) {
            //await this.walletAddr()
           // this.checkIfVerified()
        } else {
        //this.triggerAppInstallAlert('Install ArVerify to complete this step', 'ArVerify', Arverify, 'https://arverify.org')

        }

        this.setState({test: true})
    }
    }

    checkIfVerified = async () => {
        await this.walletAddr()
        const verification = await getVerification(this.state.addr);
        this.setState({verification: verification})
        return verification
    }

    checkBalance = async () => {
      arweave.wallets.getBalance(this.state.addr).then((balance) => {
        let winston = balance;
        let ar = arweave.ar.winstonToAr(balance);
        console.log(winston);
        //125213858712
        console.log(ar);
        //0.125213858712
    });
    }

    async componentDidMount() {
         window.addEventListener("arweaveWalletLoaded", () => {
            this.setState({arconnectInstalled: true})
        });
        await this.checkIfVerified()
        await this.checkBalance() 
    }

    verificationStatus = () => {
        try {
          if (this.state.verification.percentage === null) { 
            return 'Get verified'
         }  else if (this.state.verification.percentage > 19) {
            return 'Check verification status'
         } else {
            let prettyPercent = Math.floor(this.state.verification.percentage)
            return `You are ${prettyPercent}% verified`
          }
        } catch {

           return 'Click to check verification status'
        }
    }

    onTwitterClick = () => {
        window.open('https://twitter.com', '_blank');
    }
/*
    onArDriveClick = async () => {
        await this.walletAddr()
        await this.checkIfVerified()
        console.log(this.state.addr)
        if (!this.state.verifiedTwenty) {
            this.triggerAppInstallAlert('Get 20% verifed with ArVerify to move onto this step', 'ArVerify', Arverify, 'https://arverify.org')
            return null
        }
        if (!this.state.arconnectInstalled) {
          this.triggerAppInstallAlert('Install ArConnect to complete this step', 'Arconnect', Arconnect, 'https://arconnect.io')
          return null
        } else {
        ardb
        .search("transactions")
        .appName('ArDrive-Web')
        .from(this.state.addr)
        .limit(1)
        .find()
        .then((Txs) => {
            if (Txs.length > 0) {
          this.setState({ ardriveUploads: Txs });
            } else {
          this.triggerAppInstallAlert('Go to ArDrive to upload your first permaphoto', 'ArDrive', Ardrive, 'https://ardrive.io')
            }
        });
      }
    }
*/
    arverifyButtonStyle = async () => {
        let v = this.checkIfVerified()
        if (v.verification.percentage > 19) {
            return 'success'
        } else {
            console.log('default')
            return 'default'
        }
    }

    render() {
        return(
            <div className="mt-4 cards-row d-flex">
                <Container fluid className="mb-4">
                    <h1 className="mb-2 p-3 hero-title">Store anything online, permanently.</h1>
                    <Row className="">
                        <Col xs={12} md={4}>
                            <h2 className="pt-3">1</h2>
                           <Card border="primary" className="">
                            <Card.Title><h4>Get the ArConnect</h4>
                            <h4>Browser wallet extension</h4></Card.Title>
                            <Card.Img className="p-5" alt="arconnect logo" src={Arconnect}/>
                            <div className="p-1">
                                {this.state.arconnectInstalled ?
                                <Button variant="success" className="wv-card-button"><BsCheck/> ArConnect installed</Button> :
                                <Button onClick={() => this.onInstallArConnectClick()} variant="default" className="wv-card-button">Install ArConnect</Button>
                                }
                            </div>
                            </Card>
                        </Col>
                      
                        <Col xs={12} md={4}>
                            <h2 className="pt-3">2</h2>
                           <Card border="primary">
                            <Card.Title><h4>Tweet to get your 0.02 AR</h4>
                            <h4>tokens (~$1.19 in value) </h4></Card.Title>
                            <Card.Img className="p-5" alt="ardrive logo" src={Twitter}/>
                            <div className="p-1">
                                { this.state.ardriveUploads ? // verifiedStatus
                                    <Button variant="success" className="wv-card-button"><BsCheck/>Done</Button> :
                                    <Button variant="default" onClick={() => this.onTwitterClick()} className="wv-card-button">Tweet to get verified</Button>
                                }
                            </div>
                            </Card>
                        </Col>
                                               <Col xs={12} md={4}>
                            <h2 className="pt-3">3</h2>
                            <Card border="primary">
                            <Card.Title><h4>Get a limited edition</h4><h4>Arweave NFT</h4></Card.Title>
                            <Card.Img className="p-5" alt="arverify-logo" src={Arverify}/>
                            <div className="p-1">
                                <Button
                                    variant={this.state.verifiedClass || 'default'}
                                    className="wv-card-button"
                                    onClick={() => this.onArVerifyClick()}>
                                    {this.verificationStatus()}
                                </Button>
                            </div>
                            </Card>
                        </Col>
  <span className="mt-4 ls-17">need more details?</span>
                        <span className="ls-17 mt-1"><a href="/">watch the video</a></span>

 

                    </Row>
                </Container>
            </div>
            
        )
    }
}