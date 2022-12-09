/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Alert } from 'rsuite'
import { auth, database, storage } from '../../../misc/firebase'
import { transformToArrayWithId } from '../../../misc/Helpers'
import MessageItem from './MessageItem'

const Messages = () => {

    const { chatId } = useParams()

    const [messages, setMessages] = useState(null)

    const isChatEmpty = messages && messages.length === 0
    const canShowMessages = messages && messages.length > 0

    useEffect(() => {
        const messageRef = database.ref('/messages')

        messageRef.orderByChild('roomId').equalTo(chatId).on('value', (snap) => {
            const data = transformToArrayWithId(snap.val())

            setMessages(data)
        })

        return () => {
            messageRef.off('value')
        }
    }, [chatId])

    const handleAdmin = useCallback(
        async (uid) => {
            const adminRef = database.ref(`/rooms/${chatId}/admins`)

            let alertMsg

            await adminRef.transaction(admins => {
                if (admins) {
                    if (admins[uid]) {
                        admins[uid] = null;
                        alertMsg = 'Admin rights removed'
                    } else {
                        admins[uid] = true;
                        alertMsg = 'Admin rights added'
                    }
                }
                return admins;
            })
            Alert.info(alertMsg, 4000)
        }, [chatId])

    const handleLike = useCallback(async (msgId) => {
        const { uid } = auth.currentUser
        const messageRef = database.ref(`/messages/${msgId}`)
        let alertMsg

        await messageRef.transaction(msg => {
            if (msg) {
                if (msg.likes && msg.likes[uid]) {
                    msg.likeCount -= 1
                    msg.likes[uid] = null;
                    alertMsg = 'Like removed'
                } else {
                    msg.likeCount += 1
                    if (!msg.likes) {
                        msg.likes = {}
                    }
                    msg.likes[uid] = true;
                    alertMsg = 'Liked messages'
                }
            }
            return msg;
        })
        Alert.info(alertMsg, 4000)
    }, [])

    const handleDelete = useCallback(async (msgId, file) => {
        if (!window.confirm('Are you sure you want to delete this message?')) {
            return
        }
        const isLast = messages[messages.length - 1].id === msgId
        const updates = {}

        updates[`/messages/${msgId}`] = null

        if (isLast && messages.length > 1) {
            updates[`/rooms/${chatId}/lastMessage`] = {
                ...messages[messages.length - 2],
                msgId: messages[messages.length - 2].id
            }
        }

        if (isLast && messages.length === 1) {
            updates[`/rooms/${chatId}/lastMessage`] = null
        }

        try {
            await database.ref().update(updates)
            Alert.info('Message has been deleted', 4000)
        } catch (err) {
            return Alert.error(err.message, 4000)
        }

        if (file) {
            try {
                const fileRef = storage.refFromURL(file.url)
                await fileRef.delete()
            } catch (err) {
                Alert.error(err.message, 4000)
            }
        }


    },
        [chatId, messages],
    )


    return (

        <ul className='msg-list custom-scroll'>
            {
                isChatEmpty ? (
                    <li>
                        This chat has no messages yet
                    </li>
                ) : null
            }
            {
                canShowMessages ? (messages.map(msg =>
                    <MessageItem
                        key={msg.id} message={msg}
                        handleLike={handleLike}
                        handleAdmin={handleAdmin}
                        handleDelete={handleDelete} />)) : null
            }
        </ul>

    )
}

export default Messages