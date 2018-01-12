import React from 'react';
import './home.css';
import bankSVG from './communityBank.svg'

export default function Home() {
    return (
        <div>
            <img src={bankSVG} alt="" />
            <br />
            <a href={process.env.REACT_APP_LOGIN}>
                <button>LOGIN</button>
            </a>
        </div>
    )
}