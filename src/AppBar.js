import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Autocomplete, TextField } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseUrl = 'https://api.mangadex.org';

export default function SearchAppBar(props) {
    const [mangaListData, setMangaListData] = useState([]);

    let navigate = useNavigate();

    const onSearchChange = (e) => {
        (async () => {
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga`,
                params: {
                    title: e.target.value
                }
            });
        
            console.log(resp.data.data);
            setMangaListData(resp.data.data)
        })();
    }

    const onSelectSearch = (value) => {
        let mangaData = mangaListData.filter((manga) => manga.attributes.title.en === value)[0]
        setMangaListData([])
        navigate("/manga/" + mangaData.id)
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Link to={`/`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        <BookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    </Link>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        <Link to={`/`} style={{ color: 'inherit', textDecoration: 'inherit' }}>Manga Reader</Link>

                    </Typography>

                    {props.search &&
                        <Autocomplete
                            style={{ width: '400px' }}
                            id="free-solo-demo"
                            freeSolo
                            options={mangaListData.map((manga) => manga.attributes.title.en)}
                            onChange={(e, value) => onSelectSearch(value)}
                            renderInput={(params) =><TextField {...params} label="Search" size='small' onChange={onSearchChange}/>}
                        />
                    }

                </Toolbar>
            </AppBar>
        </Box>
    );
}