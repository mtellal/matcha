import React, { useCallback } from "react";

import './PickPhotos.css'
import { Icon } from "../Icons/Icon";
import addIcon from '../../assets/Add_Plus.svg'
import checkIcon from '../../assets/Check.svg'
import { RoundIconBorder } from "../Icons/RoundIconBorder";
import { UserPhoto } from "../../types";

type PhotoLabelProps = {
    id: number,
    photos: UserPhoto[],
    setPhotos: (p: UserPhoto[] | ((p: UserPhoto[]) => UserPhoto[])) => void
    pp?: boolean,
}

function PhotoLabel(props: PhotoLabelProps) {

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            try {
                let url = window.URL.createObjectURL(e.target.files[0]);
                const photoIndexs = props.photos.map((p: UserPhoto) => p.index);
                if (photoIndexs.includes(props.id)) {
                    props.setPhotos((t: UserPhoto[]) =>
                        t.map((p: UserPhoto) => p.index === props.id ?
                            { url, index: props.id, file: e.target.files[0] } : p));
                }
                else {
                    props.setPhotos([...props.photos, { url, index: props.id, file: e.target.files[0] }]);
                }
            }
            catch (e) { }
        }
    }


    const extractURL = useCallback((id: number) => {
        if (props.photos) {
            const photoObj = props.photos.find((p: UserPhoto) => p.index === id)
            if (photoObj)
                return (photoObj.url)
            return (null)
        }
    }, [props.photos])

    return (
        <div
            className="pickphotos-photo"
            style={props.pp ? { borderColor: '#FFB2D7' } : {}}>
            {
                props.photos.length > 0 &&
                props.photos.find((p: UserPhoto) => Number(p.index) === Number(props.id)) &&
                < img
                    src={extractURL(props.id)}
                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                />
            }
            <label htmlFor={props.id.toString()} style={{ position: 'absolute', }}>
                <Icon
                    icon={addIcon}
                    style={{ width: '40px', height: '40px' }}
                />
            </label>
            <input
                id={props.id.toString()}
                type="file"
                style={{ visibility: 'hidden', position: 'absolute', left: '50%', top: '50%' }}
                onChange={onChange}
            />
        </div>
    )
}


type TPickPhotos = {
    title: string,
    photos: UserPhoto[],
    setPhotos: (p: UserPhoto[] | ((u: UserPhoto[]) => UserPhoto[])) => void
    style?: {},
    editing?: boolean,
    editClick?: () => void
}

export default function PickPhotos(props: TPickPhotos) {
    return (
        <div className="pickphotos" style={props.style}>
            <p className="title-input">{props.title}</p>
            <div className="pickphotos-c" >

                <PhotoLabel id={0} pp={true} photos={props.photos} setPhotos={props.setPhotos} />
                <PhotoLabel id={1} photos={props.photos} setPhotos={props.setPhotos} />
                <PhotoLabel id={2} photos={props.photos} setPhotos={props.setPhotos} />
                <PhotoLabel id={3} photos={props.photos} setPhotos={props.setPhotos} />
                <PhotoLabel id={4} photos={props.photos} setPhotos={props.setPhotos} />
                {
                    props.editing &&
                    <div className="pickphotos-editicon" >
                        <RoundIconBorder
                            icon={checkIcon}
                            onClick={props.editClick}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>

                }
            </div>
        </div>
    )
}