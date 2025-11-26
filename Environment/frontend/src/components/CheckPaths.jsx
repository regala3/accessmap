import React from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import MenuNav from './MenuNav';
import Navbar from './Navbar';
import {useSearchParams} from "react-router-dom";

const CheckPaths = () => {
    const location = useLocation();

    const [searchParams] = useSearchParams();
    const isEmbedded = searchParams.get('embedded') === 'true';

    const previewMatch = matchPath('/event/:id/dashboard/preview', location.pathname);

    if(previewMatch && isEmbedded) {
        return null;
    }
    else {
        return <Navbar/>
    }
}

export default CheckPaths;