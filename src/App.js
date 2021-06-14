import Routes from './routes'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'
function App() {
  return (
    <div>
      <Routes/>
      <ToastContainer autoClose={5000}/>
    </div>
  );
}

export default App;
