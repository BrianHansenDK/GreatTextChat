import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../misc/firebase";


const ProfileContext = createContext()

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        let userRef;

        const authUnSub = auth.onAuthStateChanged(obj => {

            if (obj) {

                userRef = database.ref(`/profiles/${obj.uid}`);

                userRef.on('value', (snap) => {
                    const { name, createdAt } = snap.val();

                    const data = {
                        name,
                        createdAt,
                        uid: obj.uid,
                        email: obj.email
                    }
                    setProfile(data);
                    setLoading(false);

                })
            } else {

                if (userRef) {
                    userRef.off();
                }
                setProfile(null);
                setLoading(false);
            }

        })

        return () => {
            authUnSub();

            if (userRef) {
                userRef.off();
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