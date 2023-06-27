import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import Navbar from "scenes/navbar";
import TextMask from 'react-text-mask';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// ICONS
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import BedIcon from '@mui/icons-material/Bed';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import { setFaseFlow, setPaymentInformation, setUser } from "state";
import moment from "moment";

const PaymentPage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [pagantes, setPagantes] = useState();

    const cartInformations = useSelector((state) => state.cart);
    const dataIda = moment(cartInformations.selectedDate.dataIda).format('DD [de] MMMM');
    const horaIda = moment(cartInformations.selectedDate.dataIda).format('HH:mm');
    const dataVolta = moment(cartInformations.selectedDate.dataVolta).format('DD [de] MMMM');
    const horaVolta = moment(cartInformations.selectedDate.dataVolta).format('HH:mm');

    const user = useSelector((state) => state.user);

    const qtdPessoas = cartInformations.packages.pessoas;

    const [viajantes, setViajantes] = useState();
    const fillFormikValues = () => {
        let listaFillFormik = [];
        for (let i = 0; i < qtdPessoas; i++) {
            listaFillFormik.push(i);
        }
        setViajantes(listaFillFormik);
    }

    const gerarCodigo = () => {
        let codigo = '#';
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * caracteres.length);
            codigo += caracteres[randomIndex];
        }

        return codigo;
    }

    const insertPaidPackage = async (obj) => {
        const response = await fetch(
            'https://deviagem-server.onrender.com/packages/insertPaidPackage',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(obj)
            }
        );

        if (response.status !== 201) {
            return false;
        } else {
            await response.json();
            return true;
        }
    }

    const [isFormValidated, setIsFormValidate] = useState(false);
    const formik = useFormik({
        initialValues: {
            ...Array.from({ length: qtdPessoas }, (_, i) => ({
                [`nomeViajante${i + 1}`]: '',
                [`sobrenomeViajante${i + 1}`]: '',
                [`cpfViajante${i + 1}`]: '',
                [`sexoViajante${i + 1}`]: '',
                [`cpfPagante${i + 1}`]: '',
            })).reduce((acc, cur) => ({ ...acc, ...cur }), {}),
            qtdPagantes: 1,
            nomeTitular: '',
            cpfTitular: '',
            celularTitular: '',
            sexoTitular: '',
            emailTitular: '',
            cartaoMask: ''
        },
        validate: values => {
            const errors = [];
            for (let i = 0; i < qtdPessoas; i++) {
                const nome = values[`nomeViajante${i + 1}`];
                const sobrenome = values[`sobrenomeViajante${i + 1}`];
                const cpf = values[`cpfViajante${i + 1}`];
                const sexo = values[`sexoViajante${i + 1}`];
                if (!nome || !sobrenome || !cpf || !sexo) {
                    errors.push([`nomeViajante${i + 1}`])
                }
            }
            const qtdPagantes = values.qtdPagantes;
            const nomeTitular = values.nomeTitular;
            const cpfTitular = values.cpfTitular;
            const celularTitular = values.cpfTitular;
            const sexoTitular = values.sexoTitular;
            const emailTitular = values.emailTitular
            if (!qtdPagantes || !nomeTitular || !cpfTitular || !celularTitular || !sexoTitular || !emailTitular) {
                errors.push(nomeTitular)
            }

            if (errors.length > 0) {
                setIsFormValidate(false)
            } else {
                setIsFormValidate(true)
            }
        },
        onSubmit: values => {
            if (isFormValidated) {
                let objFinal = {
                    cpf: user.cpf,
                    formValues: values,
                    cartInformations,
                    codigo: gerarCodigo(),
                    listaCpfPago: [values.cpfTitular],
                    listaCpfPendente: [],
                    valorTotal: cartInformations.valorFinal,
                    valorPago: parseFloat(cartInformations.valorFinal / pagantes).toFixed(2)
                }

                for (let i = 0; i < values.qtdPagantes - 1; i++) {
                    const pagante = { cpf: values[`cpfPagante${i + 1}`], nome: values[`nomePagante${i + 1}`] }
                    objFinal.listaCpfPendente.push(pagante);
                }

                const newUser = {
                    ...user,
                    activities: [...user.activities, objFinal]
                }

                dispatch(setUser({ user: newUser }));

                const req = insertPaidPackage(objFinal);
                if (req) {
                    dispatch(setPaymentInformation({ paymentInformations: objFinal }))
                    navigate('/packages/cart/checkout/success')
                } else {
                    alert('Não foi possível finalizar seu pedido.')
                }
            } else if (!user) {
                alert('Você deve estar logado no sistema para prosseguir')
            } else {
                alert('Por favor, preencha todos os campos corretamente.')
            }
        }
    })

    const renderFormViajantes = () => {
        return <Box>
            {viajantes && viajantes.map((viajante) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '24px', color: blueColor }}>Viajante {viajante + 1} - Adulto</Typography>

                    <Box>
                        <TextField
                            sx={{ width: '100%' }}
                            label='Primeiro nome*'
                            onChange={(e) => formik.setFieldValue(`nomeViajante${viajante + 1}`, e.target.value)}
                            name="primeiroNome"
                            InputProps={{
                                style: { backgroundColor: "white", borderRadius: "4px" },
                            }}
                            InputLabelProps={{
                                style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                            }}
                        />
                        {formik.touched[`nomeViajante${viajante + 1}`] && !formik.values[`nomeViajante${viajante + 1}`] && (
                            <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                        )}
                    </Box>

                    <Box>
                        <TextField
                            sx={{ width: '100%' }}
                            label='Ultimo sobrenome*'
                            name="ultimoSobrenome"
                            onChange={(e) => formik.setFieldValue(`sobrenomeViajante${viajante + 1}`, e.target.value)}
                            InputProps={{
                                style: { backgroundColor: "white", borderRadius: "4px" },
                            }}
                            InputLabelProps={{
                                style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                            }}
                        />
                        {formik.touched[`sobrenomeViajante${viajante + 1}`] && !formik.values[`sobrenomeViajante${viajante + 1}`] && (
                            <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                        )}
                    </Box>


                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '2rem' }}>
                        <Box sx={{ width: '47%' }}>
                            <TextField
                                sx={{ width: '100%' }}
                                label='CPF*'
                                name="cpf"
                                onChange={(e) => formik.setFieldValue(`cpfViajante${viajante + 1}`, e.target.value)}
                                InputProps={{
                                    style: { backgroundColor: "white", borderRadius: "4px" },
                                    inputComponent: TextMask,
                                    inputProps: {
                                        mask: cpfMask,
                                        autoComplete: "off",
                                        autoCorrect: "off",
                                        spellCheck: "false"
                                    }
                                }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                                }}
                            />
                            {
                                formik.touched[`cpfViajante${viajante + 1}`] && !formik.values[`cpfViajante${viajante + 1}`] && (
                                    <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                                )
                            }
                        </Box>

                        <FormControl sx={{ width: '47%' }}>
                            <InputLabel sx={{ color: blueColor, fontWeight: "200", fontSize: "1rem" }}>Sexo</InputLabel>
                            <Select
                                value={formik.values[`sexoViajante${viajante + 1}`]}
                                label="Age"
                                onChange={(e) => formik.setFieldValue(`sexoViajante${viajante + 1}`, e.target.value)}
                            >
                                <MenuItem value='masculino' name='masculino'>Masculino</MenuItem>
                                <MenuItem value='feminino' name='feminino'>Feminino</MenuItem>
                            </Select>
                            {formik.touched[`sexoViajante${viajante + 1}`] && !formik.values[`sexoViajante${viajante + 1}`] && (
                                <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                            )}
                        </FormControl>
                    </Box>
                </Box>
            ))}
        </Box>
    }

    const renderFormCpfPagantes = (qtdViajantes) => {
        let listaViajantes = []
        for (let i = 0; i < qtdViajantes - 1; i++) {
            listaViajantes.push(i)
        }

        return <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {listaViajantes.map((viajante) => (
                <Box sx={{ display: 'flex', gap: '1rem' }}>
                    <TextField
                        sx={{ width: '100%' }}
                        label={`Cpf do pagante Nº ${viajante + 2}`}
                        name="cpf"
                        onChange={(e) => formik.setFieldValue(`cpfPagante${viajante + 1}`, e.target.value)}
                        InputProps={{
                            style: { backgroundColor: "white", borderRadius: "4px" },
                            inputComponent: TextMask,
                            inputProps: {
                                mask: cpfMask,
                                autoComplete: "off",
                                autoCorrect: "off",
                                spellCheck: "false"
                            }
                        }}
                        InputLabelProps={{
                            style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                        }}
                    />
                    {
                        formik.touched[`cpfPagante${viajante + 1}`] && !formik.values[`cpfPagante${viajante + 1}`] && (
                            <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                        )
                    }

                    <TextField
                        sx={{ width: '100%' }}
                        label={`Nome do pagante Nº ${viajante + 2}`}
                        name="nome"
                        onChange={(e) => formik.setFieldValue(`nomePagante${viajante + 1}`, e.target.value)}
                        InputProps={{
                            style: { backgroundColor: "white", borderRadius: "4px" }
                        }}
                        InputLabelProps={{
                            style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                        }}
                    />
                    {
                        formik.touched[`nomePagante${viajante + 1}`] && !formik.values[`nomePagante${viajante + 1}`] && (
                            <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                        )
                    }
                </Box>
            ))}
        </Box>
    }

    useEffect(() => {
        console.log(cartInformations)
        fillFormikValues()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // CARD
    const [cardType, setCardType] = useState('');
    const [cardNumber, setCardNumber] = useState('')
    const getCardType = (cardNumber) => {
        if (/^5[1-5]/.test(cardNumber)) {
            setCardType('Mastecard');
        } else if (/^4/.test(cardNumber)) {
            setCardType('Visa')
        } else if (/^3[47]/.test(cardNumber)) {
            setCardType('American Express')
            return "American Express";
        } else if (/^3(?:0[0-5]|[68][0-9])/.test(cardNumber)) {
            setCardType('Diners Club')
        } else if (/^6(?:011|5[0-9]{2}|4[0-9]{3}|2[2-7][0-9]{2}|2[89][0-9]{1})/.test(cardNumber)) {
            setCardType('Discover')
        } else {
            setCardType('Bandeira não encontrada')
        }
    }
    const isValidCreditCardNumber = (cardNumber) => {
        if (cardNumber.length < 12 || cardNumber.length > 19) {
            return false;
        }

        if (!/^\d+$/.test(cardNumber)) {
            return false;
        }

        let sum = 0;
        let doubleUp = false;
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let curDigit = parseInt(cardNumber.charAt(i));
            if (doubleUp) {
                if ((curDigit *= 2) > 9) curDigit -= 9;
            }
            sum += curDigit;
            doubleUp = !doubleUp;
        }

        if (sum % 10 === 0) {
            getCardType(cardNumber)
            return true
        };
    }
    const handleCardNumberChange = (event) => {
        let newCardNumber = event.target.value.replace(/[^\d]/g, '');
        newCardNumber = newCardNumber.replace(/(\d{4})/g, '$1 ').trim();
        if (newCardNumber.length > 12) {
            event.preventDefault();
        }
        setCardNumber(newCardNumber);
        if (newCardNumber.length === 19) {
            const mascara = 'X'.repeat(newCardNumber.length - 4) + newCardNumber.substring(newCardNumber.length - 4);
            formik.setFieldValue('cartaoMask', mascara)
        }
        isValidCreditCardNumber(newCardNumber)
    }
    function handleKeyPress(event) {
        const regex = /(\d{1,4})/g;
        const key = event.key;

        if (event.target.value.length === 19 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
        } else if (!regex.test(key)) {
            event.preventDefault();
        }
    }

    const [securityCode, setSecurityCode] = useState();

    const [month, setMonth] = useState();
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

    const [year, setYear] = useState();
    const years = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036']

    // PHONE
    const phoneMask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    // CPF
    const cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

    const imagemStyle = {
        backgroundImage: `url(https://deviagem-server.onrender.com/assets/${cartInformations.selectedCard.cards.imageQuarto})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: '10px',
        width: "100%",
        height: "21vh"
    };

    const handleClickLogin = () => {
        dispatch(setFaseFlow({ faseFlow: 1 }))
        navigate('/login')
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center", backgroundColor: '#DCE0E6' }}>
            <Navbar />

            <Box sx={{ width: isNonMobile ? '65%' : '100%', padding: '20px 0', backgroundColor: '#DCE0E6', display: 'flex', gap: isNonMobile ? '0px' : '1.5rem', flexDirection: isNonMobile ? 'row' : 'column', justifyContent: 'space-between', height: 'auto', margin: '10px' }}>

                <Box sx={{ width: isNonMobile ? '52%' : '100%', backgroundColor: 'white', height: 'auto', borderRadius: isNonMobile ? '20px' : '4px', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', padding: '30px' }}>
                    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Typography sx={{ border: `2px solid ${blueColor}`, borderRadius: '50%', width: '30px', height: '30px', color: blueColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>1</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor }}>Viajantes</Typography>
                    </Box>
                    <hr style={{ width: '100%', color: blueColor }} />

                    <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
                        {renderFormViajantes()}
                        <Typography sx={{ marginTop: '-50px', textAlign: 'justify' }}>Os viajantes devem apresentar documento com foto no aeroporto e no check-in da hospedagem</Typography>
                        <Box>
                            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Typography sx={{ border: `2px solid ${blueColor}`, borderRadius: '50%', width: '30px', height: '30px', color: blueColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>2</Typography>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor }}>Dados de Pagamento</Typography>
                            </Box>
                            <hr style={{ width: '100%', color: blueColor }} />
                        </Box>

                        <FormControl fullWidth>
                            <InputLabel sx={{ color: blueColor, fontWeight: "200", fontSize: "1rem" }}>Quantos Pagantes ?</InputLabel>
                            <Select
                                value={pagantes ? pagantes : ''}
                                label="Quantos Pagantes ?"
                                onChange={(e) => { setPagantes(e.target.value); formik.setFieldValue('qtdPagantes', e.target.value) }}
                            >
                                {viajantes && viajantes.map((viajante, index) => (
                                    <MenuItem key={index} value={viajante + 1}>{viajante + 1}</MenuItem>
                                ))}
                            </Select>
                            <Typography sx={{ textAlign: 'justify' }}>Se a quantidade de pagantes for mais que uma pessoa, será gerado um código ao finalizar sua compra, com esse código a(s) outra(s) pessoa(s) pode(em) finalizar o pagamento.</Typography>
                        </FormControl>

                        {pagantes > 1 && (
                            renderFormCpfPagantes(pagantes)
                        )}

                        <Typography sx={{ fontWeight: 'bold', fontSize: '24px', color: blueColor }}>Cartão de crédito</Typography>

                        <TextField
                            sx={{ width: '100%' }}
                            label='Número do Cartão'
                            name="numeroCartao"
                            value={cardNumber}
                            onKeyPress={handleKeyPress}
                            onChange={handleCardNumberChange}
                            InputProps={{
                                style: { backgroundColor: "white", borderRadius: "4px" },
                            }}
                            InputLabelProps={{
                                style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                            }}
                        />
                        {formik.touched.cardNumber && !formik.values.cardNumber && (
                            <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                        )}

                        <TextField
                            sx={{ width: '100%' }}
                            label='Bandeira'
                            disabled
                            name="Bandeira"
                            value={cardType}
                            InputProps={{
                                style: { backgroundColor: "white", borderRadius: "4px" },
                            }}
                            InputLabelProps={{
                                style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                            }}
                        />

                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                            <FormControl sx={{ width: '30%' }}>
                                <InputLabel sx={{ color: blueColor, fontWeight: "200", fontSize: "1rem" }}>Mês de validade</InputLabel>
                                <Select
                                    value={month ? month : ''}
                                    label="Mês"
                                    onChange={(e) => setMonth(e.target.value)}
                                >
                                    {months.map((y) => (
                                        <MenuItem value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {formik.touched.month && !formik.values.month && (
                                <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                            )}

                            <FormControl sx={{ width: '30%' }}>
                                <InputLabel sx={{ color: blueColor, fontWeight: "200", fontSize: "1rem" }}>Ano de validade</InputLabel>
                                <Select
                                    value={year ? year : ''}
                                    label="Ano"
                                    onChange={(e) => setYear(e.target.value)}
                                >
                                    {years.map((y) => (
                                        <MenuItem value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {formik.touched.year && !formik.values.year && (
                                <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                            )}

                            <TextField
                                sx={{ width: '30%' }}
                                label='Cod. Segurança*'
                                name="Cod. Segurança"
                                value={securityCode}
                                onChange={(e) => setSecurityCode(e.target.value)}
                                InputProps={{
                                    style: { backgroundColor: "white", borderRadius: "4px" },
                                }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                                }}
                            />
                            {formik.touched.securityCode && !formik.values.securityCode && (
                                <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                            )}
                        </Box>

                        <Typography sx={{ fontWeight: 'bold', fontSize: '24px', color: blueColor }}>Informações do Titular do Cartão</Typography>

                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} >
                            <Box sx={{ width: '60%' }}>
                                <TextField
                                    sx={{ width: '100%' }}
                                    label='Nome completo*'
                                    name="nomeCompleto"
                                    onChange={(e) => formik.setFieldValue('nomeTitular', e.target.value)}
                                    InputProps={{
                                        style: { backgroundColor: "white", borderRadius: "4px" },
                                    }}
                                    InputLabelProps={{
                                        style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                                    }}
                                />
                                {formik.touched.nomeTitular && !formik.values.nomeTitular && (
                                    <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                                )}
                            </Box>

                            <Box sx={{ width: '38%' }}>
                                <TextField
                                    sx={{ width: '100%' }}
                                    label='CPF*'
                                    name="cpf"
                                    onChange={(e) => formik.setFieldValue('cpfTitular', e.target.value)}
                                    InputProps={{
                                        style: { backgroundColor: "white", borderRadius: "4px" },
                                        inputComponent: TextMask,
                                        inputProps: {
                                            mask: cpfMask,
                                            autoComplete: "off",
                                            autoCorrect: "off",
                                            spellCheck: "false"
                                        }
                                    }}
                                    InputLabelProps={{
                                        style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                                    }}
                                />
                                {formik.touched.cpfTitular && !formik.values.cpfTitular && (
                                    <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} >
                            <Box sx={{ width: '48%' }}>
                                <TextField
                                    sx={{ width: '100%' }}
                                    label='Celular*'
                                    name="celular"
                                    onChange={(e) => formik.setFieldValue('celularTitular', e.target.value)}
                                    InputProps={{
                                        style: { backgroundColor: "white", borderRadius: "4px" },
                                        inputComponent: TextMask,
                                        inputProps: {
                                            mask: phoneMask,
                                            autoComplete: "off",
                                            autoCorrect: "off",
                                            spellCheck: "false"
                                        }
                                    }}
                                    InputLabelProps={{
                                        style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                                    }}
                                />
                                {formik.touched.celularTitular && !formik.values.celularTitular && (
                                    <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                                )}
                            </Box>

                            <FormControl sx={{ width: '50%' }}>
                                <InputLabel id="demo-simple-select-label" sx={{ color: blueColor, fontWeight: "200", fontSize: "1rem" }}>Sexo</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formik.values.sexoTitular}
                                    label="Age"
                                    onChange={(e) => formik.setFieldValue('sexoTitular', e.target.value)}
                                >
                                    <MenuItem value='masculino' name='masculino'>Masculino</MenuItem>
                                    <MenuItem value='feminino' name='feminino'>Feminino</MenuItem>
                                </Select>
                            </FormControl>
                            {formik.touched.genderTitular && !formik.values.genderTitular && (
                                <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                            )}
                        </Box>

                        <Box>
                            <TextField
                                sx={{ width: '100%' }}
                                label='Email*'
                                name="email"
                                onChange={(e) => formik.setFieldValue('emailTitular', e.target.value)}
                                InputProps={{
                                    style: { backgroundColor: "white", borderRadius: "4px" },
                                }}
                                InputLabelProps={{
                                    style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                                }}
                            />
                            {formik.touched.emailTitular && !formik.values.emailTitular && (
                                <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                            )}
                        </Box>

                        {!user && (
                            <Box>
                                <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <Typography sx={{ border: `2px solid ${blueColor}`, borderRadius: '50%', width: '30px', height: '30px', color: blueColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>3</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor }}>Cadastre-se no nosso sistema</Typography>
                                </Box>
                                <hr style={{ width: '100%', color: blueColor }} />

                                <Typography sx={{ fontSize: '17px', textAlign: 'justify' }}>Percebemos que você ainda não está logado no nosso sistema, faça o cadastro ou entre com sua conta para prosseguir.</Typography>
                                <Box sx={{ display: 'flex', gap: '1rem', height: '50px', marginTop: '20px' }}>
                                    <Button onClick={() => handleClickLogin()} fullWidth sx={{ fontWeight: 'bold', backgroundColor: blueColor, border: `1px solid ${blueColor}`, color: 'white', '&:hover': { backgroundColor: 'white', color: blueColor } }}>Entrar</Button>
                                </Box>
                            </Box>
                        )}

                    </form>

                </Box>

                <Box sx={{ width: isNonMobile ? '42%' : '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Box sx={{ width: '100%', backgroundColor: 'white', height: 'auto', borderRadius: isNonMobile ? '20px' : '4px', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', padding: '30px', color: blueColor }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30px' }}>{cartInformations.selectedCard.cards.nomeLocal}</Typography>
                        <hr style={{ color: 'white', width: '100%' }} />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}> <LocationOnIcon sx={{ color: blueColor }} />{cartInformations.packages.destino}</Typography>
                        <hr style={{ color: 'white', width: '100%' }} />

                        <Box sx={{ display: 'flex', marginTop: '14px' }}>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><LoginIcon />Check-in até</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{moment(dataIda + ' ' + horaIda, 'DD [de] MMMM [às] HH:mm').add(6, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                            </Box>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><LogoutIcon />Check-out até</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{moment(dataVolta + ' ' + horaVolta, 'DD [de] MMMM [às] HH:mm').add(6, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', marginTop: '14px' }}>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><PeopleIcon />Hóspedes</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{cartInformations.packages.pessoas} Pessoa(s)</Typography>
                            </Box>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><BedIcon />Estadia</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{cartInformations.selectedDate.diffDays} diárias</Typography>
                            </Box>
                        </Box>

                        <hr style={{ width: '100%' }} />

                        <Box style={imagemStyle}></Box>
                    </Box>

                    <Box sx={{ width: '100%', backgroundColor: 'white', height: 'auto', borderRadius: isNonMobile ? '20px' : '4px', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', padding: '30px', color: blueColor }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30px' }}>Vôo</Typography>
                        <hr style={{ color: 'white', width: '100%' }} />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}> <TripOriginIcon />Partindo de {cartInformations.estado.nome} - Operado por Aviadora Interna</Typography>
                        <hr style={{ color: 'white', width: '100%' }} />

                        <Box sx={{ display: 'flex', marginTop: '14px' }}>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CalendarMonthIcon />Data de ida</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{dataIda}</Typography>
                            </Box>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CalendarMonthIcon />Data de volta</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{dataVolta}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ width: '100%', backgroundColor: 'white', height: 'auto', borderRadius: isNonMobile ? '20px' : '4px', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', padding: '30px', color: blueColor }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30px' }}>Detalhes do pagamento</Typography>
                        <hr style={{ width: '100%' }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '20px' }}>Hotél</Typography>
                                <Typography sx={{ fontSize: '20px' }}>R$ {cartInformations.selectedCard.cards.valor}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '20px' }}>Diaria</Typography>
                                <Typography sx={{ fontSize: '20px' }}>{cartInformations.selectedCard.diffDays} dias</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '20px' }}>Total Hotel</Typography>
                                <Typography sx={{ fontSize: '20px' }}>R$ {cartInformations.selectedCard.diffDays * cartInformations.selectedCard.cards.valor}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '20px' }}>Vôo</Typography>
                                <Typography sx={{ fontSize: '20px' }}>R$ {cartInformations.valorPassagem}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '20px' }}>Taxas e impostos</Typography>
                                <Typography sx={{ fontSize: '20px' }}>R$0,00</Typography>
                            </Box>

                            {pagantes > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontSize: '20px' }}>Pagantes</Typography>
                                    <Typography sx={{ fontSize: '20px' }}>{pagantes}</Typography>
                                </Box>
                            )}

                        </Box>

                        <hr style={{ width: '100%' }} />

                        {pagantes > 1 ? (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Sua parte</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>R${(cartInformations.valorFinal / pagantes).toFixed(2)}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>O restante</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>R${(cartInformations.valorFinal - (cartInformations.valorFinal / pagantes)).toFixed(2)}</Typography>
                                </Box>

                                <hr style={{ width: '100%' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Total</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>R${(cartInformations.valorFinal).toFixed(2)}</Typography>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Total</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>R${(cartInformations.valorFinal).toFixed(2)}</Typography>
                                </Box>
                            </>
                        )}

                        <Typography sx={{ textAlign: 'justify', margin: '10px 0px' }}>As tarifas cotadas em reais são baseadas nas taxas de câmbio atuais e podem variar até o momento da viagem.</Typography>

                        <Button onClick={() => formik.handleSubmit()} sx={{ fontWeight: 'bold', border: `1px solid ${blueColor}`, width: '100%', textAlign: 'center', padding: '20px', backgroundColor: blueColor, color: 'white', '&:hover': { border: `1px solid ${blueColor}`, color: blueColor } }}>Reservar</Button>

                    </Box>
                </Box>


            </Box >
        </Box >
    )
}

export default PaymentPage;