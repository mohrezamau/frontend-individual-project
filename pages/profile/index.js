import React from 'react'
import { getSession } from 'next-auth/react';
import axiosInstance from '../../services/axiosinstance';
import {Image, Text, Flex, Button, useDisclosure, Tag, TagLeftIcon, TagLabel, Heading} from "@chakra-ui/react";
import { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
// import editProfile from '../../components/edit-profile';
import NextLink from "next/link";

function profile(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [user, setUser] = useState(props.user)
    const [preview, setPreview] = useState(false)
    const [avatar, setAvatar] = useState("")

    const {
        user_id,
        username,
         bio,
        isVerified,
         fullname,
        email,
        
      } = user;

      const userProfile = {
        user_id,
        isVerified,
        username,
        bio,
        fullname,
        email
      };

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

 const onFileChange = (event) => {
    setAvatar(event.target.files[0]);
     setPreview(URL.createObjectURL(event.target.files[0]));
  };

  const onSaveAvatar = async () => {
    try {
      const session = await getSession();
      
      const {accessToken} = session.props.user;

      const body = new FormData();

      body.append("avatar", avatar);

      const config = {
        headers: {Authorization: `Bearer ${accessToken}`},
      };

      const res = await axiosInstance.patch("/users/avatar", body, config);

      alert(res.data.message);
    } catch (error) {
      console.log({Error});
      alert(error.response.data.message);
    }
  };

  const onSaveProfile = async () => {
    try {
      const session = await getSession();
      const {accessToken} = session.user;

      const config = {
        headers: {Authorization: `Bearer ${accessToken}`},
      };
      console.log({bio}, {fullname})
      await axiosInstance.patch("/users", user, config);

      alert("Update Profile Success");
      const resGetUserProfile = await axiosInstance.get(
        `/users/profile/${user_id}`,
        config
      );

      setUser(resGetUserProfile.data.data.result);
    } catch (error) {
      console.log({error});
      alert(error);
    }
  };

  return (
<Flex height="60vh" alignItems="center" justifyContent="center" bg={"gray.300"} rounded={6}>
<Flex bg={"gray.200"} width={320} height={320} mr={10} rounded={6}>
    <Flex width={300} height={300} bg={"grey.100"} my={2} mx={2}>
        <Image width={300} height={300} value={avatar}></Image>
    </Flex>
    </Flex>
      <Flex alignItems="center" justifyContent="center" direction={"column"}>
      <Flex mb={3} alignItems="center" justifyContent="center" direction={"column"}>
      {/* {preview? (<><Button mx={3} colorScheme="orange" alignItems="center" width="10vh"
      onClick={() =>{ setPreview(null), setAvatar(null)}}>Cancel</Button>
      <Button mx={3} colorScheme="teal" alignItems="center" width="10vh"
      onClick={onSaveAvatar}>Save Avatar</Button></>
      ):(<>
      <label for="inputImage"> <Tag variant='subtle' colorScheme='cyan'>
      <TagLeftIcon  boxSize={"12px"} as={AddIcon} />
      <TagLabel>
        Add Avatar
      </TagLabel>
    </Tag></label>
    <input id="inputImage" style={{visibility: 'hidden'}} type={"file"} value={avatar}
    onChange={onFileChange}/>
    </>)} */}
      <Flex alignItems="center" justifyContent="center" 
      direction="column" background="gray.400" p={12} rounded={6}>
        <Heading mb={6}>this is {username}!</Heading>
        <Text>fullname: {fullname}</Text>
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