import { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Flex, Input, Tag, Tooltip } from "antd";

type CourseTagsTypes = {
    tags: string[];
    handleSetDatas: (tags: string[]) => void;
};

const CourseTags = ({ tags, handleSetDatas }: CourseTagsTypes) => {
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState("");
    const inputRef = useRef<InputRef>(null);
    const editInputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputVisible]);

    useEffect(() => {
        editInputRef.current?.focus();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editInputValue]);

    const handleClose = (removedTag: string) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        handleSetDatas(newTags);
    };

    const handleInputConfirm = () => {
        if (inputValue && !tags.includes(inputValue)) {
            handleSetDatas([...tags, inputValue]);
        }
        setInputVisible(false);
        setInputValue("");
    };

    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        handleSetDatas(newTags);
        setEditInputIndex(-1);
        setEditInputValue("");
    };

    return (
        <Flex gap="4px 0" wrap>
            {tags.map((tag, index) => {
                if (editInputIndex === index) {
                    return (
                        <Input
                            ref={editInputRef}
                            key={tag}
                            size="large"
                            style={{
                                width: 80,
                                height: 32,
                                marginInlineEnd: 8,
                                verticalAlign: "middle",
                            }}
                            value={editInputValue}
                            onChange={(e) => setEditInputValue(e.target.value)}
                            onBlur={handleEditInputConfirm}
                            onPressEnter={handleEditInputConfirm}
                        />
                    );
                }
                const isLongTag = tag.length > 20;
                const tagElem = (
                    <Tag
                        key={tag}
                        closable
                        style={{
                            userSelect: "none",
                            height: 32,
                            borderRadius: 8,
                            backgroundColor: "#f4f4f5",
                            paddingTop: 4,
                        }}
                        onClose={() => handleClose(tag)}
                    >
                        <span
                            style={{ paddingTop: 4 }}
                            onDoubleClick={(e) => {
                                if (index !== 0) {
                                    setEditInputIndex(index);
                                    setEditInputValue(tag);
                                    e.preventDefault();
                                }
                            }}
                        >
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </span>
                    </Tag>
                );
                return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                        {tagElem}
                    </Tooltip>
                ) : (
                    tagElem
                );
            })}
            {inputVisible ? (
                <Input
                    ref={inputRef}
                    type="text"
                    size="large"
                    style={{
                        width: 80,
                        height: 32,
                        marginInlineEnd: 8,
                        verticalAlign: "middle",
                    }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            ) : (
                <Tag
                    style={{
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: "#f4f4f5",
                        paddingTop: 4,
                    }}
                    icon={<PlusOutlined />}
                    onClick={() => setInputVisible(true)}
                >
                    New Tag
                </Tag>
            )}
        </Flex>
    );
};

export default CourseTags;
