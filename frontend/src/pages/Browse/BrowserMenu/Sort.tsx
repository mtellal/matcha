import { useEffect, useRef, useState } from "react";
import PickMenuSmall from "../../../components/Picker/PickMenuSmall/PickMenuSmall";
import { useBrowserContext } from "../../../contexts/BrowserProvider";
import { getUserAge } from "../../../utils";
import { User } from "../../../types";

type MenuSortProps = {
    title: string
}

type Sort = {
    age: string, 
    location: string, 
    fameRating: string, 
    commonTags: string
}

export default function MenuSort(props: MenuSortProps) {

    const { browseUsers, browseDispatch, sortConfigRef }  = useBrowserContext();

    const [sorts, setSorts] = useState<Sort>({
        age: 'none',
        location: 'none',
        fameRating: 'none',
        commonTags: 'none'
    });

    const sortConfigInitRef = useRef(false);

    useEffect(() => {
        if (sortConfigRef.current && !sortConfigInitRef.current) {
            setSorts(sortConfigRef.current);
            sortConfigInitRef.current = true;
        }
    }, [sortConfigInitRef.current, sortConfigInitRef.current])

    function setAge(s: string) {
        setSorts((f: Sort) => {
            const up = { ...f, age: s }
            sortConfigRef.current = up;
            return (up)
        })
    }

    function setLocation(s: string) {
        setSorts((f: Sort) => {
            const up = { ...f, location: s }
            sortConfigRef.current = up;
            return (up)
        })
    }

    function setFameRating(s: string) {
        setSorts((f: Sort) => {
            const up = { ...f, fameRating: s }
            sortConfigRef.current = up;
            return (up)
        })
    }

    function setCommonTags(s: string) {
        setSorts((f: Sort) => {
            const up = { ...f, commonTags: s }
            sortConfigRef.current = up;
            return (up)
        })
    }


    useEffect(() => {
        let weights = 0;
        for (let values of Object.values(sorts)) {
            if (values !== "none")
                weights++;
        }

        let users = [...browseUsers];
        users = users.sort((u1: User, u2: User) => {

            let scoreAge = 0;
            let scoreDistance = 0;
            let scoreFame = 0;
            let scoreCommonTags = 0;

            if (sorts.age !== "none") {

                const maxAge = Math.max(...browseUsers.map((u: User) => getUserAge(u.age)));
                let scoreAgeU1 = (1 / weights) * (getUserAge(u1.age) / maxAge);
                let scoreAgeU2 = (1 / weights) * (getUserAge(u2.age) / maxAge);

                if (sorts.age === "older") {
                    scoreAge = scoreAgeU2 - scoreAgeU1;
                }
                else
                    scoreAge = scoreAgeU1 - scoreAgeU2;
            }

            if (sorts.location !== "none") {

                const maxDistance = Math.max(...browseUsers.map((u: User) => Number(u.distance)));
                let scoreDistanceU1 = (1 / weights) * (Number(u1.distance) / maxDistance);
                let scoreDistanceU2 = (1 / weights) * (Number(u2.distance) / maxDistance);


                if (sorts.location === "furthest") {
                    scoreDistance = scoreDistanceU2 - scoreDistanceU1;
                }
                else
                    scoreDistance = scoreDistanceU1 - scoreDistanceU2;
            }

            if (sorts.fameRating !== "none") {

                const maxFameRating = Math.max(...browseUsers.map((u: User) => Number(u.fameRating)));
                let scoreFameU1 = (1 / weights) * (Number(u1.fameRating) / maxFameRating);
                let scoreFameU2 = (1 / weights) * (Number(u2.fameRating) / maxFameRating);


                if (sorts.fameRating === "higher") {
                    scoreFame = scoreFameU2 - scoreFameU1;
                }
                else
                    scoreFame = scoreFameU1 - scoreFameU2;
            }

            if (sorts.commonTags !== "none") {

                const maxCommonTags = Math.max(...browseUsers.map((u: User) => Number(u.commonTags)));
                let scoreCommonTagsU1 = (1 / weights) * (Number(u1.commonTags) / maxCommonTags);
                let scoreCommonTagsU2 = (1 / weights) * (Number(u2.commonTags) / maxCommonTags);

                if (sorts.commonTags === "higher") {
                    scoreCommonTags = scoreCommonTagsU2 - scoreCommonTagsU1;
                }
                else
                    scoreCommonTags = scoreCommonTagsU1 - scoreCommonTagsU2;
            }

            return (scoreAge + scoreDistance + scoreFame + scoreCommonTags)
        })
        browseDispatch({ type: 'browseUsers', browseUsers: users })
    }, [sorts])

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', }}>
            <h1 className="menusort-title">{props.title}</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '250px' }}>
                <PickMenuSmall
                    title="Age"
                    options={["younger", "older"]}
                    value={sorts && sorts.age}
                    setValue={setAge}
                    outside={true}
                />
                <PickMenuSmall
                    title="Localisation"
                    options={["nearer", "furthest"]}
                    value={sorts && sorts.location}
                    setValue={setLocation}
                    outside={true}
                />
                <PickMenuSmall
                    title="Fame Rating"
                    options={["higher", "lower"]}
                    value={sorts && sorts.fameRating}
                    setValue={setFameRating}
                    outside={true}
                />
                <PickMenuSmall
                    title="Interests Tags"
                    options={["higher", "lower"]}
                    value={sorts && sorts.commonTags}
                    setValue={setCommonTags}
                    displayUp={true}
                    outside={true}
                />
            </div>
        </div>
    )
}