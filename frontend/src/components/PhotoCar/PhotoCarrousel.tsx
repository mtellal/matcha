import React, { useCallback, useEffect, useState } from "react";

import './PhotoCarrousel.css'

import ArrowRightIcon from '../../assets/Arrow_Right.svg'

import AddIcon from '../../assets/Add_Plus.svg'
import CrossIcon from '../../assets/cross-svgrepo-com.svg'
import { Icon } from "../Icons/Icon";
import { UserPhoto } from "../../types";


function PhotoContainer({ photos, setPhotos, index, extractURL, deletePhoto }: any) {

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            try {
                let url = window.URL.createObjectURL(e.target.files[0]);
                const photoIndexs = photos.map((p: UserPhoto) => p.index);
                if (photoIndexs.includes(index)) {
                    setPhotos((t: UserPhoto[]) =>
                        t.map((p: UserPhoto) => p.index === index ?
                            { url, index: index, file: e.target.files[0] } : p));
                }
                else {
                    setPhotos([...photos, { url, index: index, file: e.target.files[0] }]);
                }
            }
            catch (e) { }
        }
    }, [photos])

    return (
        <div className="photocar-c1-c">
            <div className="photocar-c1" style={{ position: 'relative' }}>
                {
                    photos && photos[index] && photos[index].url ?
                        <img className="photocar-image" src={extractURL(index)} />
                        :
                        <div className="photocar-noimage"></div>
                }
                <div
                    style={{
                        position: 'absolute', height: '100%', width: '100%',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    {
                        photos && photos[index] && photos[index].url &&
                        <Icon
                            icon={CrossIcon}
                            style={{ width: '40px', height: '40px' }}
                            onClick={() => deletePhoto(index)}
                        />
                    }
                    <label htmlFor="file" >
                        <Icon
                            icon={AddIcon}
                            style={{ width: '40px', height: '40px' }}
                        />
                    </label>

                    <input
                        key={`${photos && photos[index] && photos[index].url}`}
                        id="file"
                        type="file"
                        style={{ visibility: 'hidden', position: 'absolute', left: '50%', top: '50%' }}
                        onChange={onChange}
                    />

                </div>

            </div>

        </div>
    )
}


export default function PhotoCarrousel({ currentUser, photos, setPhotos }: any) {


    const [index, setIndex] = useState(1);

    const extractURL = (id: number) => {
        if (photos) {
            const photoObj = photos.find((p: UserPhoto) => p.index === id)
            if (photoObj) return (photoObj.url)
            return (null)
        }
    }

    const deletePhoto = useCallback((id: number) => {
        if (photos && setPhotos) {
            const photoObj = photos.map((p: UserPhoto) => {
                if (p.index === id) {
                    return { index: p.index, url: "" }
                }
                return p
            })
            setPhotos(photoObj)
        }
    }, [setPhotos, photos])

    return (
        <div className="photocar" >

            <div className="photocar-c2">
                {
                    photos && photos.length >= 2 && index - 1 >= 0 &&
                    photos[index - 1] &&
                    <>
                        {
                            photos[index - 1].url ?
                                < img className="photocar-image" src={extractURL(index - 1)} />
                                :
                                <div className="photocar-noimage"></div>
                        }
                        <div className="photocar-shadow-left">
                            <Icon
                                icon={ArrowRightIcon}
                                style={{ height: '30px', padding: '2px', transform: 'rotate(180deg)' }}
                                onClick={() => setIndex((i: number) => i > 0 ? i - 1 : i)}
                            />
                        </div>
                    </>
                }
            </div>

            {
                currentUser && photos ?
                    <PhotoContainer
                        key={index}
                        photos={photos}
                        setPhotos={setPhotos}
                        index={index}
                        extractURL={extractURL}
                        deletePhoto={deletePhoto}
                    />
                    :
                    <div className="photocar-c1-c">
                        <div className="photocar-c1">
                            < img className="photocar-image" src={extractURL(index)} />
                        </div>
                    </div>
            }


            <div className="photocar-c2">
                {
                    photos && photos.length >= index + 1 &&
                    photos[index + 1] &&
                    <>
                        {
                            photos[index + 1].url ?
                                < img className="photocar-image" src={extractURL(index + 1)} /> :
                                <div className="photocar-noimage"></div>
                        }
                        <div className="photocar-shadow-right">
                            <Icon
                                icon={ArrowRightIcon}
                                style={{ height: '30px', padding: '2px' }}
                                onClick={() => setIndex((i: number) => i < photos.length ? i + 1 : i)}
                            />
                        </div>

                    </>
                }
            </div>
        </div>
    )
}
