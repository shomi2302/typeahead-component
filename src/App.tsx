import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StateSelect from './features/StateSelect';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <StateSelect />
    </div>
  );
}

export default App;
