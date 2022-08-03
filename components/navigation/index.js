import { Box, Button, HStack, Text, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import {InfoOutlineIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {signOut} from "next-auth/react"
import {getSession} from 'next-auth/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

function Navigation() {
  
const [session, setSession] = useState(false)

  async function getSessionAsync(){
    
    const session = await getSession()
    
    if(session){
      setSession(true)
    }

    console.log({session});
    }
  
    useEffect(() => {
    getSessionAsync()  
    },)

    return(
        <Box width= "90%" align-items="center" my="2px" mx="auto" padding={5}>
        <HStack> 
            <Flex>   
        <NextLink href="/">
          <Button fontSize="large" variant="ghost" colorScheme="orange" mx="2.5px" my={5} w="100%">
            HOME
          </Button>
        </NextLink>
        {session? (<></>):(<NextLink href="/login">
        <Button  fontSize="large" colorScheme="teal" variant="ghost" mx="2.5px" my={5} w="100%">
                  Login
                </Button>
        </NextLink>)}
        {session? (<></>):(<NextLink href="/register">
                <Button  fontSize="large" colorScheme="teal" variant="ghost" mx="2.5px" my={5} w="100%">
                  Register
                </Button>
        </NextLink>)}
        <NextLink href="/info">
                <Link mx="8px" my="27.5px">
                  <InfoOutlineIcon/>
                </Link>
        </NextLink>        
       {session? (<Button  fontSize="large" variant="ghost" mx="2.5px" my={5} w="100%" onClick={() => {signOut();}}>
                  Logout <ExternalLinkIcon/>
                </Button>): ("")}
                {session? (<NextLink href="/profile">
          <Button fontSize="large" variant="ghost" colorScheme="orange" mx="2.5px" my={5} w="100%">
            PROFILE
          </Button>
        </NextLink>):(<></>)}
        </Flex>
      </HStack>
        </Box>
    );
}

export default Navigation;