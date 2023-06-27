import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import Navbar from "scenes/navbar";
import TextMask from 'react-text-mask';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// ICONS
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import BedIcon from '@mui/icons-material/Bed';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import { setPaymentInformation } from "state";

const CompletePaymentPage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartInformations = useSelector((state) => state.cart.pack.cartInformations);
    const formValues = useSelector((state) => state.cart.pack.formValues);
    const codigo = useSelector((state) => state.cart.pack.codigo);
    const valorTotal = useSelector((state) => state.cart.pack.valorTotal);
    const valorPago = useSelector((state) => state.cart.pack.valorPago);
    const listaCpfPago = useSelector((state) => state.cart.pack.listaCpfPago);
    const listaCpfPendente = useSelector((state) => state.cart.pack.listaCpfPendente);

    const qtdPessoas = cartInformations.packages.pessoas;

    const [isFormValidated, setIsFormValidate] = useState(false);

    const updatePaidPackage = async (listaPendenteAtualizada, listaCpfPagoAtualizada, valorPagoAtualizado) => {

        const objFinalUpdate = {
            codigo,
            listaCpfPago: listaCpfPagoAtualizada,
            listaCpfPendente: listaPendenteAtualizada,
            valorPago: valorPagoAtualizado,
            valorTotal: valorTotal.toFixed(2)
        }

        const response = await fetch(
            'https://deviagem-server.onrender.com/packages/updatePaidPackage', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objFinalUpdate)
        }
        )

        if (response.status !== 200) {
            return false;
        } else {
            await response.json();
            return true;
        }
    }

    const formik = useFormik({
        initialValues: {
            nomeTitular: '',
            cpfTitular: '',
            celularTitular: '',
            sexoTitular: '',
            emailTitular: '',
            cartao: '',
            month: '',
            year: '',
            code: ''
        },
        validate: values => {
            let errors = []
            if (
                !values.nomeTitular ||
                !values.cpfTitular ||
                !values.celularTitular ||
                !values.sexoTitular ||
                !values.emailTitular ||
                !values.cartao ||
                !values.month ||
                !values.year ||
                !values.code) {
                errors.push(values.nomeTitular)
            }

            if (errors.length > 0) {
                setIsFormValidate(false);
            } else {
                setIsFormValidate(true);
            }
        },
        onSubmit: values => {
            if (isFormValidated) {
                const match = listaCpfPendente.find((i) => i.cpf === values.cpfTitular);
                if (match) {
                    const listaPendenteAtualizada = listaCpfPendente.filter(cpf => cpf.cpf !== values.cpfTitular);
                    const listaCpfPagoAtualizada = [...listaCpfPago, { cpf: values.cpfTitular, nome: values.nomeTitular }]
                    const valorPagoAtualizado = valorPago + (valorTotal.toFixed(2) / qtdPessoas)

                    const responseUpdate = updatePaidPackage(listaPendenteAtualizada, listaCpfPagoAtualizada, valorPagoAtualizado)

                    let objFinal = {
                        formValues,
                        cartInformations,
                        codigo,
                        listaCpfPago: listaCpfPagoAtualizada,
                        listaCpfPendente: listaPendenteAtualizada,
                        valorTotal: valorTotal.toFixed(2),
                        valorPago: valorPagoAtualizado
                    }

                    if (responseUpdate) {
                        dispatch(setPaymentInformation({ paymentInformations: objFinal }))
                        navigate('/packages/cart/checkout/completePayment/success')
                    } else {
                        alert('Não foi possível finalizar seu pagamento')
                    }

                } else {
                    alert('CPF do titular não confere com o CPF informado anteriormente')
                }
            } else {
                alert('Preencha todos os campos para prosseguir')
            }
        }
    })

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
            formik.setFieldValue('cartao', mascara)
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

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center", backgroundColor: '#DCE0E6' }}>
            <Navbar />

            <Box sx={{ width: isNonMobile ? '65%' : '100%', padding: '20px 0', backgroundColor: '#DCE0E6', display: 'flex', gap: isNonMobile ? '0px' : '1.5rem', flexDirection: isNonMobile ? 'row' : 'column', justifyContent: 'space-between', height: 'auto', margin: '10px' }}>

                <Box sx={{ width: isNonMobile ? '52%' : '100%', backgroundColor: 'white', height: '100%', borderRadius: '20px', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', padding: '30px' }}>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>

                        <Box>
                            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Typography sx={{ border: `2px solid ${blueColor}`, borderRadius: '50%', width: '30px', height: '30px', color: blueColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>1</Typography>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor }}>Dados de Pagamento</Typography>
                            </Box>
                            <hr style={{ width: '100%', color: blueColor }} />
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
                                <InputLabel sx={{ color: blueColor, fontWeight: "200", fontSize: "1rem" }}>Sexo</InputLabel>
                                <Select
                                    value={formik.values.sexoTitular}
                                    label="Age"
                                    onChange={(e) => formik.setFieldValue('sexoTitular', e.target.value)}
                                >
                                    <MenuItem value='masculino' name='masculino'>Masculino</MenuItem>
                                    <MenuItem value='feminino' name='feminino'>Feminino</MenuItem>
                                </Select>
                                {formik.touched.sexoTitular && !formik.values.sexoTitular && (
                                    <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                                )}
                            </FormControl>

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
                            <Typography sx={{ textAlign: 'justify' }}>Será enviado as informações da viagem para este email</Typography>
                        </Box>

                        <Typography sx={{ fontWeight: 'bold', fontSize: '24px', color: blueColor }}>Cartão de crédito</Typography>

                        <Box>
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
                            {formik.touched.cartao && !formik.values.cartao && (
                                <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                            )}
                        </Box>

                        <Box>
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
                        </Box>

                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                            <FormControl sx={{ width: '30%' }}>
                                <InputLabel sx={{ color: blueColor, fontWeight: "200", fontSize: "1rem" }}>Mês de validade</InputLabel>
                                <Select
                                    value={month ? month : ''}
                                    label="Mês"
                                    onChange={(e) => { setMonth(e.target.value); formik.setFieldValue('month', e.target.value) }}
                                >
                                    {months.map((y) => (
                                        <MenuItem value={y}>{y}</MenuItem>
                                    ))}
                                </Select>

                                {formik.touched.month && !formik.values.month && (
                                    <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                                )}
                            </FormControl>

                            <FormControl sx={{ width: '30%' }}>
                                <InputLabel sx={{ color: blueColor, fontWeight: "200", fontSize: "1rem" }}>Ano de validade</InputLabel>
                                <Select
                                    value={year ? year : ''}
                                    label="Ano"
                                    onChange={(e) => { setYear(e.target.value); formik.setFieldValue('year', e.target.value) }}
                                >
                                    {years.map((y) => (
                                        <MenuItem value={y}>{y}</MenuItem>
                                    ))}
                                </Select>

                                {formik.touched.year && !formik.values.year && (
                                    <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                                )}
                            </FormControl>

                            <Box sx={{ width: '30%' }}>
                                <TextField
                                    sx={{ width: '100%' }}
                                    label='Cod. Segurança*'
                                    name="Cod. Segurança"
                                    value={securityCode}
                                    onChange={(e) => { setSecurityCode(e.target.value); formik.setFieldValue('code', e.target.value) }}
                                    InputProps={{
                                        style: { backgroundColor: "white", borderRadius: "4px" },
                                    }}
                                    InputLabelProps={{
                                        style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                                    }}
                                />
                                {formik.touched.code && !formik.values.code && (
                                    <Typography sx={{ color: 'red' }}>Por favor, preencha este campo</Typography>
                                )}
                            </Box>
                        </Box>
                        <Typography>Contamos com um sistema de proteção de dados verificado </Typography>

                    </form>

                </Box>

                <Box sx={{ width: isNonMobile ? '42%' : '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Box sx={{ width: '100%', backgroundColor: 'white', height: 'auto', borderRadius: '20px', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', padding: '30px', color: blueColor }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30px' }}>{cartInformations.selectedCard.cards.nomeLocal}</Typography>
                        <hr style={{ color: 'white', width: '100%' }} />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}> <LocationOnIcon sx={{ color: blueColor }} />{cartInformations.packages.destino}</Typography>
                        <hr style={{ color: 'white', width: '100%' }} />

                        <Box sx={{ display: 'flex', marginTop: '14px' }}>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><LoginIcon />Check-in</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{cartInformations.estado.dias[cartInformations.selectedDate].dataIda}</Typography>
                            </Box>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><LogoutIcon />Check-out</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{cartInformations.estado.dias[cartInformations.selectedDate].dataVolta}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', marginTop: '14px' }}>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><PeopleIcon />Hóspedes</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{cartInformations.packages.pessoas} Pessoa(s)</Typography>
                            </Box>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><BedIcon />Estadia</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{cartInformations.estado.dias[cartInformations.selectedDate].diffdays} diárias</Typography>
                            </Box>
                        </Box>

                        <hr style={{ width: '100%' }} />

                        <Box style={imagemStyle}></Box>
                    </Box>

                    <Box sx={{ width: '100%', backgroundColor: 'white', height: 'auto', borderRadius: '20px', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', padding: '30px', color: blueColor }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30px' }}>Vôo</Typography>
                        <hr style={{ color: 'white', width: '100%' }} />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}> <TripOriginIcon />Partindo de {cartInformations.estado.nome} - Operado por Aviadora Interna</Typography>
                        <hr style={{ color: 'white', width: '100%' }} />

                        <Box sx={{ display: 'flex', marginTop: '14px' }}>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CalendarMonthIcon />Data de ida</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{cartInformations.estado.dias[cartInformations.selectedDate].dataIda}</Typography>
                            </Box>
                            <Box sx={{ width: '50%' }}>
                                <Typography sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CalendarMonthIcon />Data de volta</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{cartInformations.estado.dias[cartInformations.selectedDate].dataVolta}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ width: '100%', backgroundColor: 'white', height: 'auto', borderRadius: '20px', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', padding: '30px', color: blueColor }}>
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


                        </Box>

                        <hr style={{ width: '100%' }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Total</Typography>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>R${valorTotal.toFixed(2)}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '20px' }}>Valor pago</Typography>
                            <Typography sx={{ fontSize: '20px' }}>R${valorPago.toFixed(2)}</Typography>
                        </Box>

                        <hr style={{ width: '100%' }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Sua parte</Typography>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>R${valorTotal.toFixed(2) / qtdPessoas}</Typography>
                        </Box>

                        <Typography sx={{ textAlign: 'justify', margin: '10px 0px' }}>As tarifas cotadas em reais são baseadas nas taxas de câmbio atuais e podem variar até o momento da viagem.</Typography>

                        <Button onClick={() => formik.handleSubmit()} sx={{ fontWeight: 'bold', border: `1px solid ${blueColor}`, width: '100%', textAlign: 'center', padding: '20px', backgroundColor: blueColor, color: 'white', '&:hover': { border: `1px solid ${blueColor}`, color: blueColor } }}>Finalizar meu pagamento</Button>

                    </Box>
                </Box>


            </Box >
        </Box >
    )
}

export default CompletePaymentPage;