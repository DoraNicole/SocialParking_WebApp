import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import AddEvent from './components/AddEvent/AddEvent.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
        <AddEvent/>
      </header>
    </div>
  );
}

export default App;
