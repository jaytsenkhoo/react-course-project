import './App.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from './LoadingSpinner';

const baseUrl = 'https://api.mangadex.org';
export function ChapterPage(props) {
    let chapterId = useParams().chapterId;

    const [isLoading, setIsLoading] = useState(false);
    const [chapterList, setChapterList] = useState([]);
    const [hash, setHash] = useState(null);
    const [page, setPage] = useState(0);

    useEffect(() => {
        props.setSearch(false);

        (async () => {
            setIsLoading(true);
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/at-home/server/${chapterId}?forcePort443=false`,
            });
            setIsLoading(false);

            console.log(resp.data);
            setChapterList(resp.data.chapter.dataSaver)
            setHash(resp.data.chapter.hash)
        })();
    }, [])

    const handleClick = (e) => {
        const clickTarget = e.target;
        const clickTargetWidth = clickTarget.offsetWidth;
        const xCoordInClickTarget = e.clientX - clickTarget.getBoundingClientRect().left;
        if (clickTargetWidth / 2 > xCoordInClickTarget) {
            if (page !== 0) {
                setPage((prevPage) => prevPage - 1)
            }
        } else {
            if (chapterList.length > page + 1) {
                setPage((prevPage) => prevPage + 1)
            }
        }
        console.log(page)
    }

    return (
        <div>
            {isLoading && <LoadingSpinner />}
            {chapterList.length > 0 &&
                <div onClick={(e) => handleClick(e)} style={{ cursor: 'pointer' }} className='MangaList'>
                    <img
                        src={`https://uploads.mangadex.org/data-saver/${hash}/${chapterList[page]}`}
                        srcSet={`https://uploads.mangadex.org/data-saver/${hash}/${chapterList[page]}`}
                        alt={chapterList[0]}
                        loading="lazy"
                    />
                </div>
            }
        </div>
    )
}

