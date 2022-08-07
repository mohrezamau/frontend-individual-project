import React from 'react'
import { useState, useEffect } from 'react';
import { Input, Button, Flex, Box, Tag, TagLeftIcon, TagLabel, Text, Link, VStack, Badge, HStack, Spacer
  ,Stack, Image, Alert, AlertIcon } from '@chakra-ui/react'
import {Icon, AddIcon, StarIcon} from '@chakra-ui/icons'
import {getSession} from 'next-auth/react'
import axiosInstance from '../../services/axiosinstance';

function postDetail(props) {
  const [user, setUser] = useState(props.user)
  const [post, setPost] = useState(props.post)
  const [poster, setPoster] = useState(props.poster)
  const [session, setSession] = useState(false)

  console.log(post, poster)

  

  async function getSessionAsync(){
    const session = await getSession()
    setSession(true)
    if(!session) { router.replace("/login") }  
    console.log({session});
    }
    useEffect(() => {
    getSessionAsync()  
    }, [])

    const createdAt = post.createdAt
    console.log(createdAt)
    const slicedCreatedAt = createdAt.slice(0,10)
    const addressAPI = "http://localhost:2105"
    const addressImage = addressAPI.concat(`${post.image}`)
    
  return (
    (
      <Flex>
        <Box as='button' bg={"gray.100"} alignContent={"center"} alignItems={"center"} boxShadow={"2xl"}
      width={480} maxH={1200} borderWidth='1px' borderRadius='lg' overflow='hidden' mt={5} mx={12} _hover={{ background: "white",
      color: "orange.400",}}>
    <Image src={addressImage} width={480} height={320} borderWidth='1px' borderRadius='lg' overflow='hidden'/>
    <Box p='3'>
      <Box display='flex' alignItems='baseline'>
      <Badge borderRadius='md' px='2' colorScheme='teal'>
          Posted by {poster.username}
        </Badge>
        <Box
          color='gray.500'
          fontWeight='semibold'
          letterSpacing='wide'
          fontSize='xs'
          textTransform='uppercase'
          ml='2'
        >
         created at &bull; {slicedCreatedAt}
        </Box>
      </Box>
      <Box
        mt='1'
        fontWeight='medium'
        as='h4'
        lineHeight='tight'
        noOfLines={2}
      >
        {post.caption}
      </Box>
      <Box display='flex' mt='2' alignItems='center'>
      <StarIcon
              color={false ? 'orange' : 'gray.300'}
            />
        <Box as='span' ml='2' color='gray.600' fontSize='sm'>
          x likes
        </Box>
        
      </Box>
    </Box>
  </Box>
 
  <Box width={480} height={480} p={3} bg={"gray.200"} rounded={6}>
  <Input type="text" width={"100%"}
          placeholder="add comment..."
          variant="outline"
          mb="10px"
          bg="gray.50">
          </Input>
          <Button mx={3}
            variant={"outline"} colorScheme="teal" alignItems="center" height="4vh" width="20vh" 
              >
              Pepe comment!
            </Button>
  </Box>
   
  <Flex direction={"column"}>
            <Button mx={3} my={1}
            variant={"outline"} colorScheme="teal" alignItems="center" height="4vh" width="20vh" 
              >
              Edit Post
            </Button>
            <Button mx={3} my={1}
            variant={"outline"} colorScheme="orange" alignItems="center" height="4vh" width="20vh" 
              >
              Delete Post
            </Button>
  </Flex>
      </Flex>
  )
  )
}


export async function getServerSideProps(context) {
  try {
    const session = await getSession({req: context.req});
    const {post_id} = context.params

    if (!session) return {redirect: {destination: "/login"}};
   
    const {accessToken} = session.user;

    const config = {
      headers: {Authorization: `Bearer ${accessToken}`},
    };

    const user_id = session.user.user_id;
   // console.log({user_id})
    const res = await axiosInstance.get(`/users/profile/${user_id}`, config);
    const postRes = await axiosInstance.get(`/posts/getPost/${post_id}`, config);

    return {
      props: {user: res.data.data.result, 
        post: postRes.data.data, poster: 
        postRes.data.resGetPoster, session},
    };
  } catch (error) {
    console.log({error});
    return {props: {}};
  }
}
export default postDetail