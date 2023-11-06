import { ReactNode, Ref, createContext, useCallback, useContext, useRef, useState } from "react"
import InterestsTagsList from "../../pages/Signup/SignupInfos/InterestsTags/IntrestsTags";


export type TTagsPickerPageContenxt = {
    tags?: string[],
    setTags?: (t: string[]) => void,
    showTagsPage?: boolean,
    setShowTagsPage?: (b: boolean | ((B: boolean) => boolean)) => void,
    removeTag?: (p: string, p2?: (s: any) => void) => void,
    addTag?: (t: string) => void,
    validTagsFunctionRef?: React.MutableRefObject<any>,
    addTagFunctionRef?: React.MutableRefObject<any>,
    removeTagFunctionRef?: React.MutableRefObject<any>
}

export const TagsPickerPageContenxt: React.Context<TTagsPickerPageContenxt> = createContext({})

export function useTagsPage() {
    return (useContext(TagsPickerPageContenxt))
}

export default function TagsPickerPage({ children }: { children: ReactNode }) {
    const [tags, setTags] = useState([]);
    const [showTagsPage, setShowTagsPage] = useState(false);

    const validTagsFunctionRef = useRef(null);
    const addTagFunctionRef = useRef(null);
    const removeTagFunctionRef = useRef(null);

    const addTag = useCallback((tag: string) => {
        let _tags = tags.find((o: string) => o === tag) ? tags : [...tags, tag];
        setTags(_tags)
        if (addTagFunctionRef && addTagFunctionRef.current && _tags)
            addTagFunctionRef.current(_tags);
    }, [addTagFunctionRef.current, tags]);

    const removeTag = useCallback((tag: string, f: (t: any) => void = null) => {
        let _tags = tags.filter((o: string) => o !== tag);
        setTags(_tags);
        if (removeTagFunctionRef && removeTagFunctionRef.current && _tags)
            removeTagFunctionRef.current(_tags);
    }, [tags, removeTagFunctionRef]);

    const validTags = useCallback(() => {
        if (validTagsFunctionRef.current) {
            validTagsFunctionRef.current(tags)
        }
        setShowTagsPage((p: boolean) => !p)
    }, [validTagsFunctionRef.current, tags]);

    return (
        <TagsPickerPageContenxt.Provider
            value={{
                tags,
                setTags,
                showTagsPage,
                setShowTagsPage,
                removeTag,
                addTag,
                validTagsFunctionRef,
                addTagFunctionRef,
                removeTagFunctionRef
            }}
        >
            {children}
            {
                showTagsPage &&
                <InterestsTagsList
                    tagsSelected={tags}
                    addTag={addTag}
                    removeTag={removeTag}
                    onClick={validTags}
                />
            }
        </TagsPickerPageContenxt.Provider>
    )
}