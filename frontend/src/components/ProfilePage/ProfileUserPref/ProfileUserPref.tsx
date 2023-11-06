import { useContext, useEffect } from "react";

import './ProfileUserPref.css'

import { InfoLabel, InfoLabelTags } from "../../../components/ProfilePage/InfoLabel/InfoLabel";
import pencilIcon from '../../../assets/Edit_Pencil.svg'
import checkIcon from '../../../assets/Check.svg'
import { RoundIconBorder } from "../../../components/Icons/RoundIconBorder";
import Tags from "../../../components/Label/Tags/Tags";
import PickMenuSmall from "../../Picker/PickMenuSmall/PickMenuSmall";
import { Icon } from "../../Icons/Icon";

import addIcon from '../../../assets/Add_Plus.svg'
import { TagsPickerPageContenxt } from "../../TagsPickerPage/TagsPickerPage";
import { User } from "../../../types";

type ProfileUserPrefEditProps = {
    user: User,
    setUser: (u: User | ((u: User) => User)) => void
}

function ProfileUserPrefEdit(props: ProfileUserPrefEditProps) {
    const {
        setTags,
        setShowTagsPage,
        addTagFunctionRef,
        removeTagFunctionRef,
        removeTag
    } = useContext(TagsPickerPageContenxt);

    useEffect(() => {
        if (props.user && props.user.tags && props.user.tags.length)
            setTags(props.user.tags)
    }, [props.user, setTags])

    useEffect(() => {
        if (addTagFunctionRef && !addTagFunctionRef.current) {
            addTagFunctionRef.current = (tags: string[]) => {
                props.setUser((u: User) => ({ ...u, tags }))
            }
        }
    }, [addTagFunctionRef])

    useEffect(() => {
        if (removeTagFunctionRef && !removeTagFunctionRef.current) {
            removeTagFunctionRef.current = (tags: string[]) => {
                props.setUser((u: User) => ({ ...u, tags }))
            }
        }
    }, [removeTagFunctionRef])


    function setGender(s: string) {
        props.setUser((u: User) => ({ ...u, gender: s }))
    }

    function setSexualPreferences(s: string) {
        props.setUser((u: User) => ({ ...u, sexualPreferences: s }))
    }

    return (
        <>
            <PickMenuSmall
                title="Gender"
                options={["male", "female"]}
                value={props.user.gender}
                setValue={setGender}
                style={{ maxWidth: '200px' }}
            />
            <PickMenuSmall
                title="Sexual Preferences"
                options={["male", "female"]}
                value={props.user.sexualPreferences}
                setValue={setSexualPreferences}
                style={{ maxWidth: '200px' }}
            />
            <div className='signuppage-intereststags'>
                <div className='signuppage-intereststags-title'>
                    <p className='title-input' style={{ margin: '0px', alignSelf: 'center' }}>Interests Tags</p>
                    <Icon icon={addIcon} style={{ height: '30px' }} onClick={() => setShowTagsPage((p: boolean) => !p)} />
                </div>

                {
                    props.user && props.user.tags.length > 0 &&
                    <div className='profileuserpref-tags'>
                        {
                            props.user.tags.map((t: string) =>
                                <Tags key={t} tag={t} onClick={() => removeTag(t, null)} />
                            )
                        }
                    </div>
                }
            </div>
        </>
    )
}

type TProfileUserPref = {
    user: User,
    setUser: (U: User | ((u: User) => User)) => void,
    editing: boolean,
    setEditInfos: (p: boolean | ((b: boolean) => boolean)) => void,
}

export default function ProfileUserPref(props: TProfileUserPref) {

    return (
        <div className="profileuserpref-informations" style={{ position: 'relative' }}>
            {
                props.editing ?

                    <ProfileUserPrefEdit {...props} />
                    :
                    <>
                        <InfoLabel title="Gender" text={props.user && props.user.gender || "Not specified"} />
                        <InfoLabel title="Sexual Preferences" text={props.user && props.user.sexualPreferences || "Not specified"} />
                        <InfoLabelTags title="Interests Tags" tags={props.user && props.user.tags} />
                    </>
            }
            <div className="profileuserpref-informations-editicon" >
                <RoundIconBorder
                    icon={props.editing ? checkIcon : pencilIcon}
                    onClick={() => props.setEditInfos((p: boolean) => !p)}
                    style={{ height: '100%', width: '100%' }}
                />
            </div>
        </div>
    )
}
