import { useEffect, useState } from "react";

export default function useWindowDimensions()
{
    const [height, setHeight] = useState(window.innerHeight);
    const [width, setWidth] = useState(window.innerWidth);
    
    function resize(e: any) {
        setHeight(e.currentTarget.innerHeight);
        setWidth(e.currentTarget.innerWidth);
    }

    useEffect(() => {
        window.addEventListener("resize", resize)
    })

    return ({
        height, 
        width
    })
}