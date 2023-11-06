import { ButtonWrapper } from "../../../../components/Buttons/ButtonWrapper";
import { TagsPick } from "../../../../components/Label/Tags/Tags";

import './InterestsTags.css'

import arrowRightIcon from '../../../../assets/Arrow_Right.svg'
import { useEffect, useRef, useState } from "react";
import { getTagsRequest } from "../../../../requests";
import { useOutsideComponent } from "../../../../hooks/useOutsideComponent";
import { AxiosResponse } from "axios";

type TInterestsTagsList = {
    tagsSelected: string[],
    addTag: (t: string) => void,
    removeTag: (t: string) => void,
    onClick: () => void
}

export default function InterestsTagsList(props: TInterestsTagsList) {

    const [tags, setTags] = useState([]);

    const tagsRef = useRef();

    useOutsideComponent(tagsRef, () => {
        props.onClick()
    })

    function handleSuccess(res: AxiosResponse) {
        if (res.data && res.data.tags) {
            setTags(res.data.tags);
        }
    }

    async function getTags() {
        await getTagsRequest()
            .then(res => handleSuccess(res))
            .catch(err => { })
    }

    useEffect(() => {
        getTags();
    }, [])

    function addTag(tag: string) {
        if (!props.tagsSelected.find((t: string) => t === tag))
            props.addTag(tag);
    }

    return (
        <div className="tagslist">
            <div className="tagslist-c" ref={tagsRef}>
                <h2 className="tagslist-title">Pick some tags</h2>
                <p className="tagslist-description">This tags will help us to determine the most pertinent partners !</p>
                <div className="tagslist-tags">
                    {
                        tags && tags.map(({ tagId, tag }) =>
                            <div key={tagId}>
                                <TagsPick
                                    tag={tag}
                                    selected={props.tagsSelected.find((t: string) => t === tag) ? true : false}
                                    addTag={() => addTag(tag)}
                                    removeTag={() => props.removeTag(tag)} />
                            </div>
                        )
                    }
                </div>
            </div>

            <ButtonWrapper onClick={props.onClick}>
                <h1 className='buttonlarge-title'>Valid</h1>
                <img src={arrowRightIcon} style={{ marginLeft: '15px' }} />
            </ButtonWrapper>
        </div>
    )
}
