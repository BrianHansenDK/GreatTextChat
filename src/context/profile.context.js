import React, { createContext, useContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import { auth, database } from "../misc/firebase";

export const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};


const ProfileContext = createContext()

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        let userRef;
        let userStatusRef


        const authUnSub = auth.onAuthStateChanged(obj => {

            if (obj) {
                userStatusRef = database.ref(`/status/${obj.uid}`)
                userRef = database.ref(`/profiles/${obj.uid}`)

                userRef.on('value', (snap) => {
                    const { name, createdAt, avatar } = snap.val()

                    const data = {
                        name,
                        createdAt,
                        avatar,
                        uid: obj.uid,
                        email: obj.email
                    }
                    setProfile(data);
                    setLoading(false);

                })



                database.ref('.info/connected').on('value', (snapshot) => {
                    if (snapshot.val() === false) {
                        return;
                    };
                    userStatusRef.onDisconnect().set(isOfflineForDatabase).then(() => {
                        userStatusRef.set(isOnlineForDatabase);
                    });
                });

            } else {

                if (userRef) {
                    userRef.off();
                }
                if (userStatusRef) {
                    userStatusRef.off()
                }
                database.ref('.info/connected').off()
                setProfile(null);
                setLoading(false);
            }

        })

        return () => {
            authUnSub();
            database.ref('.info/connected').off()

            if (userRef) {
                userRef.off();
            }
            if (userStatusRef) {
                userStatusRef.off()
            }
        }

    }, [])

    return (
        <ProfileContext.Provider value={{ loading, profile }}>
            {children}
        </ProfileContext.Provider >
    )
}

export const useProfile = () => useContext(ProfileContext);