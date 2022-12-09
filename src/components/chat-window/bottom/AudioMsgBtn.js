import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router'
import { Alert, Icon, InputGroup } from 'rsuite'
import { ReactMic } from 'react-mic'
import { storage } from '../../../misc/firebase'

const AudioMsgBtn = ({ afterUpload }) => {

    const { chatId } = useParams()
    const [recording, setRecording] = useState(false)
    const [uploading, setUploading] = useState(false)

    const micHandler = useCallback(() => {
        setRecording(p => !p)
    }, [])

    const onUpload = useCallback(async (data) => {
        setUploading(true)
        try {
            const snap = await storage
                .ref(`/chat/${chatId}`)
                .child(`audio_${Date.now()}.mp3`)
                .put(data.blob, { cacheControl: `public, max-age=${3600 * 24 * 3}` })

            const file = {
                contentType: snap.metadata.contentType,
                name: snap.metadata.name,
                url: await snap.ref.getDownloadURL()
            }

            setUploading(false)
            afterUpload([file])
        } catch (err) {
            setUploading(false)
            Alert.error(err.message, 4000)
        }
    }, [afterUpload, chatId])



    return (
        <InputGroup.Button onClick={micHandler} disabled={uploading} className={recording ? 'animate-blink' : ''}>
            <Icon icon='microphone' />
            <ReactMic
                record={recording}
                className="d-none"
                onStop={onUpload}
                mimeType='audio/mp3'
            />
        </InputGroup.Button>
    )
}

export default AudioMsgBtn