import { Input, Button, Flex, Box, Tag, TagLeftIcon, TagLabel, Text, Link, VStack, Badge, HStack, Spacer
,Stack } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import {getSession} from 'next-auth/react'
import { useRouter } from 'next/router';
import {Icon, AddIcon, StarIcon} from '@chakra-ui/icons'
import pepega from '../public/images/pepega.jpg'
import coolpepe from '../public/images/coolpepe.jpg'
import sadge from '../public/images/sadge.png'
import gutsgrin from '../public/images/gutsgrin.jpg'
import geekcat from '../public/images/geekcat.png'
import panelberserk from '../public/images/panelberserk.jpg'
import axiosInstance from '../services/axiosinstance'
import next from 'next'


export default function Home() {

  const [isLiked, setIsLiked] = useState("false")
  const [caption, setCaption] = useState("")
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  console.log(`ini caption ${caption}`)
  console.log(`ini image ${image}`)


  const testPosts = [{
    post_id: 1,
    imageUrl: pepega,
    title: 'Ini pepega',
    likeCount: 4,
    isLiked: true,
  }, {
    post_id: 2,
    imageUrl: coolpepe,
    title: 'Ini coolpepe',
    likeCount: 9,
    isLiked: true,
  }, {
    post_id: 3,
    imageUrl: sadge,
    title: 'Ini sadge',
    likeCount: 34,
    isLiked: false,
  },
  {
    post_id: 4,
    imageUrl: gutsgrin,
    title: 'Ini guts tolong dikondisikan kerennya, best manga ever boi YAGESYAK anjas kelas',
    likeCount: 999,
    isLiked: true,
  }
  , {
    post_id: 5,
    imageUrl: geekcat,
    title: 'Ini meng',
    likeCount: 34,
    isLiked: true,
  },
  {
    post_id: 6,
    imageUrl: panelberserk,
    title: 'Ini berserk',
    likeCount: 999,
    isLiked: true,
  }
  ,]

  function postMaker (post) {
  
    return (
        <Box as='button' bg={"gray.100"}
        maxW={1500} maxH={1200} borderWidth='1px' borderRadius='lg' overflow='hidden' my={6} mx={12}>
      <Image src={post.imageUrl} width={480} height={320} borderWidth='1px' borderRadius='lg' overflow='hidden'/>

      <Box p='3'>
        <Box
         
          as='h3'
          noOfLines={2}
        >
          {post.title}
        </Box>

        <Box display='flex' mt='2' alignItems='center'>
        <StarIcon
                color={post.isLiked ? 'orange' : 'gray.300'}
              />
          <Box as='span' ml='2' color='gray.600' fontSize='sm'>
            {post.likeCount}
          </Box>
        </Box>
      </Box>
    </Box>
    )
  }

  const mappedPosts = testPosts.map(postMaker)

  

  async function getSessionAsync(){
    const session = await getSession()
    if(!session) { router.replace("/login") }  
    console.log({session});
    }
    useEffect(() => {
    getSessionAsync()  
    }, [])
  
    const onImageChange = (event) => {
      setImage(event.target.files[0]);
      setPreview(URL.createObjectURL(event.target.files[0]));
    };

    const onPostClick = async () => {
      setLoading(true)
      try {
        const session = await getSession();

        const {accesstoken} = session.user;
        console.log(session)
        const user_id = session.user.user_id;
        const body = new FormData();
        body.append("image", image);
        body.append("caption", caption);
        body.append("user_id", user_id);
        // const body = {
        //   caption, image, user_id: session.user.user_id
        // }
        const config = {
          headers: {Authorization: `Bearer ${accesstoken}`},
        };
        console.log(image, caption, user_id)
          const res = await axiosInstance.post("/posts", body, config);
          alert(res.data.message)

      } catch (error) {
        alert(error)
        console.log(error)
      }
    }

  return (
    <VStack spacing='24px'>
      <Box  
    maxH="10vh" width= "80%" align-items="center" my="auto" mx="auto" padding={"auto"} rounded={8}>
     <Input type="text" width={"100%"}
          placeholder="What's going on?"
          variant="outline"
          mb="10px"
          bg="gray.50"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}/>

          <Button mx={3} 
          variant={"outline"} colorScheme="teal" alignItems="center" width="20vh" 
          onClick={onPostClick}>
            Pepe Post!</Button>
          
    {preview? (<Button mx={3} colorScheme="orange" alignItems="center" width="22vh" onClick={() =>{ setPreview(null), setImage(null)}}>Remove Image</Button>):(<>
      <label for="inputImage"> <Tag variant='outline' colorScheme='teal'>
      <TagLeftIcon  boxSize={"12px"} as={AddIcon} />
      <TagLabel>
        Add Image
      </TagLabel>
    </Tag></label>
    <input id="inputImage" style={{visibility: 'hidden'}} type={"file"} value={image}
    onChange={onImageChange}/>
    </>)} 
   </Box >
      <Flex wrap={"wrap"} direction={"column"} align='center'>
      {mappedPosts}
      </Flex>
    </VStack>
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