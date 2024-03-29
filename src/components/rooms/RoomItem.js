import React from 'react'
import TimeAgo from 'timeago-react'; // var TimeAgo = require('timeago-react');
import ProfileAvatar from '../ProfileAvatar';


const RoomItem = ({ room }) => {

    const { createdAt, name, lastMessage } = room

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center'>
                <h3 className='text-disappear'>
                    {name}
                </h3>
                <TimeAgo
                    datetime={
                        lastMessage ? new Date(lastMessage.createdAt) : new Date(createdAt)
                    }
                    className='font-normal text-black-45'
                />

            </div>

            <div className='d-flex text-black-70 align-items-center'>

                {
                    lastMessage ? (
                        <>
                            <div className='d-flex align-items-center'>
                                <ProfileAvatar src={lastMessage.author.avatar} name={lastMessage.author.name} size='sm' />
                            </div>
                            <div className='text-disappear ml-2'>
                                <div className='text-italic'>
                                    {lastMessage.author.name}
                                </div>
                                <span>{lastMessage.text || lastMessage.file.name}</span>
                            </div>
                        </>
                    ) : <span> No messages yet...</span>
                }
            </div>
        </div>
    )
}

export default RoomItem