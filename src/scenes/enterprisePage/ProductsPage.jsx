/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material'
import Navbar from 'scenes/navbar'
import Chart from "react-apexcharts";
import { useState } from 'react';
import { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPackage } from 'state';

const ProductsPage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:650px)");

    const user = useSelector((state) => state.user);

    const [donutState, setDonutState] = useState({
        options: {
            labels: ['Pacotes Vendidoss', 'Pacotes Cadastrados'],
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: isNonMobile ? true : false,
                        },
                    },
                },
            },
        },
        series: [],
    });
    const [packages, setPackages] = useState();
    const fetchUserPackages = async () => {
        const response = await fetch(`http://localhost:3001/packages/getUserPackages/${user.cpf}`, {
            method: 'GET',
        })

        const packages = await response.json();
        console.log(`url(http://localhost:3001/assets${packages[0].imagem})`)

        if (response.ok && packages) {
            console.log(packages)
            setPackages(packages);
            const seriesData = packages.map((p) => parseInt(p.vagas));
            const seriesData2 = packages.map((p) => parseInt(p.vagasRestantes));
            const totalVagas = seriesData.reduce((total, valor) => total + valor, 0);
            const totalVagas2 = seriesData2.reduce((total, valor) => total + valor, 0);

            const series = [totalVagas - totalVagas2, totalVagas2];

            setDonutState({
                options: {
                    labels: ['Pacotes Vendidos', 'Pacotes Pendentes'],
                    plotOptions: {
                        pie: {
                            donut: {
                                labels: {
                                    show: isNonMobile ? true : false,
                                },
                            },
                        },
                    },
                },
                series: series,
            });
        } else {
            alert('Erro ao recuperar pacotes')
        }
    }

    useEffect(() => {
        fetchUserPackages();
    }, [])


    const series = [
        {
            name: 'Pacotes vendidos',
            data: [2, 1, 3, 1, 1, 0]
        }
    ];

    const options = {
        chart: {
            type: 'line'
        },
        series: series,
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        }
    };

    const optionsChartPac = {
        labels: ['Pacote vendidos', 'Pacotes pendentes'],
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: isNonMobile ? true : false,
                    },
                },
            },
        },
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClickInf = (p) => {
        dispatch(setPackage({ package: p }))
        navigate('/packages/cart')
    }

    const handleClickNewProcuct = () => {
        navigate('/products/newProduct')
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#DCE0E6' }}>
            <Navbar />


            <Box sx={{ width: isNonMobile ? '80%' : '100%', overflowX: isNonMobile ? '' : 'hidden', backgroundColor: 'white', minHeight: '90vh', boxShadow: '0px 0px 4px rgba(0,0,0,0.5)' }}>

                <Box sx={{ padding: '30px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: isNonMobile ? '2.7rem' : '1.7rem', color: blueColor, fontWeight: 'bold' }}>Dashboard</Typography>
                    <Button onClick={() => handleClickNewProcuct()} sx={{ border: `1px solid ${blueColor}`, color: 'white', backgroundColor: blueColor, padding: isNonMobile ? '3px 30px' : '0px 5px', fontWeight: 'bold', '&:hover': { backgroundColor: 'white', color: blueColor } }}>Adicionar novo produto</Button>
                </Box>
                <hr style={{
                    width: '100%', border: `1px solid ${blueColor}`
                }} />

                {packages && packages.length > 0 ? (
                    <Box sx={{ padding: isNonMobile ? '30px' : '0px', width: '100%' }}>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: isNonMobile ? 'row' : 'column' }}>

                            <Chart
                                labels={donutState.options.labels}
                                options={donutState.options}
                                series={donutState.series}
                                type="donut"
                                width={isNonMobile ? 450 : 360}
                                height={300}
                            />

                            <ReactApexChart options={options} series={series} type="line" width={isNonMobile ? 1000 : 370} height={300} />

                        </Box>

                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            {packages && packages.map((p) => (
                                <Box sx={{ width: isNonMobile ? '100%' : '96%', border: '1px solid #DCE0E6', borderRadius: '10px', display: 'flex', flexDirection: isNonMobile ? 'row' : 'column' }}>
                                    <Box sx={{
                                        backgroundImage: `url(http://localhost:3001/assets/${p.imagem})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        width: isNonMobile ? '30%' : '100%',
                                        height: '250px',
                                        borderRadius: '10px'
                                    }} />

                                    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: '1.4rem' }}>Pacote para {p.destino}</Typography>
                                        <Box>
                                            <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: '1rem' }}> Total de Vagas: {p.vagas}</Typography>
                                            <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: '1rem' }}> Vagas restantes: {p.vagasRestantes}</Typography>
                                            <Typography sx={{ fontWeight: 'bold', color: blueColor, fontSize: '1rem' }}> Valor base: R$ {p.valorPassagem}</Typography>
                                        </Box>
                                    </Box>

                                    <Chart
                                        options={optionsChartPac}
                                        series={[parseInt(p.vagas - p.vagasRestantes), parseInt(p.vagasRestantes)]}
                                        type="donut"
                                        width={isNonMobile ? 450 : 360}
                                        height={250}
                                    />

                                    <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                                        <Button onClick={() => handleClickInf(p)} sx={{ height: isNonMobile ? '15%' : '20%', alignSelf: 'end', width: isNonMobile ? '' : '100%', margin: '20px', border: `1px solid ${blueColor}`, color: 'white', backgroundColor: blueColor, padding: '24px 100px', fontWeight: 'bold', '&:hover': { backgroundColor: 'white', color: blueColor } }}>Ver mais detalhes</Button>
                                    </Box>

                                </Box>
                            ))}
                        </Box>

                    </Box>

                ) : (
                    <Typography sx={{ fontSize: '1.7rem', color: blueColor, fontWeight: 'bold', padding: '30px' }}>Nenhum pacote cadastrado ainda</Typography>
                )}

            </Box>

        </Box>
    )
}

export default ProductsPage