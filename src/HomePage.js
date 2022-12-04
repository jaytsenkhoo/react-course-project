import './App.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from './LoadingSpinner';
import { ImageList, ImageListItem, ImageListItemBar, Pagination } from '@mui/material';

const baseUrl = 'https://api.mangadex.org';

export function HomePage(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [mangaListData, setMangaListData] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        props.setSearch(true);

        (async () => {
            setMangaListData([])
            // console.log(page)
            setIsLoading(true);
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga?limit=14&offset=${page * 14}&availableTranslatedLanguage%5B%5D=en&contentRating%5B%5D=safe&order%5BlatestUploadedChapter%5D=desc&includes%5B%5D=cover_art`,
            });
            setIsLoading(false);

            // console.log(resp.data);
            setMangaListData(resp.data.data)
            setTotalPage(Math.floor(resp.data.total / 14))
        })();
    }, [page])

    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };

    return (
        <div>
            {isLoading && <LoadingSpinner />}
            {mangaListData.length > 0 &&
                <div>
                    <div className='MangaList'>
                        <MangaList mangaListData={mangaListData} />

                    </div>
                    <div className='Pagination'>
                        <Pagination count={totalPage} defaultPage={page + 1} size="large" onChange={handlePageChange} />
                    </div>
                </div>
            }
        </div>
    )
}

function MangaList(props) {
    // console.log(props.mangaListData)

    let formattedDataList = []
    props.mangaListData.forEach(data => {
        let coverRelationShip = data.relationships.filter((relationship) => relationship.type === 'cover_art')[0]
        // console.log(coverRelationShip)
        let formattedData = {
            id: data.id,
            title: data.attributes.title.en !== undefined ? data.attributes.title.en : data.attributes.title.ja,
            cover: coverRelationShip.attributes.fileName
        }
        formattedDataList.push(formattedData)
    });

    return (
        <ImageList sx={{ width: '98%', height: 'auto' }} variant="quilted" gap={10} cols={7} rowHeight={370}>
            {formattedDataList.map((data) => (
                <Link to={`/manga/${data.id}`}>
                    <ImageListItem key={`https://uploads.mangadex.org/covers/${data.id}/${data.cover}`}>
                        <img
                            src={`https://uploads.mangadex.org/covers/${data.id}/${data.cover}`}
                            srcSet={`https://uploads.mangadex.org/covers/${data.id}/${data.cover}`}
                            alt={data.title}
                            loading="lazy"
                            style={{ cursor: 'pointer' }}
                        />
                        <ImageListItemBar title={data.title} />
                    </ImageListItem>
                </Link>
            ))}
        </ImageList>
    );
}