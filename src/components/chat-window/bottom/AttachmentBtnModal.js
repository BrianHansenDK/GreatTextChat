import React, { useRef, useState } from 'react'
import { useParams } from 'react-router'
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite'
import { useModalState } from '../../../misc/CustomHooks'
import { storage } from '../../../misc/firebase'

const MAX_FILESIZE = 1000 * 1024 * 5

const AttachmentBtnModal = ({ afterUpload }) => {
    const { isOpen, open, close } = useModalState()
    const { chatId } = useParams
    const [fileList, setFileList] = useState([])
    const [loading, setLoading] = useState(false)
    const uploader = useRef();

    const onChange = (fileArr) => {

        const filtered = fileArr.filter(el => el.blobFile.size <= MAX_FILESIZE).slice(0, 5)

        setFileList(filtered)

    }
    const sendFiles = async () => {
        try {
            const uploadPromises = fileList.map(file => {
                return storage
                    .ref(`/chat/${chatId}`)
                    .child(Date.now() + file.name)
                    .put(file.blobFile, { cacheControl: `public, max-age=${3600 * 24 * 3}` })
            })

            const uploadSnapshots = await Promise.all(uploadPromises)
            const shapePromises = uploadSnapshots.map(async snap => {
                return {
                    contentType: snap.metadata.contentType,
                    name: snap.metadata.name,
                    url: await snap.ref.getDownloadURL()
                }
            })

            const files = await Promise.all(shapePromises)

            await afterUpload(files)

            setLoading(false)

            close()

        } catch (err) {
            setLoading(false)
            Alert.error(err.message, 4000)
        }
    }
    return (
        <>
            <InputGroup.Button onClick={open}>
                <Icon icon='attachment' />
            </InputGroup.Button>
            <Modal className='p-0' show={isOpen} onHide={close} >
                <Modal.Header>
                    <Modal.Title>
                        Upload attachments
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Uploader className='w-100'
                        fileList={fileList}
                        autoUpload={false}
                        ref={uploader}
                        action=""
                        onChange={onChange}
                        multiple
                        listType='picture-text'
                        disabled={loading}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button block color='blue' onClick={sendFiles} disabled={loading}>
                        Send to chat
                    </Button>
                    <div className='text-right mt-2' >
                        <small>* Max file size: 5mb</small>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AttachmentBtnModal