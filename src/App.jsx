import Sidebar from './Sidebar';
import TimeZoneSelector from './TimeZoneSelector';
import DateTimeDisplay from './DateTimeDisplay';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TimeZoneSelector />
        <DateTimeDisplay />
        <h1>Vite + React</h1>
      </div>
    </div>
  );
}

export default App;
