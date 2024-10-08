import { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Alert, Snackbar } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Navbar from './Navbar.jsx';

import './App.css';

/*This checks the inputed barcode for the format described in the criteria.
The expected value in "regex" is found by defining the first two will be capitlized "/A-Z", 
then the next 8 characters are digits with the "/d". Then the last 2 will be the same as the first 2.
spliting the first two digits as they are not needed. Then calcualting the next 8 digits. */

export const validateS10Barcode = (input) => {
  const regex = /^[A-Z]{2}\d{8}\d[A-Z]{2}$/; // Matches the S10 format
  if (!regex.test(input)) return false;

  const digits = input.slice(2, 10).split('').map(Number);
  const weights = [8, 6, 4, 2, 3, 5, 9, 7];

  //weights are defined from left to right, then assigned left to right.

  const S = digits.reduce((acc, digit, index) => acc + digit * weights[index], 0);

  // calculations are found using the constant 11 and modding the value of S which is the sum of the weights * digits
  // C is checked to see if it is 10 or 11 if not it is not valid

  const C = 11 - (S % 11);

  const checkDigit = C === 10 ? 0 : C === 11 ? 5 : C;
  return checkDigit === Number(input[10]);
  // This could be done in another file and result can be called in
};

const App = () => {
  const [barcode, setBarcode] = useState('');
  const [message, setMessage] = useState('');
  const [storedBarcodes, setStoredBarcodes] = useState([]); //This part is important because it sets up a space to store the barcodes
  const [editIndex, setEditIndex] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // To track success state

  const handleScan = () => {
    if (!validateS10Barcode(barcode)) {
      setMessage('Invalid S10 barcode.');
      setIsSuccess(false); // Reset success state
      setOpenSnackbar(true);
      return;
    }

    if (storedBarcodes.includes(barcode) && editIndex === null) {
      setMessage('Duplicate barcode detected.');
      setIsSuccess(false); // Reset success state
      setOpenSnackbar(true);
    } else {
      if (editIndex !== null) {
        const updatedBarcodes = [...storedBarcodes];
        updatedBarcodes[editIndex] = barcode;
        setStoredBarcodes(updatedBarcodes);
        setEditIndex(null);
        setMessage('Barcode successfully updated!');
      } else {
        setStoredBarcodes([...storedBarcodes, barcode]); // storing the barcode, within the array
        setMessage('Barcode successfully stored!');
      }
      setBarcode('');
      setIsSuccess(true); // Set success state when the barcode is valid and stored
      setOpenSnackbar(true);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleScan(); // Trigger the scan action when Enter is pressed, allows scanner to be processed
    }
  };

  const handleEdit = (index) => {
    setBarcode(storedBarcodes[index]);
    setEditIndex(index);
    setMessage('Editing barcode...');
    setOpenSnackbar(true);
    setIsSuccess(false); // Reset success state during editing
  };

  const handleDelete = (index) => {
    const updatedBarcodes = storedBarcodes.filter((_, i) => i !== index);
    setStoredBarcodes(updatedBarcodes);
    setMessage('Barcode successfully deleted!');
    if (editIndex === index) setEditIndex(null);
    setOpenSnackbar(true);
    setIsSuccess(false); // Reset success state
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const isInvalidBarcode = !!message && message.includes('Invalid S10 barcode'); // Checks if the barcode is invalid

  return (
    <div className="App">
      <Navbar />
      <div className="Page_Content">
        <h1>S10 Barcode Validator</h1>

        <TextField
          label="Enter or Scan S10 Barcode"
          variant="outlined"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={handleKeyDown} /* Listen for 'Enter' key press */
          fullWidth
          margin="normal"
          error={isInvalidBarcode} // Only set error to true if the barcode is invalid
          helperText={isInvalidBarcode ? 'Invalid S10 format.' : ''} // Show error message only when invalid

          // Apply dynamic styles based on success state
          InputProps={{
            sx: {
              borderColor: isSuccess ? 'green' : '',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isSuccess ? 'green' : '', // Change border to green
              },
            },
          }}
        />

        <Button
          variant="contained"
          color={editIndex !== null ? 'warning' : 'primary'}
          onClick={handleScan}
          style={{ marginTop: '10px' }}
        >
          {editIndex !== null ? 'Update Barcode' : 'Scan Barcode'}
        </Button>

        {/* Snackbar for message display, just as extra UI*/}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={isSuccess ? 'success' : 'info'} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>

        <h2>Stored Barcodes:</h2>
        <List>
          {storedBarcodes.map((code, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                    <Delete />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={code} />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default App;
