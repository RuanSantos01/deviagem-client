import React, { useState } from 'react'

import backgroundForgotPassword from 'assets/background-forgotpassword.png';
import FlexBetween from 'components/FlexBetween';
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

const backgroundStyleLogin = {
  backgroundImage: `url(${backgroundForgotPassword})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: "100%",
  height: "100vh"
};


const ForgotPasswordPage = () => {
  const theme = useTheme();
  const blueColor = theme.palette.background.blue;
  const blueButton = theme.palette.background.button;

  const navigate = useNavigate();

  const [pageType, setPageType] = useState("sendemail");
  const isSendEmail = pageType === 'sendemail';
  const isApplyCode = pageType === 'applycode';
  const isNewPassword = pageType === 'newpassword'

  const [email, setEmail] = useState('');

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    onSubmit: values => {
      setPageType('applycode')
      fetchForgotPassword(values.email)
    }
  });

  const formikApplyCode = useFormik({
    initialValues: {
      code: ''
    },
    onSubmit: values => {
      fetchConfirmEmail(values.code)
    }
  })

  const formikNewPassword = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validate: values => {
      const errors = {};
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem';
      }
      return errors;
    },
    onSubmit: values => {
      fetchUpdatePassword(values.password)
    }
  })

  const fetchForgotPassword = async (email) => {

    const response = await fetch('https://deviagem-server.onrender.com/auth/forgotPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    const responseFetchPassword = await response.json();

    if (responseFetchPassword && response.ok) {
      setPageType('applycode')
    } else {
      alert('Não foi possível enviar o email, tente novamente mais tarde')
    }

  }

  const fetchConfirmEmail = async (code) => {
    const response = await fetch('https://deviagem-server.onrender.com/auth/confirmAccount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        code
      })
    })

    await response.json();

    if (response.ok) {
      setPageType('newpassword');
    } else {
      alert('Código inválido, tente novamente')
    }
  }

  const fetchUpdatePassword = async (password) => {
    const response = await fetch('https://deviagem-server.onrender.com/auth/recoverPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, email })
    })

    await response.json();

    if (response.ok) {
      alert('Senha alterada com sucesso!')
      navigate('/home')
    } else {
      alert('Não foi possível alterar a senha.')
    }
  }

  return (
    <div style={backgroundStyleLogin}>
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
          {isSendEmail ? (
            <>
              <Typography sx={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>Prencha os dados abaixo para solicitar a recuperação de senha</Typography>

              <form onSubmit={formik.handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <TextField
                  fullWidth
                  label="Email"
                  onChange={(e) => {
                    formik.setFieldValue('email', e.target.value)
                    setEmail(e.target.value);
                  }}
                  value={formik.values.email}
                  name="email"
                  variant="filled"
                  InputProps={{
                    style: { backgroundColor: "white", borderRadius: "4px" }
                  }}
                  InputLabelProps={{
                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                  }}
                />

                <Typography sx={{ color: 'white' }}>Você irá receber um e-mail no endereço informado acima contendo um código para validarmos sua conta.</Typography>

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
                  ENVIAR
                </Button>
              </form>
            </>
          ) : (
            <>
              {isApplyCode && (
                <>
                  <Typography sx={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>Informe o código enviado por email</Typography>

                  <form onSubmit={formikApplyCode.handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <TextField
                      fullWidth
                      label="Código"
                      onChange={(e) => formikApplyCode.setFieldValue('code', e.target.value)}
                      value={formikApplyCode.values.code}
                      name="email"
                      variant="filled"
                      InputProps={{
                        style: { backgroundColor: "white", borderRadius: "4px" }
                      }}
                      InputLabelProps={{
                        style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                      }}
                    />

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
                      CONFIRMAR
                    </Button>
                  </form>
                </>
              )}

              {isNewPassword && (
                <>
                  <Typography sx={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>Tudo certo! Agora digite sua nova senha</Typography>

                  <form onSubmit={formikNewPassword.handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <TextField
                      fullWidth
                      label="Nova senha"
                      onChange={(e) => formikNewPassword.setFieldValue('password', e.target.value)}
                      value={formikNewPassword.values.password}
                      name="senha"
                      type='password'
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
                      label="Confirme a Nova senha"
                      onChange={(e) => formikNewPassword.setFieldValue('confirmPassword', e.target.value)}
                      value={formikNewPassword.values.confirmPassword}
                      name="confirmPassword"
                      type='password'
                      variant="filled"
                      InputProps={{
                        style: { backgroundColor: "white", borderRadius: "4px" }
                      }}
                      InputLabelProps={{
                        style: { color: blueColor, fontWeight: "bold", fontSize: "1rem" }
                      }}
                    />

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
                      ENVIAR
                    </Button>
                  </form>
                </>
              )}
            </>
          )}



        </FlexBetween>

      </Box >
    </div >
  )
}

export default ForgotPasswordPage;