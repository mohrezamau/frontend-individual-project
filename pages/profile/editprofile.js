import React from 'react'
import { Button, Flex, Heading, Input, Text, Link, InputGroup, InputRightElement, Tag, TagLeftIcon, TagLabel,
Image} from "@chakra-ui/react";
import { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { getSession } from 'next-auth/react';
import axiosInstance from '../../services/axiosinstance';
import sadge from "../../public/images/pepega.jpg"
import pepega from "../../public/images/pepega.jpg"

function editprofile() {
    const [preview, setPreview] = useState(false)
    const [avatar, setAvatar] = useState("")
    console.log(avatar)

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
    <Flex height="60vh" alignItems="center" justifyContent="center" bg={"gray.700"} >
    <Flex alignItems="center" justifyContent="center" 
    direction="column" background="gray.400" p={12} rounded={6}>
      <Text fontSize={"xl"} fontWeight={"semibold"} mb={6}>Edit Profile</Text>
      <Input
        type="text"
        placeholder="fullname"
        variant="filled"
        mb={3}  
      />
      <Input
        type="text"
        placeholder="bio"
        variant="filled"
        mb={3}  
      />

      <Button mb={3} colorScheme="teal" width={"70px"} height={"30px"}
      //onClick={onSaveProfile}
      >
        save
      </Button>
      {preview? (<><Button mx={3} mb={2} colorScheme="orange" alignItems="center" width="10vh"
      onClick={() =>{ setPreview(null), setAvatar("")}}>Cancel</Button>
      <Button mx={3} colorScheme="teal" alignItems="center" width="15vh"
      //onClick={onSaveAvatar}
      >
        Save Avatar</Button></>
      ):(<>
      <label for="inputImage"> <Tag variant='subtle' colorScheme='teal'>
      <TagLeftIcon  boxSize={"12px"} as={AddIcon} />
      <TagLabel>
        Add Avatar
      </TagLabel>
    </Tag></label>
    <input id="inputImage" style={{visibility: 'hidden'}} type={"file"} value={avatar}
    onChange={onFileChange}/>
    </>)}
    </Flex>
    <Flex alignItems="center" justifyContent="center" 
     bg={"red.300"} maxW={320} maxH={320} ml={10} rounded={6}>
        <Image width={320} height={320} src={avatar}></Image>
    </Flex>
  </Flex>
  )
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

export default editprofile