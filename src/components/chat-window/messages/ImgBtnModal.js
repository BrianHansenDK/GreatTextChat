import React from 'react'
import { Modal } from 'rsuite'
import { useModalState } from '../../../misc/CustomHooks'

const ImgBtnModal = ({ src, fileName, file }) => {

    const { isOpen, open, close } = useModalState()

    return (
        <>
            <input type='image' alt='File' src={src} onClick={open} className='mw-100 mh-100 w-auto' />
            <Modal show={isOpen} onHide={close} >
                <Modal.Header>
                    <Modal.Title>
                        {fileName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={src} width={100} height={100} alt={file} />
                </Modal.Body>
                <Modal.Footer>
                    <a href={src} target='_blank' rel='noopener noreferrer'>
                        View original Image
                    </a>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ImgBtnModal