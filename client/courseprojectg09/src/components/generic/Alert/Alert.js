import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useEffect } from 'react';

export default function AlertBox(props) {
    const { alert, setAlert, message } = props;

    // On componentDidMount set the timer
    useEffect(() => {
        if (alert) {
            const timeId = setTimeout(() => {
                // After 5 seconds set the show value to false
                setAlert(false)
            }, 5000)
            return () => {
                clearTimeout(timeId)
            }
        }
    }, [alert, setAlert]);


    if (alert) {
        return (
            <Alert severity={message.type} onClose={() => setAlert(false)}>
            <AlertTitle>{message.type === "error" ? "Error" : "Info"} </AlertTitle>
                    {message.text}
            </Alert>

            <Alert className='mt-3 pb-0' variant={message.type} onClose={() => setAlert(false)} dismissible>
                {message.type === "error" ? <Alert.Heading>Oh snap! You got an error!</Alert.Heading> : <></>}
                <p>{message.msg}</p>
            </Alert>
        );
    } else {
        return <> </>;
    }
}