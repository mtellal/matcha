import { useEffect, useRef, useState } from "react";
import { useBrowserContext } from "../../../contexts/BrowserProvider";
import InputRangeText from "../../../components/Inputs/InputRangeText/InputRangeText";
import { getUserAge } from "../../../utils";
import { User } from "../../../types";

type Values = {
    value1: string,
    value2: string
}

type MenuFilterType = {
    ageRange: Values,
    locationRange: Values,
    fameRatingRange: Values,
    commonTagsRange: Values
}

export default function MenuFilter(props: { title: string }) {

    const { browseUsers, setFilterIds, filterConfigRef } = useBrowserContext();

    const [filters, setFilters] = useState({
        ageRange: { value1: '', value2: '' },
        locationRange: { value1: '', value2: '' },
        fameRatingRange: { value1: '', value2: '' },
        commonTagsRange: { value1: '', value2: '' }
    });

    const filterInitRef = useRef(false);

    useEffect(() => {
        if (filterConfigRef.current && !filterInitRef.current) {
            setFilters(filterConfigRef.current);
            filterInitRef.current = true;
        }
    }, [filterConfigRef.current, filterInitRef.current])

    function setAgeRange1(s: string) {
        setFilters((f: MenuFilterType) => {
            const up = { ...f, ageRange: { ...f.ageRange, value1: s } };
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setAgeRange2(s: string) {
        setFilters((f: MenuFilterType) => {
            const up = { ...f, ageRange: { ...f.ageRange, value2: s } }
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setLocationRange1(s: string) {
        setFilters((f: MenuFilterType) => {
            const up = { ...f, locationRange: { ...f.locationRange, value1: s } }
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setLocationRange2(s: string) {
        setFilters((f: MenuFilterType) => {
            const up = { ...f, locationRange: { ...f.locationRange, value2: s } }
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setFameRating1(s: string) {
        setFilters((f: MenuFilterType) => {
            const up = { ...f, fameRatingRange: { ...f.fameRatingRange, value1: s } }
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setFameRating2(s: string) {
        setFilters((f: MenuFilterType) => {
            const up = { ...f, fameRatingRange: { ...f.fameRatingRange, value2: s } }
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setCommonTagsRange1(s: string) {
        setFilters((f: MenuFilterType) => {
            const up = { ...f, commonTagsRange: { ...f.commonTagsRange, value1: s } }
            filterConfigRef.current = up;
            return (up)
        })
    }

    function setCommonTagsRange2(s: string) {
        setFilters((f: MenuFilterType) => {
            const up = { ...f, commonTagsRange: { ...f.commonTagsRange, value2: s } }
            filterConfigRef.current = up;
            return (up)
        })
    }


    useEffect(() => {
        let _filterIds = browseUsers.map((u: User) => {
            if (filters.ageRange.value1 && filters.ageRange.value2) {

                let v1 = parseInt(filters.ageRange.value1);
                let v2 = parseInt(filters.ageRange.value2);

                if (v1 > v2) {
                    v1 = v2;
                    v2 = parseInt(filters.ageRange.value1);
                }
                if ((getUserAge(u.age) < v1 || getUserAge(u.age) > v2))
                    return (u.userId)
            }
            if (filters.locationRange.value1 && filters.locationRange.value2) {
                let v1 = parseInt(filters.locationRange.value1);
                let v2 = parseInt(filters.locationRange.value2);

                if (v1 > v2) {
                    v1 = v2;
                    v2 = parseInt(filters.locationRange.value1);
                }
                if ((Number(u.distance) < v1 || Number(u.distance) > v2))
                    return (u.userId)
            }
            if (filters.fameRatingRange.value1 && filters.fameRatingRange.value2) {
                let v1 = parseInt(filters.fameRatingRange.value1);
                let v2 = parseInt(filters.fameRatingRange.value2);

                if (v1 > v2) {
                    v1 = v2;
                    v2 = parseInt(filters.fameRatingRange.value1);
                }
                if ((Number(u.fameRating) < v1 || Number(u.fameRating) > v2))
                    return (u.userId)
            }
            if (filters.commonTagsRange.value1 && filters.commonTagsRange.value2) {
                let v1 = parseInt(filters.commonTagsRange.value1);
                let v2 = parseInt(filters.commonTagsRange.value2);

                if (v1 > v2) {
                    v1 = v2;
                    v2 = parseInt(filters.commonTagsRange.value1);
                }
                if ((Number(u.commonTags) < v1 || Number(u.commonTags) > v2))
                    return (u.userId)
            }
            return (null)
        })
        _filterIds = _filterIds.filter((id: number) => id)
        setFilterIds(_filterIds)
    }, [filters.ageRange, filters.locationRange, filters.fameRatingRange, filters.commonTagsRange])

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', }}>
            <h1 className="menusort-title">{props.title}</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '250px' }}>
                <InputRangeText
                    id='filter-agerange'
                    label="Age range"
                    value1={filters.ageRange.value1}
                    value2={filters.ageRange.value2}
                    setValue1={setAgeRange1}
                    setValue2={setAgeRange2}
                    placeholder1="25"
                    placeholder2="35"
                    maxLength={2}
                />
                <InputRangeText
                    id='filter-distrange'
                    label="Distance range"
                    value1={filters.locationRange.value1}
                    value2={filters.locationRange.value2}
                    setValue1={setLocationRange1}
                    setValue2={setLocationRange2}
                    placeholder1="0"
                    placeholder2="100"
                    maxLength={3}
                />
                <InputRangeText
                    id='filter-ratingrange'
                    label="Fame Rating range"
                    value1={filters.fameRatingRange.value1}
                    value2={filters.fameRatingRange.value2}
                    setValue1={setFameRating1}
                    setValue2={setFameRating2}
                    placeholder1="0"
                    placeholder2="5"
                    maxLength={1}
                />
                <InputRangeText
                    id='filter-tagsrange'
                    label="Common Tags range"
                    value1={filters.commonTagsRange.value1}
                    value2={filters.commonTagsRange.value2}
                    setValue1={setCommonTagsRange1}
                    setValue2={setCommonTagsRange2}
                    placeholder1="2"
                    placeholder2="5"
                    maxLength={2}
                />
            </div>
        </div>
    )
}