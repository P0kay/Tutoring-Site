'use client'

import { useEffect } from "react";

function TutorPanel() {
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/tutor/get-tutor-subjects', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Failed to load tutor subjects');
                }

                const data = await res.json();
                console.log(data)
            } catch (err) {
                console.log(err)
            }
        }

        load();
    }, []);
    return (
        <>Tutor panel</>
    );
}

export default TutorPanel;