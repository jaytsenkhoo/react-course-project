import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LoadingSpinner } from './LoadingSpinner';
import { ImageList, ImageListItem, ImageListItemBar, Pagination } from '@mui/material';

const baseUrl = 'https://api.mangadex.org';

export function HomePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [mangaListData, setMangaListData] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        (async () => {
            setMangaListData([])
            console.log(page)
            setIsLoading(true);
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga?limit=14&offset=${page * 14}&availableTranslatedLanguage%5B%5D=en&contentRating%5B%5D=safe&order%5BlatestUploadedChapter%5D=desc&includes%5B%5D=cover_art`,
            });
            setIsLoading(false);

            console.log(resp.data);
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
                        <Pagination count={totalPage} defaultPage={page+1} size="large" onChange={handlePageChange}/>
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
            title: data.attributes.title.en,
            cover: coverRelationShip.attributes.fileName
        }
        formattedDataList.push(formattedData)
    });

    return (
        <ImageList sx={{ width: '99%', height: 'auto' }} variant="quilted" gap={10} cols={7} rowHeight={370}>
            {formattedDataList.map((data) => (
                <ImageListItem key={`https://uploads.mangadex.org/covers/${data.id}/${data.cover}`}>
                    <img
                        src={`https://uploads.mangadex.org/covers/${data.id}/${data.cover}?w=164&h=164&fit=crop&auto=format&safe_search=1`}
                        srcSet={`https://uploads.mangadex.org/covers/${data.id}/${data.cover}?w=164&h=164&fit=crop&auto=format&safe_search=1&dpr=2 2x`}
                        alt={data.title}
                        loading="lazy"
                        onClick={() => { }}
                    />
                    <ImageListItemBar title={data.title} />
                </ImageListItem>
            ))}
        </ImageList>
    );
}