import { Box, Button, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const CardScript = (props) => {
    const { destino, descricaoDestino, imagem } = props.package;

    const imageBanner = {
        backgroundImage: `url(http://localhost:3001/assets/${imagem})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '250px',
        borderRadius: '10px'
    };

    const theme = useTheme();
    const blueColor = theme.palette.background.blue;

    return (
        <Box sx={{ width: '90%', height: 'auto', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', borderRadius: '10px', marginTop: '10px', gap: '1rem', padding: '10px', color: blueColor, backgroundColor: 'white', boxShadow: '2px 2px 2px rgba(0,0,0,0.3)' }}>
            <Box sx={imageBanner} />
            <Box sx={{ display: 'flex', gap: '0.3rem' }}>
                <Typography sx={{ fontSize: '20px' }}>Roteiro para </Typography>
                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{destino}</Typography>
            </Box>

            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>{descricaoDestino.slice(0, 100) + '...'}</Typography>

            <Link to="/roteiro" state={{ roteiro: props.package }}>
                <Button sx={{ width: '100%', backgroundColor: blueColor, color: 'white', border: `1px solid ${blueColor}`, '&:hover': { color: blueColor } }}>Clique aqui para saber mais</Button>
            </Link>
        </Box>
    )
}

export default CardScript;