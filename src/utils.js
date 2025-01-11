import React from 'react';
import ReactLoading from 'react-loading';
import { useLoading } from "./Loader";
import "./Loader.css"
 
const Loading = () => {
    const { isLoad } = useLoading();
    if (!isLoad) return null;
    return (
        <div className="loader-overlay">
            <ReactLoading type="spinningBubbles" color="green" height={100} width={150} />
        </div>
    );
};
 
export default Loading;