import { Autocomplete, Box, Button, Chip, FormControl, InputAdornment, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "scenes/navbar";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StarRating from "widgets/StarRating";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'align': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }],
        ['link', 'image'],
        ['clean']
    ]
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'align',
    'size',
    'color',
    'link', 'image'
];

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const NewProductPage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:1260px)");

    const navigate = useNavigate();
    const handleVoltar = () => {
        navigate('/products')
    }

    const user = useSelector((state) => state.user);

    const [estados, setEstados] = useState([])
    async function fetchStates() {
        const response = await fetch('https://deviagem-server.onrender.com/states/states', {
            method: 'GET',
        });
        const data = await response.json();
        const nomesEstados = data.estados.map((d) => d.nome);
        setEstados(nomesEstados);
    }

    useEffect(() => {
        fetchStates()
    }, [])

    const [accommodations, setAccommodations] = useState();
    const fetchAccommodations = async (destino) => {
        const response = await fetch('https://deviagem-server.onrender.com/accommodations/getByDestiny', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destiny: destino }),
        });

        if (response.status === 200) {
            const acc = await response.json();
            setAccommodations(acc)
        }
    }

    const [packageImage, setPackageImage] = useState();
    const [packageImages, setPackageImages] = useState();

    const formik = useFormik({
        initialValues: {
            operador: user.fullName,
            destino: '',
            cem: '',
            valorPassagem: 0,
            imagem: '',
            imagens: '',
            hospedagem: {},
            vagas: 0,
            pessoas: 0,
            dataInicio: '',
            dataFim: '',
            vagasRestantes: 0
        },
        onSubmit: values => {
            insertPackage(values)
        }
    })

    const [estado, setEstado] = useState();
    const handleChangeState = (e) => {
        setEstado(e.target.value)
        formikAccomodations.setFieldValue('destino', e.target.value);
        formik.setFieldValue('destino', e.target.value);
        fetchAccommodations(e.target.value)
    }

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [image, setImage] = useState('')
    const [images, setImages] = useState();

    const [imageHotel, setImageHotel] = useState('');
    const [imagesHotel, setImagesHotel] = useState();


    const registerAccommodations = async (inf) => {
        const formData = new FormData();

        for (let value in inf) {
            formData.append(value, inf[value]);
        }

        formData.append('image', inf['image'].name);

        const images = inf['images'];
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i].name);
        }

        formData.append('imageQuarto', inf['quartos']['imageQuarto'].name);

        const quartosImages = inf.quartos['image'];
        for (let i = 0; i < quartosImages.length; i++) {
            formData.append('quartos[image][]', quartosImages[i].name);
        }

        const response = await fetch('https://deviagem-server.onrender.com/accommodations/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: formData,
        })

        if (response.status !== 201) {
            alert('Erro ao salvar')
        }

    }

    const formikAccomodations = useFormik({
        initialValues: {
            nomeLocal: '',
            destino: '',
            image: '',
            images: [],
            localizacao: '',
            localizacaoCompleta: '',
            informacaoGeral: '',
            tipoQuarto: '',
            quartos: {
                image: '',
                imageQuarto: '',
                nomeLocal: '',
                tipoQuarto: '',
                localizacao: '',
                capacidade: '',
                valor: '',
                adicional: ''
            },
            camas: '',
            avaliacao: 0,
            tempoCapacidade: '',
            valor: '',
            descricao: '',
            informacoesAdicionais: [],
            geolocalizacao: []
        },
        onSubmit: values => {
            values.quartos.localizacao = values.localizacao
            values.quartos.nomeLocal = values.nomeLocal
            values.geolocalizacao = [latitude, longitude];
            registerAccommodations(values)
        }
    })

    const options = [
        "Animais de estimação permitidos",
        "Acesso Wi-Fi gratuito",
        "Ar Condicionado",
        "Casa de banho privativa",
        "Recepção disponível 24 horas",
        "Cartão de acesso",
        "Cofre",
        "Sala para Bagagem",
    ]

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'latitude') {
            setLatitude(value);
        } else if (name === 'longitude') {
            setLongitude(value);
        }
    };

    const [isSelected, setIsSelected] = useState(false);

    const insertPackage = async (req) => {

        const formData = new FormData();
        for (let value in req) {
            formData.append(value, req[value]);
        }

        formData.set('hospedagem', JSON.stringify(req.hospedagem))

        formData.set('imagem', `${req.imagem.path}`)
        formData.append('imagemMulter', req.imagem)

        let arrayImagens = []
        for (let i in req.imagens) {
            arrayImagens.push(req.imagens[i].path)
        }

        formData.set('imagens', arrayImagens)
        formData.append('imagensMulter', req.imagens)

        const response = await fetch('https://deviagem-server.onrender.com/packages/insertPackage', {
            method: 'POST',
            body: formData,
        })
        const saved = await response.json();

        if (saved) {
            insertPackageToAccount(req);
        } else {
            alert('Erro ao inserir novo pacote')
        }
    }

    const insertPackageToAccount = async (pack) => {
        const body = {
            cpf: user.cpf,
            pack: pack
        }

        const response = await fetch('https://deviagem-server.onrender.com/packages/insertPackagesToAccount', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        if (response.ok) {
            alert('Pacote vinculado com sucesso!')
        } else {
            alert('Erro ao vincular pacote')
        }
    }

    const [text, setText] = useState('');

    const handleTextChange = (value) => {
        setText(value);
        formikAccomodations.setFieldValue('descricao', value)
    };

    const handleDataInicio = (data) => {
        const formattedDate = new Date(data);
        formik.setFieldValue('dataInicio', formattedDate)
    }

    const handleDataFim = (data) => {
        const formattedDate = new Date(data);
        formik.setFieldValue('dataFim', formattedDate)
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#DCE0E6' }}>
            <Navbar />

            <Box sx={{ width: '100%', backgroundColor: 'white', minHeight: '90vh', boxShadow: '0px 0px 4px rgba(0,0,0,0.5)' }}>

                <Box sx={{ padding: '30px', width: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: isNonMobile ? 'row' : 'column-reverse' }}>
                    <Typography sx={{ fontSize: isNonMobile ? '2.3rem' : '1.5rem', color: blueColor, fontWeight: 'bold' }}>Inclua um novo produto</Typography>
                    {isNonMobile && (
                        <Button onClick={() => handleVoltar()} sx={{ border: `1px solid ${blueColor}`, color: 'white', backgroundColor: blueColor, fontWeight: 'bold', width: isNonMobile ? '150px' : '100%' }}>Voltar</Button>
                    )}
                </Box>
                <hr style={{
                    width: '100%', border: `1px solid ${blueColor}`
                }} />

                <Box sx={{ width: '100%', display: 'flex', flexDirection: isNonMobile ? 'row' : 'column', height: '100%' }}>
                    <Box sx={{ borderBottom: isNonMobile ? 0 : 1, borderRight: isNonMobile ? 1 : 0, borderColor: 'divider', width: isNonMobile ? '250px' : '100%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                        <Tabs value={value} onChange={handleChange} orientation={isNonMobile ? "vertical" : 'horizontal'} sx={{ width: isNonMobile ? '250px' : '100%', boxShadow: isNonMobile ? '0px 2px 2px rgba(0.0.0.0,4)' : '' }}>
                            <Tab label="Pacote" {...a11yProps(0)} sx={{ fontWeight: 'bold', color: blueColor, fontSize: '1.2rem' }} />
                            <Tab label="Hospedagem" {...a11yProps(1)} sx={{ fontWeight: 'bold', color: blueColor, fontSize: '1.2rem' }} />
                            <Tab label="Roteiro" {...a11yProps(2)} sx={{ fontWeight: 'bold', color: blueColor, fontSize: '1.2rem' }} />
                        </Tabs>
                    </Box>


                    {/* PACOTE */}
                    <TabPanel value={value} index={0}>
                        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', justifyContent: 'space-between' }}>
                            <Typography sx={{ width: '100%', color: blueColor, fontWeight: 'bold', fontSize: '1.5rem', textAlign: isNonMobile ? 'start' : 'center' }}>Cadastro de pacote</Typography>
                            <hr style={{ width: '100%' }} />
                            <Typography sx={{ fontSize: '1rem', color: blueColor, width: '100%' }}>Pacote novo chegando...</Typography>

                            <FormControl variant="outlined" sx={{ width: isNonMobile ? '32%' : '100%' }}>

                                <InputLabel sx={{ color: blueColor, fontWeight: 'bold', fontSize: '1rem' }}>Pra onde vai?</InputLabel>
                                <Select
                                    value={estado}
                                    onChange={(e) => handleChangeState(e)}
                                    sx={{ backgroundColor: 'white' }}
                                >
                                    {estados && estados.map((estado, i) => (
                                        <MenuItem key={i} value={estado}>{estado}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Cidade, Estado ou Município"
                                variant="outlined"
                                type="text"
                                onChange={(e) => formik.setFieldValue('cem', e.target.value)}
                                sx={{ width: isNonMobile ? '32%' : '100%' }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <TextField
                                label="Pacote para quantas pessoas?"
                                variant="outlined"
                                type="number"
                                onChange={(e) => formik.setFieldValue('pessoas', e.target.value)}
                                sx={{ width: isNonMobile ? '32%' : '100%' }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <TextField
                                label="Quantas vagas serão disponibilizadas?"
                                variant="outlined"
                                type="number"
                                onChange={(e) => {
                                    formik.setFieldValue('vagas', e.target.value)
                                    formik.setFieldValue('vagasRestantes', e.target.value)
                                }}
                                sx={{ width: isNonMobile ? '32%' : '100%' }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    onChange={handleDataInicio}
                                    label={<span style={{ color: blueColor, fontWeight: "bold", fontSize: "1rem" }}>Data de início</span>}
                                    format="DD/MM/YYYY"
                                    sx={{ width: isNonMobile ? '32%' : '100%' }}
                                />
                            </LocalizationProvider>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    onChange={handleDataFim}
                                    label={<span style={{ color: blueColor, fontWeight: "bold", fontSize: "1rem" }}>Data Final</span>}
                                    format="DD/MM/YYYY"
                                    sx={{ width: isNonMobile ? '32%' : '100%' }}
                                />
                            </LocalizationProvider>


                            <Typography sx={{ fontSize: '1rem', color: blueColor, marginTop: '20px', width: '100%' }}>Capricha nas imagens do destino selecionado!!</Typography>
                            <Box sx={{ width: '100%' }}>
                                <Dropzone
                                    acceptedFiles=".jpg,.jpeg,.png"
                                    multiple={false}
                                    onDrop={(acceptedFiles) => {
                                        formik.setFieldValue("imagem", acceptedFiles[0]);
                                        setPackageImage(acceptedFiles[0])
                                    }
                                    }
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <Box
                                            {...getRootProps()}
                                            sx={{ padding: '0 12px', border: `1px solid #C4C4C4`, borderRadius: '5px', color: blueColor, fontWeight: "bold", fontSize: "1rem", "&:hover": { cursor: "pointer" } }}
                                        >
                                            <input {...getInputProps()} />
                                            {!packageImage ? (
                                                <p style={{ border: '2px dashed #C4C4C4', padding: "1rem" }}>Imagem principal</p>
                                            ) : (
                                                <FlexBetween height='51px'>
                                                    <Typography>{packageImage.name}</Typography>
                                                    <EditOutlinedIcon sx={{ marginRight: '12px' }} />
                                                </FlexBetween>
                                            )}
                                        </Box>
                                    )}
                                </Dropzone>
                            </Box>

                            <Box sx={{ width: '100%' }}>
                                <Dropzone
                                    acceptedFiles=".jpg,.jpeg,.png"
                                    multiple={true}
                                    onDrop={(acceptedFiles) => {
                                        formik.setFieldValue("imagens", acceptedFiles);
                                        setPackageImages(acceptedFiles)
                                    }
                                    }
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <Box
                                            {...getRootProps()}
                                            sx={{ padding: '0 12px', border: `1px solid #C4C4C4`, borderRadius: '5px', color: blueColor, fontWeight: "bold", fontSize: "1rem", "&:hover": { cursor: "pointer" } }}
                                        >
                                            <input {...getInputProps()} />
                                            {!packageImages ? (
                                                <p style={{ border: '2px dashed #C4C4C4', padding: "1rem" }}>Imagens sobre o pacote</p>
                                            ) : (
                                                <FlexBetween height='51px'>
                                                    {packageImages.map((pack) => (
                                                        <Typography>{pack.name}</Typography>
                                                    ))}
                                                    <EditOutlinedIcon sx={{ marginRight: '12px' }} />
                                                </FlexBetween>
                                            )}
                                        </Box>
                                    )}
                                </Dropzone>
                            </Box>

                            <Typography sx={{ fontSize: '1rem', color: blueColor, marginTop: '20px', width: '100%' }}>Valor apenas do pacote, de hospedagem será acrescentado depois!!</Typography>
                            <TextField
                                label="Valor base"
                                variant="outlined"
                                type="number"
                                onChange={(e) => formik.setFieldValue('valorPassagem', e.target.value)}
                                sx={{ width: '100%' }}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />


                            {accommodations && (
                                <Box sx={{ width: '100%' }}>
                                    <hr style={{ width: '100%' }} />
                                    <Typography sx={{ width: '100%', color: blueColor, fontWeight: 'bold', fontSize: '1.1rem' }}>Selecione uma hospedagem pré cadastrada</Typography>
                                </Box>

                            )}

                            {accommodations && accommodations.map((acc) => (
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Box sx={{ border: '1px solid #C4C4C4', width: '100%', borderRadius: '10px', height: '250px', display: 'flex' }}>
                                        <Box sx={{
                                            backgroundImage: `url(https://deviagem-server.onrender.com/assets/${acc.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            width: '20%',
                                            height: '248px',
                                            borderRadius: '10px'
                                        }} />

                                        <Box sx={{ width: '60%', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                                            <Box>
                                                <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: blueColor, padding: '10px' }}>{acc.nomeLocal}</Typography>
                                                <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', color: blueColor, paddingLeft: '10px' }}>{acc.localizacao}</Typography>
                                            </Box>

                                            <Box>
                                                <Link to="/reserveAccommodation" state={{ hospedagem: acc }}>
                                                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem', paddingLeft: '10px' }}>Mais informações sobre a hospedagem</Typography>
                                                </Link>
                                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: blueColor, paddingLeft: '10px' }}>{acc.informacaoGeral}, {acc.tipoQuarto}</Typography>
                                            </Box>

                                        </Box>

                                        <Box sx={{ width: '20%', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'end', padding: '10px' }}>
                                            <StarRating rating={4} />
                                            <Button disabled={isSelected} onClick={() => { formik.setFieldValue('hospedagem', acc); setIsSelected(true) }} sx={{ fontWeight: 'bold', width: '100%', border: `1px solid ${blueColor}`, backgroundColor: blueColor, color: 'white', '&:hover': { backgroundColor: 'white', color: blueColor } }}>Selecionar esse</Button>
                                        </Box>

                                    </Box>
                                </Box>
                            ))}

                            <Button onClick={() => setIsSelected(false)} type='submit' sx={{ fontWeight: 'bold', width: '100%', height: '3rem', border: `1px solid ${blueColor}`, backgroundColor: blueColor, color: 'white', '&:hover': { backgroundColor: 'white', color: blueColor } }}>Cadastrar Pacote</Button>

                        </form>
                    </TabPanel>

                    {/* HOSPEDAGEM */}
                    <TabPanel value={value} index={1}>
                        <form onSubmit={formikAccomodations.handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', justifyContent: 'space-between' }}>
                            <Typography sx={{ width: '100%', color: blueColor, fontWeight: 'bold', fontSize: '1.5rem', textAlign: isNonMobile ? 'start' : 'center' }}>Sobre a hospedagem...</Typography>
                            <hr style={{ width: '100%' }} />

                            <Typography sx={{ fontSize: '1rem', color: blueColor, width: '100%' }}>Vamos começar... Primeiro diga onde fica</Typography>
                            <FormControl variant="outlined" sx={{ width: '100%' }}>
                                <InputLabel sx={{ color: blueColor, fontWeight: 'bold', fontSize: "1rem" }}>Destino</InputLabel>
                                <Select
                                    value={estado}
                                    onChange={(e) => handleChangeState(e)}
                                >
                                    {estados && estados.map((estado, i) => (
                                        <MenuItem key={i} value={estado}>{estado}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Typography sx={{ fontSize: '1rem', color: blueColor, width: '100%', marginTop: '20px' }}>Agora me diga algumas informações sobre sua hospedagem</Typography>
                            <TextField
                                label="Razão Social"
                                variant="outlined"
                                onChange={(e) => formikAccomodations.setFieldValue('nomeLocal', e.target.value)}
                                sx={{ width: isNonMobile ? '32%' : '100%', color: blueColor }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <TextField
                                label="Cidade, Estado ou Município"
                                variant="outlined"
                                onChange={(e) => formikAccomodations.setFieldValue('localizacao', e.target.value)}
                                sx={{ width: isNonMobile ? '32%' : '100%' }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <TextField
                                label="Localização Completa"
                                variant="outlined"
                                onChange={(e) => formikAccomodations.setFieldValue('localizacaoCompleta', e.target.value)}
                                sx={{ width: isNonMobile ? '32%' : '100%' }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <Typography sx={{ fontSize: '1rem', color: blueColor, marginTop: '20px', width: '100%' }}>Sua hora de mostrar o por que sua hospedagem é a melhor!!</Typography>
                            <Box sx={{ width: '100%', border: '1px solid #c4c4c4', padding: '10px', borderRadius: '4px' }}>
                                <Typography sx={{ color: blueColor, fontWeight: "bold", fontSize: "1rem", marginBottom: '10px' }}>Descrição</Typography>
                                <div className="mobile-editor-wrapper">
                                    <ReactQuill
                                        style={{ borderRadius: '4px' }}
                                        value={text}
                                        onChange={handleTextChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                    />
                                </div>
                            </Box>

                            <Typography sx={{ fontSize: '1rem', color: blueColor, marginTop: '20px', width: '100%' }}>Agora só mais algumas informações úteis</Typography>
                            <TextField
                                label="Informação Geral"
                                variant="outlined"
                                onChange={(e) => formikAccomodations.setFieldValue('informacaoGeral', e.target.value)}
                                sx={{ width: isNonMobile ? '32%' : '100%' }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <TextField
                                label="Tipo de quarto"
                                variant="outlined"
                                onChange={(e) => formikAccomodations.setFieldValue('tipoQuarto', e.target.value)}
                                sx={{ width: isNonMobile ? '32%' : '100%' }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <TextField
                                label="Quantas camas"
                                variant="outlined"
                                onChange={(e) => formikAccomodations.setFieldValue('camas', e.target.value)}
                                sx={{ width: isNonMobile ? '32%' : '100%' }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <TextField
                                label="Tempo Capacidade"
                                variant="outlined"
                                onChange={(e) => formikAccomodations.setFieldValue('tempoCapacidade', e.target.value)}
                                sx={{ width: isNonMobile ? '32%' : '100%' }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <Autocomplete
                                multiple
                                value={formikAccomodations.values.informacoesAdicionais}
                                onChange={(event, value) => {
                                    formikAccomodations.setFieldValue('informacoesAdicionais', value);
                                }}
                                sx={{ width: isNonMobile ? '66%' : '100%' }}
                                options={options}
                                getOptionLabel={(option) => option}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            variant="outlined"
                                            label={option}
                                            size="small"
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Informações adicionais"
                                        InputLabelProps={{
                                            style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                        }}
                                    />
                                )}
                            />

                            <Typography sx={{ fontSize: '1rem', color: blueColor, marginTop: '20px', width: '100%' }}>Capricha no valor!!</Typography>
                            <TextField
                                label="Valor base"
                                variant="outlined"
                                onChange={(e) => formikAccomodations.setFieldValue('valor', e.target.value)}
                                sx={{ width: isNonMobile ? '32%' : '100%' }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <Typography sx={{ fontSize: '1rem', color: blueColor, marginTop: '20px', width: '100%' }}>Coloque a Geolocalização exata!!</Typography>
                            <TextField
                                name="latitude"
                                label="Latitude"
                                value={latitude}
                                onChange={handleInputChange}
                                sx={{ width: isNonMobile ? '49%' : '100%' }}
                                variant="outlined"
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <TextField
                                multiline
                                name="longitude"
                                label="Longitude"
                                value={longitude}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{ width: isNonMobile ? '49%' : '100%' }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                }}
                            />

                            <Typography sx={{ fontSize: '1rem', color: blueColor, marginTop: '20px', width: '100%' }}>Agora vamos cadastrar imagens da sua hospedagem</Typography>
                            <Box sx={{ width: '100%' }}>
                                <Dropzone
                                    acceptedFiles=".jpg,.jpeg,.png"
                                    multiple={false}
                                    onDrop={(acceptedFiles) => {
                                        formikAccomodations.setFieldValue("image", acceptedFiles[0]);
                                        setImage(acceptedFiles[0])
                                    }
                                    }
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <Box
                                            {...getRootProps()}
                                            sx={{ padding: '0px 12px', border: `1px solid #C4C4C4`, borderRadius: '5px', color: blueColor, fontWeight: "bold", fontSize: "1rem", "&:hover": { cursor: "pointer" } }}
                                        >
                                            <input {...getInputProps()} />
                                            {!image ? (
                                                <p style={{ border: '2px dashed #C4C4C4', padding: "1rem" }}>Imagem principal</p>
                                            ) : (
                                                <FlexBetween height='50px'>
                                                    <Typography>{image.name}</Typography>
                                                    <EditOutlinedIcon sx={{ marginRight: '12px' }} />
                                                </FlexBetween>
                                            )}
                                        </Box>
                                    )}
                                </Dropzone>
                                <Typography sx={{ color: 'grey', fontSize: '0.9rem' }}>Tamanho máximo permitido 1mb</Typography>
                            </Box>

                            <Box sx={{ width: '100%' }}>
                                <Dropzone
                                    acceptedFiles=".jpg,.jpeg,.png"
                                    multiple={true}
                                    onDrop={(acceptedFiles) => {
                                        formikAccomodations.setFieldValue("images", acceptedFiles);
                                        setImages(acceptedFiles)
                                    }
                                    }
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <Box
                                            {...getRootProps()}
                                            sx={{ padding: '0px 12px', border: `1px solid #C4C4C4`, borderRadius: '5px', color: blueColor, fontWeight: "bold", fontSize: "1rem", "&:hover": { cursor: "pointer" } }}
                                        >
                                            <input {...getInputProps()} />
                                            {!images ? (
                                                <p style={{ border: '2px dashed #C4C4C4', padding: "1rem" }}>Imagens</p>
                                            ) : (
                                                <FlexBetween height='51px'>
                                                    {images && images.map((i) => (
                                                        <Typography>{i.name}</Typography>
                                                    ))}
                                                    <EditOutlinedIcon sx={{ marginRight: '12px' }} />
                                                </FlexBetween>
                                            )}
                                        </Box>
                                    )}
                                </Dropzone>
                                <Typography sx={{ color: 'grey', fontSize: '0.9rem' }}>É permitido até 15 imagens</Typography>
                            </Box>


                            <Typography sx={{ width: '100%', color: blueColor, fontWeight: 'bold', fontSize: '1.5rem', marginTop: '20px' }}>Sobre os quartos...</Typography>
                            <hr style={{ width: '100%' }} />

                            <Typography sx={{ fontSize: '1rem', color: blueColor, width: '100%' }}>Lembre de colocar imagens que detalham bem o quarto!!</Typography>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', justifyContent: 'space-between', width: '100%' }}>

                                <Box sx={{ width: '100%' }}>
                                    <Dropzone
                                        acceptedFiles=".jpg,.jpeg,.png"
                                        multiple={true}
                                        onDrop={(acceptedFiles) => {
                                            setImageHotel(acceptedFiles)
                                            formikAccomodations.setFieldValue('quartos.image', acceptedFiles)
                                        }}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <Box
                                                {...getRootProps()}
                                                sx={{ padding: '0px 12px', border: `1px solid #C4C4C4`, borderRadius: '5px', color: blueColor, fontWeight: "bold", fontSize: "1rem", "&:hover": { cursor: "pointer" } }}
                                            >
                                                <input {...getInputProps()} />
                                                {!imageHotel ? (
                                                    <p style={{ border: '2px dashed #C4C4C4', padding: "1rem" }}>Imagem principal</p>
                                                ) : (
                                                    <FlexBetween height='51px'>
                                                        {imageHotel && imageHotel.map((i) => (
                                                            <Typography>{i.name}</Typography>
                                                        ))}
                                                        <EditOutlinedIcon sx={{ marginRight: '12px' }} />
                                                    </FlexBetween>
                                                )}
                                            </Box>
                                        )}
                                    </Dropzone>
                                    <Typography sx={{ color: 'grey', fontSize: '0.9rem' }}>Tamanho máximo permitido até 1mb</Typography>
                                </Box>

                                <Box sx={{ width: '100%' }}>
                                    <Dropzone
                                        acceptedFiles=".jpg,.jpeg,.png"
                                        multiple={false}
                                        onDrop={(acceptedFiles) => {
                                            setImagesHotel(acceptedFiles[0])
                                            formikAccomodations.setFieldValue('quartos.imageQuarto', acceptedFiles[0])
                                        }
                                        }
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <Box
                                                {...getRootProps()}
                                                sx={{ padding: '0px 12px', border: `1px solid #C4C4C4`, borderRadius: '5px', color: blueColor, fontWeight: "bold", fontSize: "1rem", "&:hover": { cursor: "pointer" } }}
                                            >
                                                <input {...getInputProps()} />
                                                {!imagesHotel ? (
                                                    <p style={{ border: '2px dashed #C4C4C4', padding: "1rem" }}>Imagens do quarto</p>
                                                ) : (
                                                    <FlexBetween height='51px'>
                                                        <Typography>{imagesHotel.name}</Typography>
                                                        <EditOutlinedIcon sx={{ marginRight: '12px' }} />
                                                    </FlexBetween>
                                                )}
                                            </Box>
                                        )}
                                    </Dropzone>
                                    <Typography sx={{ color: 'grey', fontSize: '0.9rem' }}>É permitido até 10 imagens</Typography>
                                </Box>

                                <Typography sx={{ fontSize: '1rem', color: blueColor, marginTop: '20px', width: '100%' }}>Duplo básico, duplo, duplo vista a mar lateral, duplo vista a mar, familiar, duplo básico de uso individual, familiar vista a mar e suite....</Typography>
                                <TextField
                                    name="tipoQuarto"
                                    label="Tipo de Quarto"
                                    value={formikAccomodations.values.quartos.tipoQuarto}
                                    onChange={(e) => formikAccomodations.setFieldValue('quartos.tipoQuarto', e.target.value)}
                                    variant="outlined"
                                    sx={{ width: isNonMobile ? '32%' : '100%' }}
                                    InputLabelProps={{
                                        style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                    }}
                                />

                                <TextField
                                    name="adicionais"
                                    label="Adicionais"
                                    value={formikAccomodations.values.quartos.adicional}
                                    onChange={(e) => formikAccomodations.setFieldValue('quartos.adicional', e.target.value)}
                                    variant="outlined"
                                    sx={{ width: isNonMobile ? '32%' : '100%' }}
                                    InputLabelProps={{
                                        style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                    }}
                                />

                                <TextField
                                    name="capacidade"
                                    label="Capacidade"
                                    value={formikAccomodations.values.quartos.capacidade}
                                    onChange={(e) => formikAccomodations.setFieldValue('quartos.capacidade', e.target.value)}
                                    variant="outlined"
                                    sx={{ width: isNonMobile ? '32%' : '100%' }}
                                    InputLabelProps={{
                                        style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                    }}
                                />

                                <Typography sx={{ fontSize: '1rem', color: blueColor, marginTop: '20px', width: '100%' }}>Lembra que aqui é só sobre o quarto</Typography>
                                <TextField
                                    name="valor"
                                    label="Valor"
                                    value={formikAccomodations.values.quartos.valor}
                                    onChange={(e) => formikAccomodations.setFieldValue('quartos.valor', e.target.value)}
                                    variant="outlined"
                                    sx={{ width: isNonMobile ? '32%' : '100%' }}
                                    InputLabelProps={{
                                        style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                                    }}
                                />

                                <Typography sx={{ fontSize: '1rem', color: blueColor, marginTop: '20px', width: '100%' }}>Pronto!! Agora é só clicar para cadastrar que sua hospedagem será incluída no nosso banco de dados!!</Typography>

                            </div>

                            <Button type='submit' sx={{ fontWeight: 'bold', width: '100%', height: '3rem', border: `1px solid ${blueColor}`, color: 'white', backgroundColor: blueColor, "&:hover": { color: blueColor } }}>Cadastrar Hospedagem</Button>

                        </form>
                    </TabPanel>

                    {/* ROTEIRO */}
                    <TabPanel value={value} index={2}>
                        Item Three
                    </TabPanel>
                </Box>

            </Box>
        </Box>
    )
}

export default NewProductPage;