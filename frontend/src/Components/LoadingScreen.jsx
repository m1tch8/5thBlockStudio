
const style = {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '4'
    }
const style2 ={
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    position: 'absolute',
    opacity: '0.5',
    display: 'flex',
}
const loaderStyle ={
    border: '10px solid #969696',
    borderLeftColor: 'transparent',
    borderRadius: '50%',
    zIndex: '10',
    width: '100px',
    height: '100px',
    animation: 'spin89345 1s linear infinite'
}
export default function LoadingScreen(){
    return(
        <div className="loading-screen" style={style}>
            <div className="loader" style={loaderStyle}></div>
            <div className="shadow-background" style={style2}></div>
        </div>
    )
}