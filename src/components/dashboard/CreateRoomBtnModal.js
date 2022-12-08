import React, { useCallback, useRef, useState } from 'react'
import { Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal, Schema } from 'rsuite'
import firebase from 'firebase/app'
import { useModalState } from '../../misc/CustomHooks'
import { auth, database } from '../../misc/firebase'

const { StringType } = Schema.Types
const model = Schema.Model({
    name: StringType().isRequired('Chat name is required!'),
    description: StringType().isRequired('Chat room requires a description')
})

const INITIAL_FORM = {
    name: '',
    description: '',
}

const CreateRoomBtnModal = () => {
    const { isOpen, open, close } = useModalState()
    const [formValue, setFormValue] = useState(INITIAL_FORM)
    const [loading, setLoading] = useState(false)
    const formRef = useRef()

    const onFormChange = useCallback(val => {
        setFormValue(val)
    }, [])

    const onSubmit = async () => {
        if (!formRef.current.check()) {
            return
        }
        setLoading(true)

        const newRoomData = {
            ...formValue,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            admins: {
                [auth.currentUser.uid]: true
            }
        }

        try {
            await database.ref('rooms').push(newRoomData)
            setLoading(false)
            setFormValue(INITIAL_FORM)
            close()
            Alert.info(`${formValue.name} was created succesfully 😁`, 4000)
        } catch (err) {
            setLoading(false)
            Alert.error(err.message, 4000)
        }
    }

    return (
        <div>
            <Button block color='green' className='mt-1' onClick={open}>
                <Icon icon='creative' /> Create new room
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>
                        New chat Room
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid onChange={onFormChange} formValue={formValue} model={model} ref={formRef}>
                        <FormGroup>
                            <ControlLabel>Room name</ControlLabel>
                            <FormControl name='name' placeholder='Enter name of chat room...' />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Room description</ControlLabel>
                            <FormControl componentClass='textarea' rows={5} name='description' placeholder='Enter name of chat room...' />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button block appearance='primary' onClick={onSubmit} disabled={loading}>
                        Create new chat room
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateRoomBtnModal