import { useEffect } from "react";


export function useOutsideComponent(ref: React.RefObject<any>, f: (e: any) => void, depedencies: any[] = []) {
    useEffect(() => {
        if (ref.current && f) {

            const clickedOutside = (e: MouseEvent) => {
                if (ref && ref.current && !ref.current.contains(e.target as Node)) {
                    if (f)
                        f(e);
                }
            };

            window.addEventListener('mousedown', clickedOutside)
            return () => { window.removeEventListener('mousedown', clickedOutside) }
        }
    }, [ref.current, f, ...depedencies])
}