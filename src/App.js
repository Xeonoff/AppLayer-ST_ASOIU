import { Row } from "react-bootstrap";
import './App.css';
import Navbar from './components/Navbar/Navbar';
import {WebSocketProvider} from './hooks/WebSocketContext';
import СhatPage from './pages/СhatPage';

function App() {
  return (
    <div style={{ position: 'relative' }}>
      <WebSocketProvider>
          <Navbar id="Nav"/>
            <Row id="UnderNav">
              <СhatPage/>
            </Row>
      </WebSocketProvider>
    </div>
  );
}

export default App;
