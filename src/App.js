import './App.css';
import { themeOptions } from './ThemeInfo';
import { BrowserRouter, Routes, Route, NavLink, useParams, Link } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import SearchAppBar from './AppBar';

import { HomePage } from './HomePage';

const theme = createTheme(themeOptions);




function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <BrowserRouter>
          <SearchAppBar search={true}/>

          <Routes>
              <Route path="/" element={<HomePage/>} />
          </Routes>
        </BrowserRouter>
      </div>
 
    </ThemeProvider>
    
  );
}

export default App;
