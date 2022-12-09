import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useHover, useMediaQuery } from '../../../misc/CustomHooks';
import { auth } from '../../../misc/firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import IconControlBtn from './IconControlBtn';
import ImgBtnModal from './ImgBtnModal';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const renderFileMessage = file => {

    if (file.contentType.includes('image')) {

        return (
            <div className='h-220'>
                <ImgBtnModal src={file.url} fileName={file.name} />
            </div>
        )
    }

    if (file.contentType.includes('mp3')) {
        return (
            // eslint-disable-next-line
            <audio controls autoPlay={false}>
                <source src={file.url} type='audio/mp3' />
                Your browser does not support the audio elements... 😔
            </audio>
        )
    }

    return (
        <a href={file.url} >Download attachment: {file.name} </a>
    )
}

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {

    const { author, createdAt, text, file, likes, likeCount } = message
    const [hoverRef, isHovered] = useHover()
    const isMobile = useMediaQuery('(max-width: 992px)')

    const isAdmin = useCurrentRoom(v => v.isAdmin)
    const admins = useCurrentRoom(v => v.admins)

    const isMsgAuthorAdmin = admins.includes(author.uid)
    const isAuthor = auth.currentUser.uid === author.uid
    const canGrantAdmin = isAdmin && !isAuthor

    const canShowIcons = isMobile || isHovered
    const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid)

    return (
        <li className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''} `} ref={hoverRef}>
            <div className='d-flex align-items-center font-bolder mb-1'>
                <PresenceDot uid={author.uid} />
                <ProfileAvatar src={author.avatar} name={author.name} className='ml-1' size='xs' />
                <ProfileInfoBtnModal profile={author} appearance='link' className='p-0 ml-1 text-black' >
                    {
                        canGrantAdmin ? (
                            <Button block onClick={() => handleAdmin(author.uid)} color='blue'>
                                {isMsgAuthorAdmin ?
                                    'Remove administrator permissions'
                                    : 'Give administrator permissions'
                                }
                            </Button>
                        ) : null
                    }

                </ProfileInfoBtnModal>
                <TimeAgo
                    datetime={createdAt}
                    className='font-normal text-black-45 ml-2'
                />
                <IconControlBtn
                    {...(isLiked ? { color: 'red' } : {})}
                    isVisible={canShowIcons}
                    iconName='heart'
                    onClick={() => { handleLike(message.id) }}
                    tooltip='Like Message'
                    badgeContent={likeCount}
                />
                {isAuthor ? (<IconControlBtn
                    isVisible={canShowIcons}
                    iconName='close'
                    onClick={() => { handleDelete(message.id, file) }}
                    tooltip='Delete message'
                />) : null}

            </div>
            <div>
                {
                    text ? <span className='word-break-all'> {text} </span> : null
                }
                {
                    file ? (renderFileMessage(file)) : null
                }
            </div>
        </li>
    )
}

export default memo(MessageItem)