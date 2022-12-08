import React from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Divider, Drawer } from 'rsuite'
import { useProfile } from '../../context/profile.context'
import { database } from '../../misc/firebase'
import EditableInput from '../EditableInput'
import AvatarUploadBtn from './AvatarUploadBtn'
import ProviderBlock from './ProviderBlock'
import { getUserUpdates } from '../../misc/Helpers'

const Dashboard = ({ onSignOut }) => {

    const { profile } = useProfile()
    const onSave = async newData => {

        try {

            const updates = await getUserUpdates(profile.uid, 'name', newData, database)

            console.log('Updates', updates)

            await database.ref().update(updates)

            Alert.success(`Successfully changed nickname to: ${newData}`, 4000)
        } catch (err) {
            Alert.error(err, 4000)
        }
    }

    return (
        <>
            <Drawer.Header>
                <Drawer.Title>
                    Dashboard
                </Drawer.Title>
            </Drawer.Header>

            <Drawer.Body>
                <h3>
                    Hey {profile.name} 🚀
                </h3>
                <ProviderBlock />
                <Divider />
                <EditableInput
                    name='Nickname'
                    initialValue={profile.name}
                    onSave={onSave}
                    label={<h6 className='mb-2'>Nickname</h6>}
                />
                <AvatarUploadBtn />
            </Drawer.Body>
            <Drawer.Footer>
                <Button componentClass={Link} to='/sign-in' block color='red' onClick={onSignOut}>
                    Sign Out
                </Button>
            </Drawer.Footer>
        </>
    )
}

export default Dashboard