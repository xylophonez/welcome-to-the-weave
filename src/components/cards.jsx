import { React, Component } from 'react'
import { Button, Card, Container, Row, Col } from 'react-bootstrap'
import { getVerification } from 'arverify'
import Twitter from '../assets/twitter2021.png'
import Arconnect from '../assets/arconnect3.png'
import Arverify from '../assets/arverify2.png'
import Ardrive from '../assets/ardrive3.png'
import { BsCheck } from 'react-icons/bs'
import Arweave from 'arweave'
import Swal from 'sweetalert2'
import './cards.css'
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 100000,
  logging: false
})
export default class Cards extends Component {
  constructor (props) {
    super()
    this.state = {
      test: false
    }
  }
  arconnect = () => {
    const installed = window.arweaveWallet ? true : false
    return installed
  }
  triggerAppInstallAlert = (title, app, icon, url) => {
    Swal.fire({
      title: `<h4>${title}</h4>`,
      html:
        'If you need assistance, tweet <a href="http://twitter.com/onlyarweave">@onlyarweave</a>',
      imageUrl: icon,
      showDenyButton: true,
      showConfirmButton: true,
      denyButtonText: 'Later',
      confirmButtonText: `${app === 'ArDrive' ? 'Use' : 'Install'} ${app}`,
      confirmButtonColor: '#07ABF2',
      denyButtonColor: 'gray'
    }).then(value => {
      if (value.isConfirmed) {
        window.open(url, '_blank').focus()
      }
    })
  }
  triggerGetVerifiedAlert = async () => {
    Swal.fire({
      title: '<h4>Share your verification link to get verified</h4>',
      html:
        'If you need assistance, tweet <a href="http://twitter.com/onlyarweave">@onlyarweave</a>',
      showDenyButton: true,
      showConfirmButton: true,
      denyButtonText: 'Later',
      confirmButtonText: 'Get 20% verified!',
      confirmButtonColor: '#07ABF2',
      denyButtonColor: 'gray'
    }).then(value => {
      if (value.isConfirmed) {
        window.open(`https://trust.arverify.org`, '_blank').focus()
      }
    })
  }
  onInstallArConnectClick = async () => {
    if (!this.arconnect()) {
      this.triggerAppInstallAlert(
        'Install ArConnect to complete this step',
        'Arconnect',
        Arconnect,
        'https://arconnect.io'
      )
    } else {
      await this.walletAddr()
    }
    if (this.state.addr) {
      this.setState({ arconnectInstalled: true })
    } else {
      this.triggerAppInstallAlert(
        'Install ArConnect to complete this step',
        'Arconnect',
        Arconnect,
        'https://arconnect.io'
      )
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
      window.arweaveWallet.connect('ACCESS_ADDRESS')
    } else {
      const addr =
        window.arweaveWallet && (await window.arweaveWallet.getActiveAddress())
      this.setState({ addr: addr })
      return addr
    }
  }
  onArVerifyClick = async () => {
    if (!this.state.arconnectInstalled) {
      this.triggerAppInstallAlert(
        'Install ArConnect to complete this step',
        'Arconnect',
        Arconnect,
        'https://arconnect.io'
      )
    } else {
      let v = await this.checkIfVerified()
      this.setState({ verification: v })
      let p = v.percentage
      if (p > 19) {
        this.setState({ verifiedTwenty: true })
        this.setState({ verifiedClass: 'success' })
      } else {
        this.setState({ verifiedTwenty: false })
        this.setState({ verifiedClass: 'default' })
        if (this.state.addr) {
          this.triggerGetVerifiedAlert()
        }
      }
      if (!v) {
        this.triggerAppInstallAlert(
          'Install ArVerify to complete this step',
          'ArVerify',
          Arverify,
          'https://arverify.org'
        )
      }
      if (this.state.verification.percentage === 'undefined') {
        //   this.triggerAppInstallAlert('Install ArVerify to complete this step', 'ArVerify', Arverify, 'https://arverify.org')
      }
      if (
        this.state.verification &&
        this.state.verification.percentage &&
        this.state.verification.percentage < 19
      ) {
        console.log('i should fire')
        this.triggerGetVerifiedAlert()
      }
      if (this.state.arconnectInstalled) {
        //await this.walletAddr()
        // this.checkIfVerified()
      } else {
        //this.triggerAppInstallAlert('Install ArVerify to complete this step', 'ArVerify', Arverify, 'https://arverify.org')
      }
      this.setState({ test: true })
    }
  }
  checkIfVerified = async () => {
    await this.walletAddr()
    const verification = await getVerification(this.state.addr)
    this.setState({ verification: verification })
    return verification
  }
  checkBalance = async () => {
    let balance = await arweave.wallets.getBalance(this.state.addr)
    let ar = arweave.ar.winstonToAr(balance)
    return ar
  }
  async componentDidMount () {
    window.addEventListener('arweaveWalletLoaded', () => {
      this.setState({ arconnectInstalled: true })
    })
    await this.checkIfVerified()
  }
  verificationStatus = () => {
    try {
      if (this.state.verification.percentage === null) {
        return 'Get verified'
      } else if (this.state.verification.percentage > 19) {
        return 'Check verification status'
      } else {
        let prettyPercent = Math.floor(this.state.verification.percentage)
        return `You are ${prettyPercent}% verified`
      }
    } catch {
      return 'Click to check verification status'
    }
  }
  onTwitterClick = async () => {
    // await this.walletAddr()
    // let balance = await this.checkBalance()
    // let verifyAddrTweet = `Verifying my @onlyarweave wallet address to get my Immortal Jellyfish NFT! ${this.state.addr}`
    // let shareArVerifyTweet = `👋 Arweave friends! Help prove that I'm a human and verify my address on ArVerify (getting my @onlyarweave Immortal Jellyfish NFT!): https://trust.arverify.org/verify/${this.state.addr}`
    // console.log(balance)
    // if (balance > 0.499) {
    //   tweetText = shareArVerifyTweet
    // } else {
    //   tweetText = verifyAddrTweet
    // }
    window.open(
      `https://twitter.com/intent/follow?screen_name=onlyarweave`,
      '_blank'
    )
    this.setState({ verifiedClassTwitter: 'success' })
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
  render () {
    return (
      <div className='cards-row d-flex'>
        <Container fluid className='mb-4'>
          <h1 className='mb-2 p-3 hero-title'>
            Get a limited edition NFT on Arweave.
          </h1>
          <Row className='mt-5 mx-md-3 trio'>
            <Col xs={12} md={4} className='mb-5 px-4'>
              <Card
                border='primary'
                className='h-100 align-items-center justify-content-between'
              >
                <div className='d-flex justify-content-center'>
                  <h2 className='step d-flex justify-content-center align-items-center'>
                    1
                  </h2>
                </div>
                <Card.Title className='card-title'>
                  <h3 className="mx-4">Get the ArConnect wallet browser extension.</h3>
                </Card.Title>
                <Card.Img
                  className='mb-3'
                  style={{ maxWidth: '33%' }}
                  alt='arconnect logo'
                  src={Arconnect}
                />
                <div className='p-3 w-100'>
                  {this.state.arconnectInstalled ? (
                    <Button
                      variant='success'
                      className='wv-card-button wv-card-button-success cta w-100'
                    >
                      <BsCheck /> ArConnect installed
                    </Button>
                  ) : (
                    <Button
                      onClick={() => this.onInstallArConnectClick()}
                      variant='default'
                      className='wv-card-button wv-card-button-alt cta w-100'
                    >
                      Install ArConnect
                    </Button>
                  )}
                  <Card.Text className='small p-2 card-footer-text'>
                    <p className='m-0'>This is where you'll keep your $AR tokens.</p>
                  </Card.Text>
                </div>
              </Card>
            </Col>

            <Col xs={12} md={4} className='mb-5 px-4'>
              <Card
                border='primary'
                className='h-100 align-items-center justify-content-between'
              >
                <div className='d-flex justify-content-center'>
                  <h2 className='step d-flex justify-content-center align-items-center'>
                    2
                  </h2>
                </div>
                <Card.Title className='card-title mt-sm-2'>
                  <h3 className="mx-4">Follow <b>@onlyarweave</b>, then
                  Tweet to get your 0.02 $AR
                  tokens (~ $2.34 USD value).</h3>
                </Card.Title>
                <Card.Img
                  alt='ardrive logo'
                  className='mb-3'
                  style={{ maxWidth: '28%' }}
                  src={Twitter}
                />
                <div className='p-3 w-100'>
                  <Button
                    variant={this.state.verifiedClassTwitter || 'default'}
                    onClick={() => this.onTwitterClick()}
                    className='wv-card-button wv-card-button-alt cta w-100'
                  >
                    {this.state.verifiedClassTwitter === 'success' && (
                      <BsCheck />
                    )}
                    Tweet to get tokens
                  </Button>
                  <Card.Text className='small p-2 card-footer-text'>
                    <p className='m-0'>We’ll verify that you’re a human. <a href='/'>Need more info?</a></p>
                  </Card.Text>
                </div>
              </Card>
            </Col>
            <Col xs={12} md={4} className='mb-5 px-4'>
              <Card
                border='primary'
                className='h-100 align-items-center justify-content-between'
              >
                <div className='d-flex justify-content-center'>
                  <h2 className='step d-flex justify-content-center align-items-center'>
                    3
                  </h2>
                </div>
                <Card.Title className='card-title'>
                  <h3 className="mx-4">Upload your very first permaphoto.</h3>
                </Card.Title>
                <Card.Img
                  alt='ardrive logo'
                  className='mb-3'
                  style={{ maxWidth: '75%' }}
                  src={Ardrive}
                />
                <div className='p-3 w-100'>
                  <Button
                    variant={this.state.verifiedClass || 'default'}
                    className='wv-card-button wv-card-button-alt cta w-100'
                    onClick={() => this.onArVerifyClick()}
                  >
                    {this.verificationStatus()}
                  </Button>
                  <Card.Text className='small p-2 card-footer-text'>
                    <p className='m-0'>Upload a photo for free</p>
                  </Card.Text>
                </div>
              </Card>
            </Col>
            <span className='mt-4 text-white ls-17'>need more details?</span>
            <span className='ls-17 mt-1'>
              <a className='white-link' href='/'>
                watch the video
              </a>
            </span>
          </Row>
        </Container>
      </div>
    )
  }
}
