import React from 'react'
import { Button, Modal } from 'rsuite'
import { useModalState } from '../../../misc/CustomHooks'
import ProfileAvatar from '../../ProfileAvatar'

const ProfileInfoBtnModal = ({ profile, children, ...btnProps }) => {
    const { isOpen, close, open } = useModalState()
    const { name, createdAt } = profile

    const shortName = profile.name.split(' ')[0]
    const userSince = new Date(createdAt).toLocaleDateString()
    return (
        <>
            <Button onClick={open} {...btnProps
            }>
                {shortName}
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    {shortName} Profile
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <ProfileAvatar
                        src={profile.avatar}
                        name={profile.name}
                        className='width-200 height-200 img-fullsize font-huge'
                    />
                    <h4 className='mt-2'>
                        {name}
                    </h4>
                    <p>
                        User since {userSince}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    {children}
                    <Button block onClick={close}>
                        close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ProfileInfoBtnModal