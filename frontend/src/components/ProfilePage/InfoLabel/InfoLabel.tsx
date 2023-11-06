
import { useCurrentUser } from "../../../contexts/UserContext";
import { TagsRaw } from "../../Label/Tags/Tags"

import './InfoLabel.css'

export function InfoLabel(props: { title: string, text: string }) {
    return (
        <div className="infolabel">
            <h3 className="title-input" style={{ marginBottom: '5px' }}>{props.title}</h3>
            <p className="font-14">{props.text}</p>
        </div>
    )
}

type InfoLabelTagsProps = {
    seeCommonTags?: boolean,
    title: string,
    tags: string[],
}

export function InfoLabelTags(props: InfoLabelTagsProps) {

    const { currentUser } = useCurrentUser();

    function commonTags(tag: string) {
        if (props.seeCommonTags && currentUser && currentUser.tags) {
            return (currentUser.tags.find((t: string) => t === tag) ? true : false);
        }
        return (false);
    }

    return (
        <div className="infolabel">
            <h3 className="title-input" style={{ marginBottom: '5px' }}>{props.title}</h3>
            <div className="infolabel-tags">
                {
                    props.tags && props.tags.map((t: string) => <TagsRaw key={t} tag={t} selected={commonTags(t)} />)
                }
            </div>
        </div>
    )
}

