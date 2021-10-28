import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/header.jsx';
import Cards from './components/cards.jsx';
import NftBlock from './components/nft_block.jsx'

function App() {
  return (
    <div className="App">
        <Header/>
      <div className="blue-grad">
        <Cards/>
        <NftBlock/>
      </div>
    </div>
  );
}

export default App;
