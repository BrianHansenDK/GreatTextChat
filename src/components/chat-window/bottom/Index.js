import React, { useState, useCallback } from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite'
import firebase from 'firebase/app'
import { useParams } from 'react-router'
import { useProfile } from '../../../context/profile.context'
import { database } from '../../../misc/firebase'
import AttachmentBtnModal from './AttachmentBtnModal'

function assembleMessage(profile, chatId) {
    return {
        roomId: chatId,
        author: {
            name: profile.name,
            uid: profile.uid,
            createdAt: profile.createdAt,
            ...(profile.avatar ? { avatar: profile.avatar } : {})
        },
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        likeCount: 0
    }
}

const Bottom = () => {

    const [input, setInput] = useState()
    const [loading, setLoading] = useState(false)

    const { profile } = useProfile()
    const { chatId } = useParams()

    const onInputChange = useCallback(
        (value) => {
            setInput(value)
        },
        [],
    )

    const sendMessage = async () => {
        if (input.trim() === '') {
            return
        }

        const msgData = assembleMessage(profile, chatId)
        msgData.text = input

        const updates = {}

        const messageId = database.ref('messages').push().key
        updates[`/messages/${messageId}`] = msgData
        updates[`/rooms/${chatId}/lastMessage`] = {
            ...msgData,
            msgId: messageId,
        }
        setLoading(true)
        try {
            await database.ref().update(updates)
            setInput('')
            setLoading(false)
        } catch (err) {
            setLoading(false)
            Alert.error(err.message, 4000)
        }
    }

    const onKeyDown = (ev) => {
        if (ev.keyCode === 13) {
            ev.preventDefault()
            sendMessage()
        }
    }

    const afterUpload = useCallback(async (files) => {
        setLoading(true)
        const updates = {}

        files.forEach(file => {
            const messageId = database.ref('messages').push().key

            const msgData = assembleMessage(profile, chatId)
            msgData.file = file

            updates[`/messages/${messageId}`] = msgData
        })

        const lastMessageId = Object.keys(updates).pop()

        updates[`/rooms/${chatId}/lastMessage`] = {
            ...updates[lastMessageId],
            msgId: lastMessageId,
        }

        try {
            await database.ref().update(updates)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            Alert.error(err.message, 4000)
        }
    },
        [chatId, profile],
    )


    return (
        <div>
            <InputGroup>
                <AttachmentBtnModal afterUpload={afterUpload} />
                <Input
                    value={input}
                    onChange={onInputChange}
                    placeholder='Write a new message...'
                    onKeyDown={onKeyDown}
                />
                <InputGroup.Button
                    color='blue'
                    appearance='primary'
                    onClick={sendMessage}
                    disabled={loading}
                >
                    <Icon icon='send' />
                </InputGroup.Button>
            </InputGroup>
        </div>
    )
}

export default Bottom