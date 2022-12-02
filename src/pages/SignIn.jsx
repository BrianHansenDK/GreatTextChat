import React from 'react'
import firebase from 'firebase/app';
import FacebookOfficialIcon from '@rsuite/icons/legacy/FacebookOfficial';
import GooglePlusCircleIcon from '@rsuite/icons/legacy/GooglePlusCircle';
import { Button, Col, Container, Grid, Panel, Row } from 'rsuite';
import { auth, database } from '../misc/firebase';

const SignIn = () => {



    const singInWithProvider = async (provider) => {
        try {
            const { additionalUserInfo, user } = await auth.signInWithPopup(provider)

            if (additionalUserInfo.isNewUser) {
                await database.ref(`/profiles/${user.uid}`).set({
                    name: user.displayName,
                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                })
            }
        } catch (err) {
            console.error(err)
        }
    }

    const onFacebookSignIn = () => {
        singInWithProvider(new firebase.auth.FacebookAuthProvider)
    };
    const onGoogleSignIn = () => {
        singInWithProvider(new firebase.auth.GoogleAuthProvider)
    };

    return (
        <Container>
            <Grid className='mt-page'>
                <Row>
                    <Col xs={24} md={12} mdOffset={6}>
                        <Panel>
                            <div className='text-center'>
                                <h2>
                                    Welcome to the Greatext App
                                </h2>
                                <p>Progressive chat platform for neophytes</p>
                            </div>
                            <div className='mt-3'>
                                <Button block appearance='primary' color='blue' onClick={onFacebookSignIn}>
                                    <FacebookOfficialIcon /> Login with Facebook
                                </Button>
                                <Button block appearance='primary' color='green' onClick={onGoogleSignIn}>
                                    <GooglePlusCircleIcon /> Login with Google
                                </Button>
                            </div>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        </Container>
    )
};

export default SignIn