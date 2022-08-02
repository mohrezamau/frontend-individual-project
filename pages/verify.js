import React from 'react'
import { Button, Flex, Heading, Input, Box, Image, Text, Link, Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription, Tooltip} from "@chakra-ui/react";


function verify() {
  return (
    <Flex height="60vh" alignItems="center" justifyContent="center" >
    <Flex alignItems="center" justifyContent="center" 
    direction="column" background="gray.400" p={12} rounded={6}>
      <Heading mb={6}>We have sent a verification email!</Heading>
        <Text mb={3}> if you did not get an email you can resend with the button below</Text>
      <Button colorScheme="teal" width={"100px"}>
        Resend Email
      </Button>
      <Text mt={5}>proceed to <Link color="teal" href="/login">login!</Link></Text>
    </Flex>
  </Flex>
  )
}

export default verify