import React from 'react'
import { getSession } from 'next-auth/react';
import axiosInstance from '../../services/axiosinstance';
import {Image, Text, VStack, Flex, Button, useDisclosure, Box, Drawer, Modal, ModalContent, ModalHeader
,ModalCloseButton, ModalFooter, ModalOverlay, ModalBody, Input, Tag, TagLeftIcon, TagLabel, Heading} from "@chakra-ui/react";
import { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';

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

      console.log(`ini user ${user.username}`)
    
 const onFileChange = (event) => {
    setAvatar(event.target.files[0]);
     setPreview(URL.createObjectURL(event.target.files[0]));
  };

  const onHandleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  const onSaveButton = async () => {
    try {
      const session = await getSession();

      const {accessToken} = session.user;

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



  return (
<Flex height="60vh" alignItems="center" justifyContent="center" bg={"gray.300"} rounded={6}>
<Flex bg={"gray.200"} width={320} height={320} mr={10} rounded={6}>
    <Flex width={300} height={300} bg={"grey.100"} my={2} mx={2}>
        <Image width={300} height={300} value={avatar}></Image>
    </Flex>
    </Flex>
    
      <Flex alignItems="center" justifyContent="center" direction={"column"}>
      <Flex mb={3} alignItems="center" justifyContent="center" direction={"column"}>
      {preview? (<><Button mx={3} colorScheme="orange" alignItems="center" width="10vh"onClick={() =>{ setPreview(null), setAvatar(null)}}>Cancel</Button>
      <Button mx={3} colorScheme="teal" alignItems="center" width="10vh">Save</Button></>
      )
      
      :(<>
      <label for="inputImage"> <Tag variant='subtle' colorScheme='cyan'>
      <TagLeftIcon  boxSize={"12px"} as={AddIcon} />
      <TagLabel>
        Add Avatar
      </TagLabel>
    </Tag></label>
    <input id="inputImage" style={{visibility: 'hidden'}} type={"file"} value={avatar}
    onChange={onFileChange}/>
    </>)}
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
      <Button onClick={onOpen}>Edit Profile</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <><Input
          type="text"
          value={fullname}
          placeholder="fullname"
          variant="filled"
          mb={3}
          onChange={onHandleChange}
        />
        <Input
          type="text"
          value={bio}
          placeholder="bio"
          variant="filled"
          mb={3}
          onChange={onHandleChange}
        />
        
       </>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='orange' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='teal'>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
      </Flex>
    </Flex>  )
// return (<></>)
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