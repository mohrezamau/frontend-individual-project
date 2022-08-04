import React from 'react'
import { getSession } from 'next-auth/react';
import axiosInstance from '../../services/axiosinstance';
import {Image, Text, Flex, Button, useDisclosure, Tag, TagLeftIcon, TagLabel, Heading} from "@chakra-ui/react";
import { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import NextLink from "next/link";

function profile(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [user, setUser] = useState(props.user)
    const [preview, setPreview] = useState(false)
    
    const {
        user_id,
        username,
         bio,
        isVerified,
         fullname,
        email,
        avatar
        
      } = user;

      const userProfile = {
        user_id,
        isVerified,
        username,
        bio,
        fullname,
        email,
        avatar
      };

      const addressAPI = "http://localhost:2105"
      const addressAvatar = addressAPI.concat(`${avatar}`)

    const userVerified = userProfile.isVerified;
    if (userVerified) {
    if (typeof window !== "undefined") {
      localStorage.setItem("userVerified", true);
    }
    }

    const userID = userProfile.user_id;
    if (userID) {
    if (typeof window !== "undefined") {
      localStorage.setItem("user_id", userID);
    }
    }

      console.log(`ini user ${props.user.username}`)

console.log(`http://localhost:2105${avatar}`)
console.log(addressAvatar)


return (
<Flex width={"100%"} height="60vh" alignItems="center" justifyContent="center" bg={"gray.300"} rounded={6}>
<Flex bg={"gray.200"} width={320} height={320} mr={10} rounded={6}>
    <Flex width={300} height={300} bg={"grey.100"} my={2} mx={2}>
        <Image width={300} height={300} src={addressAvatar}></Image>
    </Flex>
    </Flex>
      <Flex alignItems="center" justifyContent="center" direction={"column"}>
      <Flex mb={3} alignItems="center" justifyContent="center" direction={"column"}>
     
      <Flex alignItems="center" justifyContent="center" 
      direction="column" background="gray.400" p={12} rounded={6}>
        <Heading mb={6}>this is {username}!</Heading>
        <Text textAlign={"left"}>fullname: {fullname}</Text>
        <Text>email: {email}</Text>
        <Text>username: {username}</Text>
        <Text>bio: {bio}</Text>
      </Flex>
    </Flex>
      <>
      <NextLink href="/profile/editprofile">
      <Button       colorScheme="teal"
                    variant={"solid"}
                    onClick={onOpen}
                    size="sm"
                    width={100}
                    alignSelf="center"
                  >
                    Edit Profile
                  </Button>
      </NextLink>
    </>
      </Flex>
    </Flex>  )
}

export async function getServerSideProps(context) {
    try {
      const session = await getSession({req: context.req});
  
      if (!session) return {redirect: {destination: "/login"}};
        console.log({session})
      const {accessToken} = session.user;
  
      const config = {
        headers: {Authorization: `Bearer ${accessToken}`},
      };
  
      const user_id = session.user.user_id;
      console.log({user_id})
      const res = await axiosInstance.get(`/users/profile/${user_id}`, config);
      
      return {
        props: {user: res.data.data.result, session},
      };
    } catch (error) {
      console.log({error});
      return {props: {}};
    }
  }

export default profile