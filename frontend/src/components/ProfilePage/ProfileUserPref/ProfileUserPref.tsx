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
import ProfileInfosUserEdit from "../ProfileInfos/ProfileInfosUserEdit/ProfileInfosUserEdit";
import ProfileInfosUser from "../ProfileInfos/ProfileInfosUser/ProfileInfosUser";

import HeartBorder from '../../../assets/Heart_Border.svg';
import eyeIcon from '../../../assets/eye.svg';
import starIcon from '../../../assets/Star.svg';
import { convertDate } from "../../../utils";


import '../ProfileInfos/ProfileInfos.css'

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


    function setGender(s: string) { props.setUser((u: User) => ({ ...u, gender: s })) }

    function setSexualPreferences(s: string) { props.setUser((u: User) => ({ ...u, sexualPreferences: s })) }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
            </div>
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
    editable: boolean,
    setEditInfos: (p: boolean | ((b: boolean) => boolean)) => void,
}

export default function ProfileUserPref(props: TProfileUserPref) {

    return (
        <div className="profileuserpref-informations" style={{ position: 'relative' }}>
            {
                props.editing ?
                    <>
                        <ProfileInfosUserEdit user={props.user} setUser={props.setUser} />
                        <ProfileUserPrefEdit {...props} />
                    </>
                    :
                    <>
                        <ProfileInfosUser user={props.user} isCurrentUser={false} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>

                            <div className="profileinfos-infos">
                                <img src={HeartBorder} style={{ height: '20px', width: '20px' }} />
                                <p className="profileinfos-name">{props.user && String(props.user.likes)}</p>
                            </div>

                            <div className="profileinfos-infos">
                                <img src={eyeIcon} className="profileinfos-infos-icon" />
                                <p className="profileinfos-name">{props.user && String(props.user.views)}</p>
                            </div>

                            <div className="profileinfos-infos">
                                <img src={starIcon} className="profileinfos-infos-icon" />
                                <p className="profileinfos-name">
                                    {props.user && String(props.user.fameRating)}
                                </p>
                            </div>

                            <div className="profileinfos-infos">
                                <div className="profileinfos-infos-icon-status" style={(true || props.user?.status) ? { backgroundColor: 'var(--green' } : {}} ></div>
                                <p
                                    className="profileinfos-name"
                                    style={{ textAlign: 'start', whiteSpace: 'pre-line' }}
                                >
                                    {`${(true || props.user?.status) ? "Online" : "Offline"}\n${true && props.user && !props.user.status && props.user.lastConnection ? convertDate(props.user.lastConnection) : ""}`}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <InfoLabel title="Gender" text={props.user && props.user.gender || "Not specified"} />
                            <InfoLabel title="Sexual Preferences" text={props.user && props.user.sexualPreferences || "Not specified"} />
                        </div>
                        <InfoLabelTags title="Interests Tags" tags={props.user && props.user.tags} />
                    </>
            }
            {
                props.editable &&
                <div className="profileuserpref-informations-editicon" >
                    <RoundIconBorder
                        icon={props.editing ? checkIcon : pencilIcon}
                        onClick={() => props.setEditInfos((p: boolean) => !p)}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>
            }
        </div>
    )
}
