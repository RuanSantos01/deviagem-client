import React, { useState } from 'react'

import backgroundImgLogin from 'assets/background-login-cadastro.png';
import backgroundImgRegistro from 'assets/background-cadastro.png';
import FlexBetween from 'components/FlexBetween';
import { Box, Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { setLogin, setUser } from 'state';
import { useNavigate } from 'react-router-dom';
import TextMask from 'react-text-mask';

// ICONS
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// DATEPICKER
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import ReactInputMask from 'react-input-mask';


const registerSchema = yup.object().shape({
  fullName: yup.string().required("required"),
  cpf: yup.string().required("required"),
  email: yup.string().email("Email Inválido").required("required"),
  password: yup.string().required("required"),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Senhas não coincidem").required("required"),
  gender: yup.string(),
  phone: yup.string().required("required"),
  birthDate: yup.date().required("Campo obrigatório")
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Email Inválido").required("Campo Obrigatório"),
  password: yup.string().required("Campo Obrigatório")
});

const initialValuesRegister = {
  fullName: "",
  cpf: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  phone: "",
  birthDate: ""
};

const initialValuesLogin = {
  email: "",
  password: ""
};

const backgroundStyleLogin = {
  backgroundImage: `url(${backgroundImgLogin})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: "100%",
  height: "100vh"
};

const backgroundStyleRegistro = {
  backgroundImage: `url(${backgroundImgRegistro})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: "100%",
  height: "100vh"
};

const phoneMask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

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

const LoginPage = () => {
  const theme = useTheme();
  const blueColor = theme.palette.background.blue;
  const blueButton = theme.palette.background.button;

  const [pageType, setPageType] = useState("login");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const formatarData = (newDate) => {
    const data = new Date(newDate);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear());
    const dataFormatada = `${dia}-${mes}-${ano}`;
    return dataFormatada;
  }

  const faseFlow = useSelector((state) => state.faseFlow);

  const register = async (values, onSubmitProps) => {
    let requestBody = {};
    for (let value in values) {
      requestBody[value] = values[value]
    }

    requestBody['birthDate'] = formatarData(requestBody['birthDate']);

    const savedUserResponse = await fetch(
      "https://deviagem-server.onrender.com/auth/register",
      {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (savedUserResponse.status !== 201) {
      alert('Erro ao cadastrar, tente novamente mais tarde.')
    } else {
      const savedUser = await savedUserResponse.json();

      if (savedUser) {
        dispatch(
          setUser({ user: requestBody })
        )
        navigate("/confirmEmail")
      }
    }
  };

  const login = async (values, onSubmitProps) => {
    console.log(faseFlow === 1)
    const loggedInResponse = await fetch(
      "https://deviagem-server.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    }
    );

    if (loggedInResponse.status === 400) {
      alert('Usuário não cadastrado')
      return
    }

    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();

    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token
        })
      );

      if (faseFlow === 1) {
        navigate("/packages/cart/checkout")
      } else {
        navigate("/home")
      }
    } else {
      alert('Não foi possível logar no momento, tente novamente mais tarde.')
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <div style={isLogin ? (backgroundStyleLogin) : (backgroundStyleRegistro)}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          overflow: "hidden",
        }}>

        <FlexBetween
          backgroundColor={blueColor}
          sx={{
            width: isNonMobile ? "600px" : "370px",
            height: "auto",
            borderRadius: "25px",
            flexDirection: "column",
            p: "2rem 6%",
          }}
        >

          {isLogin && (
            <>
              <FlexBetween sx={{ flexDirection: "column", gap: "1.5rem" }}>
                <AccountCircleIcon sx={{ fontSize: "150px", color: "white" }} />
                <Typography fontWeight="bold" variant="h1" color="white">Bem vindos !</Typography>
              </FlexBetween>
            </>
          )}

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
          >
            {({
              values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm
            }) => (
              <form onSubmit={handleSubmit}>
                <FlexBetween
                  flexDirection="column"
                  alignItems="center"
                  width={isNonMobile ? "400px" : "100%"}
                  height="100%"
                  p="1rem"
                >
                  <Box sx={{ display: "flex", gap: "1.5rem", flexDirection: "column", width: isNonMobile ? "100%" : "20rem" }}>
                    {isRegister && (
                      <>
                        <Typography alignSelf="center" fontWeight="bold" variant="h1" color="white">Cadastre-se</Typography>

                        <TextField
                          fullWidth
                          label="Nome Completo"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.fullName}
                          name="fullName"
                          error={Boolean(touched.fullName) && Boolean(errors.fullName)}
                          variant="filled"
                          InputProps={{
                            style: { backgroundColor: "white", borderRadius: "4px" }
                          }}
                          InputLabelProps={{
                            style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                          }}
                        />
                      </>
                    )}

                    <TextField
                      fullWidth
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      error={Boolean(touched.email) && Boolean(errors.email)}
                      variant="filled"
                      InputProps={{
                        style: { backgroundColor: "white", borderRadius: "4px" }
                      }}
                      InputLabelProps={{
                        style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Senha"
                      type="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={Boolean(touched.password) && Boolean(errors.password)}
                      variant="filled"
                      InputProps={{
                        style: { backgroundColor: "white", borderRadius: "4px" }
                      }}
                      InputLabelProps={{
                        style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                      }}
                    />

                    {isRegister && (
                      <>
                        <TextField
                          fullWidth
                          label="Confirmar Senha"
                          type="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.confirmPassword}
                          name="confirmPassword"
                          error={Boolean(touched.confirmPassword) && Boolean(errors.confirmPassword)}
                          helperText={touched.confirmPassword && errors.confirmPassword}
                          variant="filled"
                          InputProps={{
                            style: { backgroundColor: "white", borderRadius: "4px" }
                          }}
                          InputLabelProps={{
                            style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                          }}
                        />

                        <FormControl sx={{ width: '100%' }} variant="filled">
                          <InputLabel htmlFor="outlined-adornment-password" sx={{ color: blueColor, fontWeight: "bold" }}>CPF/CNPJ</InputLabel>
                          <OutlinedInput
                            value={values.cpf}
                            type='text'
                            inputComponent={CpfMask}
                            onChange={(value) => setFieldValue('cpf', value.target.value.replace(/\D/g, ''))}
                            sx={{
                              backgroundColor: "white", color: blueColor,
                            }}
                          />
                        </FormControl>

                        <FormControl variant='filled'>
                          <InputLabel sx={{ color: blueColor, fontWeight: "bold", fontSize: "1rem" }}>Sexo</InputLabel>
                          <Select
                            fullWidth
                            sx={{
                              "&:hover": { backgroundColor: "white", color: blueColor },
                              "& .MuiSelect-select": { backgroundColor: "white" },
                            }}
                            value={values.gender}
                            label="Sexo"
                            onChange={(value) => setFieldValue("gender", value.target.value)}
                            SelectDisplayProps={{
                              style: {
                                backgroundColor: 'white',
                                borderRadius: '4px'
                              }
                            }}
                          >
                            <MenuItem value="masculino">Masculino</MenuItem>
                            <MenuItem value="feminino">Feminino</MenuItem>
                            <MenuItem value="prefiro nao dizer">Prefiro não dizer</MenuItem>
                          </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateField
                            label="Data de Nascimento"
                            format="DD/MM/YYYY"
                            name="birthDate"
                            variant="filled"
                            inputFormat="DD/MM/YYYY"
                            value={values.birthDate}
                            onChange={(value) => setFieldValue("birthDate", value)}
                            maxDate={dayjs()}
                            TextFieldComponent={TextField}
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "4px",
                              "&:hover": { backgroundColor: "white", color: blueColor },
                              "& .MuiInput-root": { color: blueColor, borderRadius: "4px" },
                              "& .MuiFormLabel-root": { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                            }}
                          />
                        </LocalizationProvider>

                        <TextField
                          fullWidth
                          label="Telefone"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.phone}
                          name="phone"
                          error={Boolean(touched.phone) && Boolean(errors.phone)}
                          variant="filled"
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
                            style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                          }}
                        />

                      </>
                    )}

                    {isLogin ? (
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <Typography
                          onClick={() => setPageType("register")}
                          sx={{
                            color: "white", fontWeight: "bold", "&:hover": {
                              textDecoration: "underline", cursor: "pointer"
                            }
                          }}>Cadastre-se aqui</Typography>

                        <Typography
                          onClick={() => navigate("/forgotPassword")}
                          sx={{
                            color: "white", fontWeight: "bold", "&:hover": {
                              textDecoration: "underline", cursor: "pointer"
                            }
                          }}>Esqueci minha senha</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography
                          onClick={() => setPageType("login")}
                          sx={{
                            color: "white", mb: "1rem", fontWeight: "bold", "&:hover": {
                              textDecoration: "underline", cursor: "pointer"
                            }
                          }}>Já possui conta? Entre aqui.</Typography>
                      </Box>
                    )}

                  </Box>

                  <Button
                    fullWidth
                    type="submit"
                    sx={{
                      p: "1rem",
                      heigth: "85px",
                      backgroundColor: blueButton,
                      color: "white",
                      fontWeight: "bold",
                      "&:hover": { color: blueButton },
                      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.4)"
                    }}
                  >
                    {isLogin ? "ENTRAR" : "REGISTRAR"}
                  </Button>

                </FlexBetween>
              </form>
            )}

          </Formik>

        </FlexBetween>

      </Box>
    </div>
  )
}

export default LoginPage;