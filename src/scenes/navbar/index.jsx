import { FormControl, IconButton, InputBase, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import React from 'react'

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from '@mui/icons-material';
import { setCart, setFaseFlow, setLogout } from 'state';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';

const Navbar = () => {

  const dispatch = useDispatch();

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const user = useSelector((state) => state.user);
  const userName = user ? user.fullName : false;

  const navigate = useNavigate();

  const theme = useTheme();
  const background = theme.palette.background.blue;
  const neutralLight = theme.palette.neutral.light;

  const logout = () => {
    dispatch(setLogout())
  }

  const handleClickEntrar = () => {
    const rotaAtual = window.location.pathname;
    if (rotaAtual === "/packages/cart/checkout") {
      dispatch(setFaseFlow({ faseFlow: 1 }))
    } else {
      dispatch(setFaseFlow({ faseFlow: 0 }))
    }
    navigate('/login')
  }

  const [codigo, setCode] = useState('');
  const handleSearchCode = async () => {
    const response = await fetch(
      'http://localhost:3001/packages/paidPackages',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo })
      }
    )

    const redemptionCode = await response.json();
    console.log(redemptionCode)
    if (response.ok && redemptionCode) {
      dispatch(setCart({ cart: redemptionCode }))
      navigate('/packages/cart/checkout/completePayment')
    } else {
      setCode('')
      alert('Código não encontrado')
    }
  }

  const handleButtonAcitivities = () => {
    navigate('/profile')
  }

  const handleEnterprise = () => {
    navigate('/products')
  }

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={background} sx={{ width: '100%' }} boxShadow="0px 2px 2px rgba(0,0,0,0.3)">
      <FlexBetween gap="1.75rem" >
        <Typography
          onClick={() => navigate("/home")}
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.5rem)"
          color="white"
          sx={{ '&:hover': { cursor: 'pointer' } }}
        >
          DeViagem
        </Typography>

        {isNonMobileScreens && (
          <FlexBetween backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
            <InputBase
              value={codigo}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código aqui.." />
            <IconButton onClick={() => handleSearchCode()}><Search /></IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {user ? (
        <FormControl variant="standard" value={userName}>
          <Select value={userName} sx={{
            backgroundColor: neutralLight,
            width: "150px",
            borderRadius: "0.25rem",
            p: "0.25rem 1rem",
            "& .MuiSvgIcon-root": {
              pr: "0.25rem",
              width: "3rem"
            },
            "& .MuiSelect-select:focus": {
              backgroundColor: neutralLight
            }
          }}
            input={<InputBase />}
          >
            <MenuItem value={userName}>
              <Typography>{userName}</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleButtonAcitivities()}>Minha conta</MenuItem>
            {user.accessLevel === 'enterprise' && (
              <MenuItem onClick={() => handleEnterprise()}>Produtos</MenuItem>
            )}
            <MenuItem onClick={() => logout()}>Sair</MenuItem>
          </Select>
        </FormControl>
      ) : (
        <FlexBetween
          onClick={() => handleClickEntrar()}
          gap="0.25rem"
          sx={{
            backgroundColor: "#f0f0f0",
            boxShadow: "0px 10px 14px -7px #276873",
            borderRadius: "8px",
            cursor: "pointer",
            color: "#2b4c7e",
            padding: "10px 10px",
            "&:hover": {
              backgroundColor: "#2b4c7e",
              color: neutralLight
            }
          }}
        >
          <AccountCircleIcon sx={{ fontSize: "20px" }} />
          <Typography sx={{
            fontSize: "15px",
            fontWeight: "bold",
          }}>Entrar</Typography>
        </FlexBetween>
      )}

    </FlexBetween>
  )
}

export default Navbar;