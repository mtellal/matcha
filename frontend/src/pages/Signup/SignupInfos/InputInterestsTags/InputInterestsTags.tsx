import { useContext, useEffect } from "react";
import { TagsPickerPageContenxt } from "../../../../components/TagsPickerPage/TagsPickerPage";
import { TForm } from "../SignupInfosPage";
import addIcon from '../../../../assets/Add_Plus.svg'
import { Icon } from "../../../../components/Icons/Icon";
import Tags from "../../../../components/Label/Tags/Tags";

import './InputInterestsTags.css'

type InputInterestsTagsProps = {
    form: TForm,
    setForm: (f: TForm | ((f: TForm) => TForm)) => void
}

export default function InputInterestsTags({ form, setForm }: InputInterestsTagsProps) {

    const {
        setShowTagsPage,
        removeTag,
        addTagFunctionRef,
        removeTagFunctionRef
    } = useContext(TagsPickerPageContenxt);


    useEffect(() => {
        if (!addTagFunctionRef.current) {
            addTagFunctionRef.current = (tags: string[]) => {
                setForm((f: TForm) => ({ ...f, tags }))
            }
        }
    }, [addTagFunctionRef.current])

    useEffect(() => {
        if (!removeTagFunctionRef.current) {
            removeTagFunctionRef.current = (tags: string[]) => {
                setForm((f: TForm) => ({ ...f, tags }))
            }
        }
    }, [removeTagFunctionRef.current])

    return (
        <div>
            <div className="inputtags-label">
                <p className='title-input' style={{ alignSelf: 'center' }}>Interests Tags</p>
                <Icon
                    icon={addIcon}
                    style={{ height: '30px' }}
                    onClick={() => setShowTagsPage((p: boolean) => !p)}
                />
            </div>
            {
                form.tags.length > 0 &&
                <div className='inputtags-tags'>
                    {
                        form.tags.map((s: string) =>
                            <Tags
                                key={s}
                                tag={s}
                                onClick={() => removeTag(s)}
                            />
                        )
                    }
                </div>
            }
        </div>
    )
}
