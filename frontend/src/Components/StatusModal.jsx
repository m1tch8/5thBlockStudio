import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
export default function StatusModal({open,handleClose,isError,statusMessage}){
    
    return(
        <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}>
            <Alert onClose={handleClose}
                severity={isError ? "error" : "success"}
                variant="filled"
                sx={{ width: '100%' }}>
                    {statusMessage}
            </Alert>
        </Snackbar>
    )
}