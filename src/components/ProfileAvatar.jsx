import React from 'react'
import { Avatar } from 'rsuite'
import { getNameInitials } from '../misc/Helpers'

const ProfileAvatar = ({ name, ...props }) => {
    return (
        <Avatar circle {...props}>
            {
                getNameInitials(name)
            }
        </Avatar>
    )
}

export default ProfileAvatar