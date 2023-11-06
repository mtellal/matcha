import { MutableRefObject, useContext, useEffect, useRef, useState } from "react";
import InputRange from "../../../components/Inputs/InputRange/InputRange";
import Tags from "../../../components/Label/Tags/Tags";

import addIcon from '../../../assets/Add_Plus.svg'

import { Icon } from "../../../components/Icons/Icon";
import { TagsPickerPageContenxt } from "../../../components/TagsPickerPage/TagsPickerPage";
import { useBrowserContext } from "../../../contexts/BrowserProvider";
import { InputCitiesReco } from "../../../components/Inputs/InputCitiesReco/InputCitiesReco";
import { AdvancedOptions, City, User } from "../../../types";


type MenuFilterSearchProps = {
    user: User, 
    title: string
}

export default function MenuFilterSearch(props: MenuFilterSearchProps) {

    const {
        setShowTagsPage,
        tags,
        setTags,
        removeTag,
        validTagsFunctionRef,
        addTagFunctionRef,
        removeTagFunctionRef
    } = useContext(TagsPickerPageContenxt);

    const { loadUsersAdvanced, searchConfigRef } = useBrowserContext()

    const [searchOptions, setSearchOptions] = useState<AdvancedOptions>({
        ageGap: 30,
        fameRatingGap: 5,
        city: null,
        tags: []
    })

    const intervalRef = useRef(null);


    useEffect(() => {
        if (!addTagFunctionRef.current) {
            addTagFunctionRef.current = setLocalTags;
        }
    }, [addTagFunctionRef.current])

    useEffect(() => {
        if (!removeTagFunctionRef.current) {
            removeTagFunctionRef.current = setLocalTags
        }
    }, [removeTagFunctionRef.current])

    function setAgeGap(value: number) {
        setSearchOptions((s: AdvancedOptions) => {
            const up = { ...s, ageGap: value }
            searchConfigRef.current = up;
            handleRequest(intervalRef, up);
            return (up)
        })
    }

    function setFameRatingGap(value: number) {
        setSearchOptions((s: AdvancedOptions) => {
            const up = { ...s, fameRatingGap: value }
            searchConfigRef.current = up;
            handleRequest(intervalRef, up);
            return (up)
        })

    }

    function setCity(c: City) {
        setSearchOptions((s: AdvancedOptions) => {
            const up = { ...s, city: c }
            searchConfigRef.current = up;
            handleRequest(intervalRef, up);
            return (up)
        })
    }

    function setLocalTags(t: string[]) {
        const up = { ...searchOptions, tags: t }
        searchConfigRef.current = up;
        handleRequest(intervalRef, up);
        setSearchOptions(up)
    }

    useEffect(() => {
        if (props.user) {
            if (props.user.city && (!searchOptions || !searchOptions.city)) {
                setSearchOptions((s: AdvancedOptions) => {
                    const up = { ...s, city: props.user.city }
                    return (up)
                })
            }
        }

        if (searchConfigRef) {
            if (searchConfigRef.current) {
                setSearchOptions(searchConfigRef.current)
                if (searchConfigRef.current.tags)
                    setTags(searchConfigRef.current.tags)
            }
        }
    }, [searchConfigRef, props.user])

    useEffect(() => {
        if (!validTagsFunctionRef.current)
            validTagsFunctionRef.current = setLocalTags;
    }, [validTagsFunctionRef.current])

    const handleRequest = (intervalRef: MutableRefObject<any>, searchOptions: AdvancedOptions) => {
        if (intervalRef.current)
            clearInterval(intervalRef.current)
        intervalRef.current = setTimeout(() => {
            let opts: AdvancedOptions = {
                ageGap: searchOptions.ageGap,
                fameRatingGap: searchOptions.fameRatingGap,
                tags: searchOptions.tags
            }
            if (searchOptions.city)
                opts = { ...opts, city: searchOptions.city }
            loadUsersAdvanced(opts)
        }, 1000);
    }

    return (
        <div style={{ width: '100%', maxWidth: '250px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h1 className="menusort-title">{props.title}</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                <InputRange
                    id="filtersearch-agegap"
                    title="Age gap"
                    min={1}
                    max={30}
                    value={searchOptions && String(searchOptions.ageGap)}
                    setValue={setAgeGap}
                />
                <InputRange
                    id="filtersearch-scoregap"
                    title="Score gap"
                    min={0.1}
                    max={5.0}
                    step={0.1}
                    value={searchOptions && String(searchOptions.fameRatingGap)}
                    setValue={setFameRatingGap}
                />

                <InputCitiesReco
                    city={props.user && props.user.city && props.user.city.name}
                    setCity={setCity}
                />

                <div className='signuppage-intereststags'>
                    <div className='signuppage-intereststags-title'>
                        <p className='title-input' style={{ margin: '0px', alignSelf: 'center' }}>Interests Tags</p>
                        <Icon icon={addIcon} style={{ height: '30px' }} onClick={() => setShowTagsPage((p: boolean) => !p)} />
                    </div>

                    {
                        tags && tags.length > 0 &&
                        <div className='signuppage-tags'>
                            {
                                tags.map((t: string) =>
                                    <Tags key={t} tag={t} onClick={() => { removeTag(t, setLocalTags) }} />
                                )
                            }
                        </div>
                    }
                </div>

            </div>

        </div>
    )
}
