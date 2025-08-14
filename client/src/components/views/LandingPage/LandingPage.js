import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LandingPage() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('/api/hello')
            .then(response => {
                setMessage(response.data); // 응답 데이터를 상태에 저장
            })
            .catch(error => {
                setMessage('데이터를 불러오지 못했습니다.');
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
            <div>{message}</div>
        </div>
    );
}

export default LandingPage;