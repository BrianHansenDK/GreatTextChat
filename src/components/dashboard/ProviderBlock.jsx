import React from 'react'
import { useState } from 'react'
import { Alert, Button, Icon, Tag } from 'rsuite'
import firebase from 'firebase/app'
import { auth } from '../../misc/firebase'

const ProviderBlock = () => {

    const [isConnected, setIsConnected] = useState({
        'google.com': auth.currentUser.providerData.some(
            (data) => data.providerId === 'google.com'),
        'facebook.com': auth.currentUser.providerData.some(
            (data) => data.providerId === 'facebook.com'),
    })

    const updateIsConnected = (providerId, value) => {
        setIsConnected(p => {
            return {
                ...p,
                [providerId]: value,
            }
        })
    }

    const unLink = async (providerId) => {
        try {
            if (auth.currentUser.providerData.length === 1) {
                throw new Error(`Unable to disconnect from ${providerId}! This is your only available login method.`)
            }
            await auth.currentUser.unlink(providerId)
            Alert.info(`Disconnected from ${providerId}`, 4000)

            updateIsConnected(providerId, false)
        } catch (err) {
            Alert.error(err.message, 4000)
        }
    }

    const unLinkFacebook = () => {
        unLink('facebook.com')
    }
    const unLinkGoogle = () => {
        unLink('google.com')
    }

    const link = async (provider) => {
        // singInWithProvider(new firebase.auth.FacebookAuthProvider)
        try {
            await auth.currentUser.linkWithPopup(provider)
            Alert.info(`Account succesfully linked to ${provider}`, 4000)
            updateIsConnected(provider.providerId, true)
        } catch (err) {
            Alert.error(err.message, 4000)
        }
    }

    const linkFacebook = () => {
        link(new firebase.auth.FacebookAuthProvider)
    }
    const linkGoogle = () => {
        link(new firebase.auth.GoogleAuthProvider)
    }
    console.log(auth.currentUser, isConnected, setIsConnected)

    return (
        <div>
            {
                isConnected['google.com'] ? (
                    <Tag closable color='green' onClose={unLinkGoogle}>
                        <Icon icon='google' /> Connected
                    </Tag>
                ) : null
            }
            {
                isConnected['facebook.com'] ? (
                    <Tag closable color='blue' onClose={unLinkFacebook}>
                        <Icon icon='facebook' /> Connected
                    </Tag>
                ) : null
            }

            <div className='mt-2'>
                {
                    !isConnected['google.com'] ? (
                        <Button block color='green' onClick={linkGoogle}>
                            <Icon icon='google' /> Link to Google
                        </Button>
                    ) : null
                }
                {
                    !isConnected['facebook.com'] ? (
                        <Button block color='blue' onClick={linkFacebook}>
                            <Icon icon='facebook' /> Link to Facebook
                        </Button>
                    ) : null
                }

            </div>
        </div>
    )
}

export default ProviderBlock