import { useCallback } from "react"
import { updateUserRequest } from "../../../../requests"
import Biolabel from "../../../../components/Label/BioLabel/BioLabel"
import { User } from "../../../../types"

type TBioLabelEdit = {
    user: User
    profileUser: User,
    setProfileUser: (u: User | ((u: User) => User)) => void,
    editBio: boolean,
    setEditBio: (b: boolean | ((B: boolean) => boolean)) => void
}

export function BioLabelEdit({
    user,
    profileUser,
    setProfileUser,
    editBio,
    setEditBio
}: TBioLabelEdit) {

    function setBio(f: string | ((p: string) => string)) {
        if (f instanceof Function)
            setProfileUser((u: User) => ({ ...u, biography: f(u.biography) }))
        else
            setProfileUser((u: User) => ({ ...u, biography: f }))
    }

    const updateBiography = useCallback(async () => {
        setEditBio((b: boolean) => !b);
        if (profileUser.biography !== user.biography) {
            await updateUserRequest({ biography: profileUser.biography })
                .catch(err => { })
        }
    }, [profileUser]);

    return (
        <Biolabel
            title="Biography"
            value={profileUser && profileUser.biography}
            setValue={setBio}
            isCurrentUser={true}
            editing={editBio}
            editClick={updateBiography}
            maxLength={400}
        />
    )
}
