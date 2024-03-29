import React, { memo } from 'react'
import { useParams } from 'react-router'
import { Alert, Button, Drawer } from 'rsuite'
import { useCurrentRoom } from '../../../context/current-room.context'
import { useMediaQuery, useModalState } from '../../../misc/CustomHooks'
import { database } from '../../../misc/firebase'
import EditableInput from '../../EditableInput'

const EditRoomBtnDrawer = () => {
    const { isOpen, open, close } = useModalState()
    const { chatId } = useParams()
    const isMobile = useMediaQuery('(max-width: 992px)')

    const name = useCurrentRoom(v => v.name)
    const description = useCurrentRoom(v => v.description)

    const updateData = (key, value) => {
        database.ref(`rooms/${chatId}`).child(key).set(value)
            .then(() => {
                Alert.success('Room information was succesfully updated', 4000)
            })
            .catch(err => {
                Alert.error(err.message, 4000)
            })
    }

    const changeName = (newName) => {
        updateData('name', newName)
    }

    const changeDescription = (newDescription) => {
        updateData('description', newDescription)
    }

    return (
        <div>
            <Button className='br-circle' size='sm' color='red' onClick={open}>
                A
            </Button>
            <Drawer full={isMobile} show={isOpen} onHide={close} placement='right'>
                <Drawer.Header>
                    <Drawer.Title>Edit Room</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <EditableInput
                        initialValue={name}
                        onSave={changeName}
                        label={
                            <h6 className='mb-2'>
                                Name
                            </h6>
                        }
                        emptymsg='Name cannot be empty ⚠️'
                    />
                    <EditableInput
                        componentClass='textarea'
                        rows={5}
                        initialValue={description}
                        onSave={changeDescription}
                        label={
                            <h6 className='mb-2'>
                                Description
                            </h6>
                        }
                        wrapperClassName='mt-3'
                        emptymsg='Description cannot be empty ⚠️'
                    />
                </Drawer.Body>
                <Drawer.Footer>
                    <Button block onClick={close} >
                        Close
                    </Button>
                </Drawer.Footer>
            </Drawer>
        </div>
    )
}

export default memo(EditRoomBtnDrawer)