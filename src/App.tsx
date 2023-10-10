import { ToastContainer, toast } from 'react-toastify';
import Typeahead from './components/Typeahead';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button } from '@mui/material';
import { useState } from 'react';

function App() {
  const [selected, setSelected] = useState<string[]>([]);
  const handleSelect = (selected: string[]) => {
    setSelected(selected);
  }
  const onSubmit = () => {
    toast(`States selected: ${selected.join(', ')}`, { type: "success" });
  }

  return (
    <div className="App">
      <ToastContainer />
      <Box sx={{ width: '100%', height: '100%' }}>
        <Box sx={{ width: '600px', height: '400px', margin: '300px auto 0', display: 'flex', flexDirection: 'column' }}>
          <Typeahead onSelect={handleSelect} />
          <Button disabled={selected.length === 0} onClick={onSubmit} sx={{ width: 150, mt: 3, ml: 'auto' }} variant="contained" color="primary">Submit</Button>
        </Box>
      </Box>
    </div>
  );
}

export default App;
