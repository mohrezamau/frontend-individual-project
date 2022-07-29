import React from 'react'
import { Button, Flex, Heading, Input, Box, Image, Text, Link, Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription, Tooltip} from "@chakra-ui/react";
import { useState } from 'react';
import axiosInstance from '../services/axiosinstance';
import { passwordStrength } from 'check-password-strength'


function register() {
  const image = {imageUrl: "https://streamsentials.com/wp-content/uploads/2021/07/sadge-png.png"}



  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const onRegisterClick = async () => {
    setLoading(true)
    console.log("pencet jalan")
    try {
      const body = {
        username,
        email,
        password,
      };
      
      const res = await axiosInstance.post("/users", body);
      setSuccess(true)
      
    } catch (error) {
      console.log(error)
      if(error.response.data.message){
        console.log(error.response.data)
      }
      alert(error.response.data.message);
    }
    finally {
      setLoading(false)
    }
  };
  
  function okChecker () {
      if (!password) return (
        <Alert status='info' rounded={6}>
      <AlertIcon />
      mind that your password contains both lowercase and uppercase letters, a symbol, a number, and a minimum of 8 characters!
    </Alert>
      );
    const strengthTester = passwordStrength(password).value;
    const length = password.length;
    let pass = password;
    let conPass = confirmPassword;
    let statusStrength;
    let textStrength;
    switch(strengthTester) {
      case "Too weak":
      statusStrength = "warning";
      textStrength = "password is too weak";
        break;
      case "Weak":
      statusStrength = "warning";
      textStrength = "password is weak";
      case "Medium":
      statusStrength = "success";
      textStrength = "password is sufficient";
        break;
      case "Strong":
      statusStrength = "success"
      textStrength = "password is strong";
        break;
      default:
        statusStrength = "info"
        textStrength = " Mind that your password contains both lowercase and uppercase letters, a symbol, a number, and a minimum of 8 characters!"
     }
    
    // console.log(pass, conPass)
     if (length < 8){
      return (<Alert status='warning' rounded={6}>
      <AlertIcon />
      password needs a minimum of 8 characters!
    </Alert>)
     }
     if (statusStrength === "warning" || statusStrength === "info"){
      return (<><Alert status={`${statusStrength}`} rounded={6}>
      <AlertIcon />
      {`${textStrength}`}
    </Alert>
    <Button mt={5} mb={5} colorScheme="teal" alignItems="center" width="30vh" 
    isDisabled
      onClick={onRegisterClick}>
        Sign up
      </Button>
    </>
    ) 
     }
     else if (statusStrength == "success"  && pass==conPass) {
      return (<><Alert status={`${statusStrength}`} rounded={6}>
      <AlertIcon />
      {`${textStrength}`}
    </Alert>
    {loading? (
      <Button mt={5} mb={5} colorScheme="teal" alignItems="center" width="30vh" 
      isLoading
      loadingText='Submitting'
      variant='outline'
      onClick={onRegisterClick}>
        Sign up
      </Button>
    ):(
      <Button mt={5} mb={5} colorScheme="teal" alignItems="center" width="30vh" 
    
      onClick={onRegisterClick}>
        Sign up
      </Button>
    )}
    </>
    ) 
     }
     else if(statusStrength == "success"){
      
      return (<><Alert status={`${statusStrength}`} rounded={6}>
      <AlertIcon />
      {`${textStrength}`}
    </Alert>
      <Button mt={5} mb={5} colorScheme="teal" alignItems="center" width="30vh"
      isDisabled 
      onClick={onRegisterClick}>
        Sign up
      </Button></>)
     }
  }


  return (
    <Flex height="85vh" alignItems="center" justifyContent="center" gap="150px" mx="10px">
      <Flex direction="column" p={12} rounded={6}>
        <Box height="60vh" width="70vh" maxW={'sm'}>
          <Image src={image.imageUrl}></Image>
        </Box>
      </Flex>
      <Flex direction="column" p={10} rounded={6} height="80vh" width="75vh" alignItems={"center"}>
        <Heading mb={5}>Sign up for Yggdrasil!</Heading>
        <Input
          type="text"
          value={username}
          placeholder="username"
          variant="filled"
          mb={3}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Input
          type="text"
          value={email}
          placeholder="email"
          variant="filled"
          mb={3}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="password"
          value={password}
          placeholder="password"
          variant="filled"
          mb={3}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input
          type="password"
          value={confirmPassword}
          placeholder="confirm password"
          variant="filled"
          mb={6}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
       
        <Text mt={5} mb={5}>
          Already have an account?, you can sign in <Link color="teal" href="/login">here!</Link></Text>
       
          {success? (<Alert status='success' rounded={6}>
          <AlertIcon />
          Successfully registered a new account! 
        </Alert>): ("")}
        {okChecker()}
      </Flex>
    </Flex>
  );
  }

export default register