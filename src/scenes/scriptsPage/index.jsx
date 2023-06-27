import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import CardScript from "components/CardScript";
import { useEffect, useState } from "react";
import Navbar from "scenes/navbar"

const ScriptsPage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:650px)");

    const [scripts, setScripts] = useState();
    const fetchScripts = async () => {
        const response = await fetch('http://localhost:3001/scripts/getAll', {
            method: 'GET'
        })

        const script = await response.json();
        if (response.ok && script) {
            setScripts(script);
        }
    }

    useEffect(() => {
        fetchScripts();
    }, [])

    return (
        <Box sx={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column', backgroundColor: '#DCE0E6', height: '100%', minHeight: '100vh' }}>
            <Navbar />

            <Box sx={{ width: '100%', backgroundColor: blueColor, height: '200px', margin: '20px 0px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 3px 2px rgba(0,0,0,0.3)' }}>
                <Box sx={{ width: '70%' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: isNonMobile ? '40px' : '25px', }}>Roteiros prontos para você não se preocupar com organização!</Typography>
                    {isNonMobile && (
                        <Typography sx={{ fontSize: '17px', textAlign: 'justify' }}>Descubra um mundo de possibilidades com nossos roteiros de viagem exclusivos! Oferecemos um incentivo especial para impulsionar suas vendas: descontos exclusivos, upgrades de hospedagem e experiências personalizadas. Deixe seus clientes encantados com itinerários cuidadosamente elaborados e transforme cada viagem em uma memória inesquecível. Aproveite essa oportunidade única de oferecer aventuras sob medida e aumentar seu sucesso no mercado de turismo.</Typography>
                    )}
                </Box>
            </Box>

            <Grid container spacing={2} sx={{ width: '70%' }}>
                {scripts && scripts.map((pack, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CardScript package={pack} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default ScriptsPage