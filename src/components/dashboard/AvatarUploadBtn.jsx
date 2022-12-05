import React, { useState } from 'react'
import { Alert, Button, Modal } from 'rsuite'
import AvatarEditor from 'react-avatar-editor'
import { useModalState } from '../../misc/CustomHooks'

const fileInputTypes = '.png, .jpg, .jpeg'
const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg']
const isValidFile = (file) => acceptedFileTypes.includes(file.type)

const AvatarUploadBtn = () => {
    const { isOpen, open, close } = useModalState()
    const [avatar, setAvatar] = useState(null)

    const onFileInputChange = (ev) => {
        const currFiles = ev.target.files

        if (currFiles.length === 1) {
            const file = currFiles[0]

            if (isValidFile(file)) {
                setAvatar(file)
                open()
            } else {
                Alert.warning(`Wrong file type ${file.type}`, 4000)
            }

        }
    }
    return (
        <div className='mt-3 text-center'>
            <div>
                <label htmlFor='avatar-upload' className='d-block cursor-pointer padded'>
                    Select new Avatar
                    <input id='avatar-upload' type="file" className='d-none' accept={fileInputTypes} onChange={onFileInputChange} />
                </label>

                <Modal show={isOpen} onHide={close} >
                    <Modal.Header>
                        <Modal.Title>
                            Upload new Avatar 🚀
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='d-flex justify-content-center align-items-center h-100'>

                            {
                                avatar ? (
                                    <AvatarEditor
                                        image={avatar}
                                        width={200}
                                        height={200}
                                        border={10}
                                        borderRadius={100}
                                        color={[255, 255, 255, 0.6]} // RGBA
                                        scale={1.2}
                                        rotate={0}
                                    />
                                ) : null
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button block appearance='ghost'>
                            Upload
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default AvatarUploadBtn