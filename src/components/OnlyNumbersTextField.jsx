import { InputAdornment, TextField, useMediaQuery, useTheme } from "@mui/material";
import BedIcon from '@mui/icons-material/Bed';
import PeopleIcon from '@mui/icons-material/People';

function OnlyNumbersTextField(props) {
    const { quantidade, tipo } = props;
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:650px)");

    function handleKeyPress(event) {
        const regex = /[0-9]+/g;
        const key = event.key;

        if (event.target.value.length === 2 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
        } else if (!regex.test(key)) {
            event.preventDefault();
        }
    }

    function handleBlur(event) {
        const inputValue = event.target.value;
        quantidade(inputValue)
    }

    return (
        <TextField
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            sx={{ width: '100%' }}
            label={tipo === 'quarto' ? 'Número de quartos' : 'Número de hospedes'}
            name="quartos"
            variant="filled"
            InputProps={{
                placeholder: tipo === 'quarto' ? '0' : 'Adultos, crianças',
                style: { backgroundColor: "white", borderRadius: "4px", fontWeight: 600 },
                startAdornment: <InputAdornment sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingRight: '10px'
                }}>{tipo === 'quarto' ? <BedIcon sx={{ color: 'black' }} /> : <PeopleIcon sx={{ color: 'black' }} />}
                </InputAdornment>
            }}
            InputLabelProps={{
                style: { color: blueColor, fontWeight: "bold", fontSize: "1rem", marginLeft: isNonMobile ? '30px' : '' }
            }}
        />
    );
}

export default OnlyNumbersTextField;