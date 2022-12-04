import './App.css';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner} from './LoadingSpinner';
import { Container, Card, CardMedia, CardContent, Typography, Box, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';

const baseUrl = 'https://api.mangadex.org';

export function InfoPage(props) {
    let mangaId = useParams().mangaId;

    const [isLoading, setIsLoading] = useState(false);
    const [isChapterLoading, setIsChapterLoading] = useState(false);
    const [mangaData, setMangaData] = useState(null);
    const [chapterList, setChapterList] = useState([]);

    useEffect(() => {
        props.setSearch(false);

        (async () => {
            setIsLoading(true);
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga/${mangaId}?includes%5B%5D=cover_art`,
            });
            setIsLoading(false);

            // console.log(resp.data);

            let resData = resp.data.data
            let coverRelationShip = resData.relationships.filter((relationship) => relationship.type === 'cover_art')[0]
            resData.cover = coverRelationShip.attributes.fileName

            let title = resData.attributes.title.en !== undefined ? resData.attributes.title.en : resData.attributes.title.ja
            resData.title = title

            setMangaData(resData)
        })();

        (async () => {
            setIsChapterLoading(true);
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga/${mangaId}/feed?limit=500&translatedLanguage%5B%5D=en&contentRating%5B%5D=safe&includeFutureUpdates=1&order%5BcreatedAt%5D=desc&order%5BupdatedAt%5D=desc&order%5BpublishAt%5D=desc&order%5BreadableAt%5D=desc&order%5Bvolume%5D=asc&order%5Bchapter%5D=asc`,
            });
            setIsChapterLoading(false);

            // console.log(resp.data);

            setChapterList(resp.data.data)
        })();
    }, [])

    return (
        <div>
            {(isLoading || isChapterLoading) && <LoadingSpinner />}
            {(mangaData !== null && chapterList.length > 0) &&
                <Container>
                    <MangaDataDisplay mangaData={mangaData} />
                    <Typography gutterBottom variant="h4" component="div">Chapters</Typography>
                    <ChapterList chapterList={chapterList} />
                </Container>
            }
        </div>
    )
}

function MangaDataDisplay(props) {
    return (
        <Card sx={{ display: 'flex', marginTop: '10px', marginBottom: '20px' }}>
            <CardMedia
                component="img"
                sx={{ width: 300 }}
                // height="auto"
                image={`https://uploads.mangadex.org/covers/${props.mangaData.id}/${props.mangaData.cover}`}
                alt={props.mangaData.title}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography gutterBottom variant="h3" component="div">
                        {props.mangaData.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.mangaData.attributes.description.en}
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    )
}

function ChapterList(props) {
    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <nav aria-label="secondary mailbox folders">
                <List>
                    {props.chapterList.map((chapter) => {
                        return <div>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to={`/chapter/${chapter.id}`}>
                                    <ListItemText primary={`Ch. ${chapter.attributes.chapter} ${chapter.attributes.title ? '- ' + chapter.attributes.title : ''}`} />
                                    <ListItemText primary={new Date(chapter.attributes.publishAt).toLocaleDateString()} style={{ textAlign: 'right' }} />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </div>
                    })}
                </List>
            </nav>
        </Box>
    )
}
