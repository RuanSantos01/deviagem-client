import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Tab, Tabs, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import PhoneInput from 'components/phoneInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { setCart } from 'state';
import { setPaymentInformation } from 'state';
import ReactInputMask from 'react-input-mask';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
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
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const CpfMask = (props) => {
    return (
        <ReactInputMask
            {...props}
            mask="999.999.999-99"
            placeholderChar={'\u2000'}
            maskChar={null}
        />
    );
};

const ActivitesPage = () => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:700px)");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);

    const [userFetch, setUserFetch] = useState();
    const fetchUser = async (cpf) => {
        const user = await fetch(`https://deviagem-server.onrender.com/auth/getUser/${cpf}`, {
            method: 'GET'
        })

        const userResponse = await user.json();

        if (user.ok && userResponse) {
            setUserFetch(userResponse.user);
        }
    }

    useEffect(() => {
        fetchUser(user.cpf)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const [value, setValue] = useState(0);

    const handleChangeTabs = (event, newValue) => {
        setValue(newValue);
    };

    const formik = useFormik({
        initialValues: {
            fullName: user.fullName,
            email: user.email,
            password: "",
            confirmPassword: "",
            gender: user.gender,
            phone: user.phone,
            birthDate: user.birthDate
        },
        onSubmit: values => {
            const obj = {
                _id: user._id,
                fullName: values.fullName,
                email: values.email,
                phone: values.phone
            }

            updateUser(obj);
        }
    })

    const handleChange = (e) => {
        formik.setFieldValue('phone', e)
    }

    const updateUser = async (data) => {

        const response = await fetch(
            'https://deviagem-server.onrender.com/auth/updateUser', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        )

        if (response.status !== 200) {
            alert('Erro ao alterar dados do usuário')
        } else {
            alert('Dados alterados com sucesso!')
        }
    }

    const updatePassword = async (data) => {
        const response = await fetch(
            'https://deviagem-server.onrender.com/auth/updatePassword', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (response.status === 505) {
            alert('Senha original informada está incorreta')
        } else if (response.status === 200) {
            alert('Senha alterada com sucesso!')
        } else {
            alert('Houve um erro ao atualizar sua senha')
        }
    }

    const formikPassword = useFormik({
        initialValues: {
            password: '',
            newPassword: '',
            confirmNewPassword: ''
        },
        onSubmit: values => {
            console.log(values)
            if (values.newPassword !== values.confirmNewPassword) {
                return alert('Senhas não coincidem')
            } else {
                const obj = {
                    ...values,
                    _id: user._id
                }

                updatePassword(obj)
            }

        }
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPassword1 = () => setShowPassword1((show1) => !show1);
    const handleClickShowPassword2 = () => setShowPassword2((show2) => !show2);

    const handleClickButton = (e) => {
        dispatch(setCart({ cart: e.cartInformations }))
        dispatch(setPaymentInformation({ paymentInformations: e }))
        navigate("/packages/cart/checkout/success")
    }

    const [userSelected, setUserSelected] = useState();
    const getUserSelected = async (cpf) => {
        const response = await fetch(`https://deviagem-server.onrender.com/auth/getUser/${cpf}`, {
            method: 'GET'
        })

        if (response.status !== 200) {
            alert('Usuário não encontrado')
        } else {
            const user = await response.json();
            setUserSelected(user);
        }
    }

    const [cpfSemFormatacao, setCpfSemFormatacao] = useState();
    const formikAdmin = useFormik({
        initialValues: {
            cpf: ''
        },
        onSubmit: values => {
            const cpfSemFormatacaoR = values.cpf.replace(/\D/g, '');
            setCpfSemFormatacao(cpfSemFormatacaoR);
            getUserSelected(cpfSemFormatacaoR);
        }
    })

    const [selectAcessLevel, setSelectAcessLevel] = useState();
    const handleSelectChange = (e) => {
        setSelectAcessLevel(e.target.value)
    }

    const handleSubmitAcessLevel = async () => {
        const body = {
            accessLevel: selectAcessLevel,
            cpf: cpfSemFormatacao
        }

        const response = await fetch("https://deviagem-server.onrender.com/auth/updateAcessLevel", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        if (response.status === 200) {
            alert('Status atualizado com sucesso!')
        } else {
            alert('Erro ao atualizar status')
        }
        setUserSelected(null)
    }

    return (
        <Box sx={{ width: '100%', overflow: isNonMobile ? '' : 'hidden', height: '100%', display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', backgroundColor: isNonMobile ? '#DCE0E6' : 'white' }}>
            <Navbar />

            {isNonMobile ? (
                <Box sx={{ width: isNonMobile ? '65%' : '98%', height: '100%', marginTop: '20px', borderRadius: '10px', boxShadow: '0px 0px 5px rgba(0,0,0,0.4)', padding: '20px', display: 'flex', justifyContent: 'space-around' }}>
                    <Box
                        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 'auto', borderRadius: '10px', }}
                    >
                        <Tabs
                            orientation={"vertical"}
                            value={value}
                            onChange={handleChangeTabs}
                            sx={{ borderRight: 1, borderColor: 'divider', width: '25%' }}
                        >
                            <Tab label="Perfil" {...a11yProps(0)} sx={{ fontWeight: 'bold', color: blueColor }} />
                            <Tab label="Segurança" {...a11yProps(1)} sx={{ fontWeight: 'bold', color: blueColor }} />
                            <Tab label="Atividades" {...a11yProps(2)} sx={{ fontWeight: 'bold', color: blueColor }} />
                            {user.accessLevel === "admin" && (
                                <Tab label="Administrador" {...a11yProps(3)} sx={{ fontWeight: 'bold', color: blueColor }} />
                            )}
                        </Tabs>

                        <TabPanel value={value} index={0}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor, padding: '10px' }}>Atualize seus dados</Typography>
                            <form onSubmit={formik.handleSubmit} style={{ width: '200%', height: '100%', padding: '10px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                                    <TextField
                                        fullWidth
                                        label="Nome completo"
                                        onBlur={formik.handleBlur}
                                        onChange={(e) => formik.setFieldValue('fullName', e.target.value)}
                                        value={formik.values.fullName}
                                        name="fullName"
                                    />

                                    <TextField
                                        fullWidth
                                        label="Email"
                                        onBlur={formik.handleBlur}
                                        onChange={(e) => formik.setFieldValue('email', e.target.value)}
                                        value={formik.values.email}
                                        name='email'
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            sx={{ width: '100%' }}
                                            disabled
                                            label="Data de Nascimento"
                                            value={moment(formik.values.birthDate)}
                                        />
                                    </LocalizationProvider>

                                    <PhoneInput handleChange={handleChange} value={formik.values.phone} />
                                </Box>

                                <Button type='submit' fullWidth sx={{ color: 'white', fontWeight: 'bold', height: '50px', backgroundColor: blueColor, border: `1px solid ${blueColor}`, '&:hover': { backgroundColor: 'white', color: blueColor } }}>ALTERAR DADOS</Button>

                            </form>
                        </TabPanel>

                        <TabPanel value={value} index={1}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor, padding: '10px' }}>Atualize sua senha</Typography>
                            <form onSubmit={formikPassword.handleSubmit} style={{ width: '200%', height: '100%', padding: '10px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', width: '90%' }}>

                                    <FormControl sx={{ width: '50%' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Digite sua senha</InputLabel>
                                        <OutlinedInput
                                            type={showPassword1 ? 'text' : 'password'}
                                            onChange={(e) => formikPassword.setFieldValue('password', e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleClickShowPassword1}
                                                        edge="end"
                                                    >
                                                        {showPassword1 ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                    </FormControl>


                                    <FormControl sx={{ width: '50%' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Digite sua nova senha</InputLabel>
                                        <OutlinedInput
                                            type={showPassword2 ? 'text' : 'password'}
                                            onChange={(e) => formikPassword.setFieldValue('newPassword', e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleClickShowPassword2}
                                                        edge="end"
                                                    >
                                                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                    </FormControl>
                                </Box>

                                <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', width: '90%' }}>

                                    <FormControl sx={{ width: '50%' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Digite sua nova senha novamente</InputLabel>
                                        <OutlinedInput
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={(e) => formikPassword.setFieldValue('confirmNewPassword', e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                    </FormControl>


                                    <Button type='submit' sx={{ width: '50%', color: 'white', fontWeight: 'bold', height: '50px', backgroundColor: blueColor, border: `1px solid ${blueColor}`, '&:hover': { backgroundColor: 'white', color: blueColor } }}>CONFIRMAR ALTERAÇÃO</Button>
                                </Box>
                            </form>
                        </TabPanel>

                        <TabPanel value={value} index={2}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor, padding: '10px' }}>Atividades realizadas no nosso sistema</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {userFetch && userFetch.activities.map((atividade) => (
                                    <Box sx={{ width: '44vw', border: '1px solid #C4C4C4', borderRadius: '10px', display: 'flex' }}>
                                        <Box sx={{
                                            backgroundImage: `url(https://deviagem-server.onrender.com/assets/${atividade.cartInformations.packages.imagem})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            width: '40%',
                                            height: '250px',
                                            borderRadius: '10px'
                                        }} />

                                        <Box sx={{ padding: '10px', width: '60%', display: 'flex', flexDirection: 'column' }}>
                                            <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: blueColor }}>Pacote para {atividade.cartInformations.packages.destino}</Typography>
                                            <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: blueColor }}>Status: {atividade.listaCpfPendente.length === 0 ? "Reservado" : "Pendente de Pagamento"}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'end', height: '100%' }}>
                                                <Box sx={{ width: '70%' }}>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '16px' }}>Check-in</Typography>
                                                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: blueColor }}>até {moment(atividade.cartInformations.estado.dias[atividade.cartInformations.selectedDate].dataIda + ' ' + atividade.cartInformations.estado.dias[atividade.cartInformations.selectedDate].horaIda, 'DD [de] MMMM [às] HH:mm').add(6, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '16px' }}>Check-out</Typography>
                                                        <Typography sx={{ fontSize: '16px', fontWeight: "bold", color: blueColor }}>até {moment(atividade.cartInformations.estado.dias[atividade.cartInformations.selectedDate].dataVolta + ' ' + atividade.cartInformations.estado.dias[atividade.cartInformations.selectedDate].horaVolta, 'DD [de] MMMM [às] HH:mm').subtract(1, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                                                    </Box>
                                                </Box>

                                                <Button onClick={() => handleClickButton(atividade)} sx={{ border: `1px solid ${blueColor}`, width: '30%', color: 'white', backgroundColor: blueColor, "&:hover": { backgroundColor: 'white', color: blueColor } }}>Ver mais detalhes</Button>
                                            </Box>

                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                        </TabPanel>

                        <TabPanel value={value} index={3} style={{ width: '75%' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor, padding: '10px', display: 'flex', justifyContent: 'space-between' }}>Administrador {userSelected && (<Button onClick={() => setUserSelected(null)} sx={{ backgroundColor: blueColor, color: 'white', border: `1px solid ${blueColor}`, "&:hover": { backgroundColor: 'white', color: blueColor } }}>Voltar</Button>)}</Typography>

                            <Box sx={{ padding: '10px', width: '100%' }}>
                                <form style={{ width: 'auto', display: 'flex', gap: '1rem' }}>
                                    <FormControl sx={{ width: '100%' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">CPF/CNPJ do Usuário</InputLabel>
                                        <OutlinedInput
                                            onChange={(e) => formikAdmin.setFieldValue('cpf', e.target.value)}
                                            type='text'
                                            label="cpf"
                                            disabled={userSelected}
                                            inputComponent={CpfMask}
                                        />
                                    </FormControl>
                                    {!userSelected && (
                                        <Button onClick={formikAdmin.submitForm} sx={{ border: `1px solid ${blueColor}`, width: '100%', height: '3rem', color: 'white', backgroundColor: blueColor, "&:hover": { backgroundColor: 'white', color: blueColor } }}>Pesquisar</Button>
                                    )}
                                </form>

                                {userSelected && (
                                    <Box sx={{ marginTop: '10px', width: '100%' }}>
                                        <TextField
                                            sx={{ width: '100%' }}
                                            variant='outlined'
                                            disabled
                                            value={userSelected.user.fullName}
                                        />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                            <FormControl sx={{ width: '54%' }}>
                                                <InputLabel>Nível de acesso</InputLabel>
                                                <Select
                                                    value={selectAcessLevel}
                                                    label="accessLevel"
                                                    onChange={handleSelectChange}
                                                >
                                                    <MenuItem value="basic">Básico</MenuItem>
                                                    <MenuItem value="enterprise">Empresarial</MenuItem>
                                                    <MenuItem value="admin">Administrador</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <Button onClick={() => handleSubmitAcessLevel()} sx={{ fontWeight: 'bold', border: `1px solid ${blueColor}`, width: '44%', color: 'white', backgroundColor: blueColor, "&:hover": { backgroundColor: 'white', color: blueColor } }}>Salvar</Button>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </TabPanel>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ width: '100%', backgroundColor: 'white' }}>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChangeTabs} aria-label="basic tabs example">
                            <Tab label="Perfil" {...a11yProps(0)} sx={{ fontWeight: 'bold', color: blueColor }} />
                            <Tab label="Segurança" {...a11yProps(1)} sx={{ fontWeight: 'bold', color: blueColor }} />
                            <Tab label="Atividades" {...a11yProps(2)} sx={{ fontWeight: 'bold', color: blueColor }} />
                            {user.accessLevel === "admin" && (
                                <Tab label="Administrador" {...a11yProps(3)} sx={{ fontWeight: 'bold', color: blueColor }} />
                            )}
                        </Tabs>
                    </Box>

                    <TabPanel value={value} index={0}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor, padding: '10px' }}>Atualize seus dados</Typography>
                        <form onSubmit={formik.handleSubmit} style={{ width: '200%', height: '100%', padding: '10px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>


                            <TextField
                                sx={{ width: '50%' }}
                                label="Nome completo"
                                onBlur={formik.handleBlur}
                                onChange={(e) => formik.setFieldValue('fullName', e.target.value)}
                                value={formik.values.fullName}
                                name="fullName"
                            />

                            <TextField
                                sx={{ width: '50%' }}
                                label="Email"
                                onBlur={formik.handleBlur}
                                onChange={(e) => formik.setFieldValue('email', e.target.value)}
                                value={formik.values.email}
                                name='email'
                            />

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    sx={{ width: '50%' }}
                                    disabled
                                    label="Data de Nascimento"
                                    value={moment(formik.values.birthDate)}
                                />
                            </LocalizationProvider>

                            <PhoneInput handleChange={handleChange} value={formik.values.phone} />


                            <Button type='submit' sx={{ width: isNonMobile ? '100%' : '50%', color: 'white', fontWeight: 'bold', height: '50px', backgroundColor: blueColor, border: `1px solid ${blueColor}`, '&:hover': { backgroundColor: 'white', color: blueColor } }}>ALTERAR DADOS</Button>

                        </form>
                    </TabPanel>

                    <TabPanel value={value} index={1}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor, padding: '10px' }}>Atualize sua senha</Typography>
                        <form onSubmit={formikPassword.handleSubmit} style={{ width: '200%', height: '100%', padding: '10px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            <FormControl sx={{ width: '50%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Digite sua senha</InputLabel>
                                <OutlinedInput
                                    type={showPassword1 ? 'text' : 'password'}
                                    onChange={(e) => formikPassword.setFieldValue('password', e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword1}
                                                edge="end"
                                            >
                                                {showPassword1 ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>


                            <FormControl sx={{ width: '50%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Digite sua nova senha</InputLabel>
                                <OutlinedInput
                                    type={showPassword2 ? 'text' : 'password'}
                                    onChange={(e) => formikPassword.setFieldValue('newPassword', e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword2}
                                                edge="end"
                                            >
                                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>



                            <FormControl sx={{ width: '50%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Digite sua nova senha novamente</InputLabel>
                                <OutlinedInput
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => formikPassword.setFieldValue('confirmNewPassword', e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>


                            <Button type='submit' sx={{ width: '50%', color: 'white', fontWeight: 'bold', height: '50px', backgroundColor: blueColor, border: `1px solid ${blueColor}`, '&:hover': { backgroundColor: 'white', color: blueColor } }}>CONFIRMAR ALTERAÇÃO</Button>

                        </form>
                    </TabPanel>

                    <TabPanel value={value} index={2}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor, padding: '10px' }}>Atividades realizadas no nosso sistema.</Typography>
                        {userFetch && userFetch.activities.map((atividade) => (
                            <Box sx={{ width: '100%', border: '1px solid grey', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{
                                    backgroundImage: `url(https://deviagem-server.onrender.com/assets/${atividade.cartInformations.packages.imagem})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    width: '100%',
                                    height: '250px',
                                    borderRadius: '10px'
                                }} />

                                <Box sx={{ padding: '10px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: blueColor }}>Pacote para {atividade.cartInformations.packages.destino}</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: blueColor }}>Status: {atividade.listaCpfPendente.length === 0 ? "Reservado" : "Pendente de Pagamento"}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'end', height: '100%' }}>
                                        <Box sx={{ width: '70%' }}>
                                            <Box>
                                                <Typography sx={{ fontSize: '16px' }}>Check-in</Typography>
                                                <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: blueColor }}>até {moment(atividade.cartInformations.estado.dias[atividade.cartInformations.selectedDate].dataIda + ' ' + atividade.cartInformations.estado.dias[atividade.cartInformations.selectedDate].horaIda, 'DD [de] MMMM [às] HH:mm').add(6, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontSize: '16px' }}>Check-out</Typography>
                                                <Typography sx={{ fontSize: '16px', fontWeight: "bold", color: blueColor }}>até {moment(atividade.cartInformations.estado.dias[atividade.cartInformations.selectedDate].dataVolta + ' ' + atividade.cartInformations.estado.dias[atividade.cartInformations.selectedDate].horaVolta, 'DD [de] MMMM [às] HH:mm').subtract(1, 'hours').format('DD [de] MMMM [às] HH:mm')}</Typography>
                                            </Box>
                                        </Box>

                                    </Box>
                                    <Button onClick={() => handleClickButton(atividade)} sx={{ border: `1px solid ${blueColor}`, width: '100%', color: 'white', backgroundColor: blueColor, "&:hover": { backgroundColor: 'white', color: blueColor } }}>Ver mais detalhes</Button>

                                </Box>
                            </Box>
                        ))}
                    </TabPanel>

                    <TabPanel value={value} index={3} style={{ width: '100%' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30px', color: blueColor, padding: '10px', display: 'flex', justifyContent: 'space-between' }}>Administrador {userSelected && (<Button onClick={() => setUserSelected(null)} sx={{ backgroundColor: blueColor, color: 'white', border: `1px solid ${blueColor}`, "&:hover": { backgroundColor: 'white', color: blueColor } }}>Voltar</Button>)}</Typography>

                        <Box sx={{ padding: '10px', width: '100%' }}>
                            <form style={{ width: 'auto', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                <FormControl sx={{ width: '100%' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">CPF/CNPJ do Usuário</InputLabel>
                                    <OutlinedInput
                                        onChange={(e) => formikAdmin.setFieldValue('cpf', e.target.value)}
                                        type='text'
                                        label="cpf"
                                        disabled={userSelected}
                                        inputComponent={CpfMask}
                                    />
                                </FormControl>
                                {!userSelected && (
                                    <Button onClick={formikAdmin.submitForm} sx={{ border: `1px solid ${blueColor}`, width: '100%', height: '3rem', color: 'white', backgroundColor: blueColor, "&:hover": { backgroundColor: 'white', color: blueColor } }}>Pesquisar</Button>
                                )}
                            </form>

                            {userSelected && (
                                <Box sx={{ marginTop: '10px', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <TextField
                                        sx={{ width: '100%' }}
                                        variant='outlined'
                                        disabled
                                        value={userSelected.user.fullName}
                                    />

                                    <FormControl sx={{ width: '100%' }}>
                                        <InputLabel>Nível de acesso</InputLabel>
                                        <Select
                                            value={selectAcessLevel}
                                            label="accessLevel"
                                            onChange={handleSelectChange}
                                        >
                                            <MenuItem value="basic">Básico</MenuItem>
                                            <MenuItem value="enterprise">Empresarial</MenuItem>
                                            <MenuItem value="admin">Administrador</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Button onClick={() => handleSubmitAcessLevel()} sx={{ height: '3rem', fontWeight: 'bold', border: `1px solid ${blueColor}`, width: '100%', color: 'white', backgroundColor: blueColor, "&:hover": { backgroundColor: 'white', color: blueColor } }}>Salvar</Button>

                                </Box>
                            )}
                        </Box>
                    </TabPanel>
                </Box>
            )}


        </Box>
    )
}

export default ActivitesPage;
