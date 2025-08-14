
import React, {useEffect, useState, useRef} from 'react'
import '../styles/header.css'
import Logo from './Logo'


export function HamburgerDefault({toggleClick}){

    return(
        <>
        <div className="hamburger" onClick={toggleClick}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
        </>
    )
}
export function HamburgerX({toggleClick}){

    return(
        <>
            <div className="hamburger-active" onClick={toggleClick}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </>
    )
}

export function HamburgerMenu(){
    return(
        <ul className="hamburger-menu">
            <li><a href="/request">Request a Mix</a></li>
            <li><a href="/home">Home</a></li>
            <li><a href="/outputs">Outputs</a></li>
            <li><a href="/shop">Shop</a></li>
        </ul>
    )
}

export default function Header(){

    const [toggleMenu, setToggleMenu] = useState(false)

    const navbarRef = useRef(null)

    useEffect(() => {
    let prevWindowY = window.scrollY
    
    function handleScroll() {
        const navbar = navbarRef.current
        if (!navbar) return

        if (window.scrollY > 100){
            navbar.classList.add('hidden')
        }
        else{
            navbar.classList.remove('hidden')
        }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
        window.removeEventListener('scroll', handleScroll)
    }
    }, [])


    function toggleClick(){
        setToggleMenu(!toggleMenu)
    }

    return(
        <>
            <nav ref={navbarRef} className='navbar'>
                <Logo/>
                <ul className="menu">
                    <li><a href="/request">Request a Mix</a></li>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/outputs">Outputs</a></li>
                    <li><a href="/shop">Shop</a></li>
                </ul>
                {
                    !toggleMenu ? 
                    <HamburgerDefault toggleClick={toggleClick}/> 
                    : 
                    <HamburgerX toggleClick={toggleClick}/>
                }
            </nav>
                {toggleMenu && <HamburgerMenu toggleClick={toggleClick}/>}
                
        </>
    )
}