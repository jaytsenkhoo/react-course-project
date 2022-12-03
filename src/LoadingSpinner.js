import './App.css';
import { Bars } from 'react-loader-spinner'

export function LoadingSpinner() {
    return <div className='LoadingSpinner'>
        <Bars
            height="80"
            width="80"
            color="#f56900"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    </div>
}