import './App.css';
import { useState } from 'react';
import { themeOptions } from './ThemeInfo';
import { BrowserRouter, Routes, Route, NavLink, useParams, Link } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import SearchAppBar from './AppBar';

import { HomePage } from './HomePage';
import { InfoPage } from './InfoPage';
import { ChapterPage } from './ChapterPage';

const theme = createTheme(themeOptions);

function App() {
  const [search, setSearch] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <BrowserRouter>
          <SearchAppBar search={search}/>

          <Routes>
              <Route path="/" element={<HomePage setSearch={setSearch}/>} />
              <Route path="/manga/:mangaId" element={<InfoPage setSearch={setSearch}/>} />
              <Route path="/chapter/:chapterId" element={<ChapterPage setSearch={setSearch}/>} />
          </Routes>
        </BrowserRouter>
      </div>
 
    </ThemeProvider>
    
  );
}

export default App;
