
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import backgroundImg from 'assets/background-confirme-email.png';
import FlexBetween from 'components/FlexBetween';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogin } from 'state';
import * as yup from "yup";

const backgroundStyle = {
  backgroundImage: `url(${backgroundImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: "100%",
  height: "100vh"
};

const codeSchema = yup.object().shape({
  code: yup.string().required("Campo obrigatório")
})

const initialValeusSendCode = {
  code: ""
}

const ConfirmEmailPage = () => {
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const theme = useTheme();
  const blueColor = theme.palette.background.blue;
  const blueButton = theme.palette.background.button;

  const dispatch = useDispatch();

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const faseFlow = useSelector((state) => state.faseFlow);

  const login = async () => {
    const loggedInResponse = await fetch(
      "https://deviagem-server.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    }
    );

    const loggedIn = await loggedInResponse.json();

    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token
        })
      );
      if (faseFlow === 1) {
        navigate("/packages/cart/checkout")
      }
      navigate("/home")
    }
  };

  const handleCode = async (values) => {

    const body = {
      email: user.email,
      code: values.code
    }

    const codeSent = await fetch(
      "https://deviagem-server.onrender.com/auth/confirmAccount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
    )

    const response = await codeSent.json();
    if (response) {
      login()
    }
  }

  return (
    <div style={backgroundStyle}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          height: "100%"
        }}
      >

        <FlexBetween
          sx={{
            backgroundColor: blueColor,
            flexDirection: "column",
            width: isNonMobile ? "600px" : "370px",
            height: "auto",
            borderRadius: "25px",
            p: "2rem 5%",
            gap: "2rem"
          }}>

          <Typography fontWeight="bold" variant="h1" color="white">Confirme seu email</Typography>
          <Typography
            color="white"
            textAlign="center"
            fontWeight="bold"
          >Foi enviado um código para o email xxxxx, para confirmar, coloque o código enviado abaixo: </Typography>

          <Formik
            onSubmit={handleCode}
            initialValues={initialValeusSendCode}
            validationSchema={codeSchema}
          >
            {({
              values, errors, touched, handleBlur, handleChange, handleSubmit
            }) => (
              <form onSubmit={handleSubmit}>
                <FlexBetween
                  flexDirection="column"
                  alignItems="center"
                  width={isNonMobile ? "400px" : "100%"}
                  height="100%"
                  gap="1rem"
                >
                  <TextField
                    fullWidth
                    label="Código"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.code}
                    name="code"
                    error={Boolean(touched.code) && Boolean(errors.code)}
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
                      borderRadius: "4px",
                      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.4)"
                    }}
                  >
                    Confirmar Código
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

export default ConfirmEmailPage;