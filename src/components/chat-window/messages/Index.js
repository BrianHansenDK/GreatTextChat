import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Alert } from 'rsuite'
import { database } from '../../../misc/firebase'
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
        },
        [chatId],
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
                canShowMessages ? (messages.map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} />)) : null
            }
        </ul>

    )
}

export default Messages