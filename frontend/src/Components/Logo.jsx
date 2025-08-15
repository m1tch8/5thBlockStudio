

export default function Logo({style}){
    const styles ={
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontWeight: '300',
    }
    const styles2 = {
        paddingRight: '10px',
        width: '43px',
    }
    return(
        <div className="logo" style={style && style} >
            <a href="/home" style={styles}>
                <img src="../../src/assets/5th_Block_Logo.png" alt="5th Block Studios Logo" style={styles2}/>
                <p>5TH BLOCK STUDIOS</p>
            </a>
        </div>
    )
}