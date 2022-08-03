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

export default function Home() {

  const [caption, setCaption] = useState("")
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  // function imagePreview () {
  //   if (preview){
  //     return (
  //       <Box mt={3} px={50} py={25} bg={'gray.100'} width={"85%"} rounded={8}>
  //       <Image src={preview} width={480} height={320}/>
  //     </Box>     
  //   )
  //   } 
  // }

  const testPosts = [{
    imageUrl: pepega,
    title: 'Ini pepega',
    likeCount: 4,
    rating: true,
  }, {
    imageUrl: coolpepe,
    title: 'Ini coolpepe',
    likeCount: 9,
    rating: true,
  }, {
    imageUrl: sadge,
    title: 'Ini sadge',
    likeCount: 34,
    rating: true,
  },
  {
    imageUrl: gutsgrin,
    title: 'Ini guts tolong dikondisikan kerennya, best manga ever boi YAGESYAK anjas kelas',
    likeCount: 999,
    rating: true,
  }
  , {
    imageUrl: geekcat,
    title: 'Ini meng',
    likeCount: 34,
    rating: true,
  },
  {
    imageUrl: panelberserk,
    title: 'Ini berserk',
    likeCount: 999,
    rating: true,
  }
  ,]

  function postMaker (post) {
  
    return (
        <Box as='button'
        maxW={300} maxH={300} borderWidth='1px' borderRadius='lg' overflow='hidden' my={6} mx={12}>
      <Image src={post.imageUrl} width={480} height={320}/>

      <Box p='3'>
        <Box
         
          as='h3'
          noOfLines={2}
        >
          {post.title}
        </Box>

        <Box display='flex' mt='2' alignItems='center'>
        <StarIcon
                color={post.rating ? 'orange' : 'gray.300'}
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
        const body = {
          caption, image, user_id
        }

      } catch (error) {
        
      }
    }

  return (
    <VStack spacing='24px'>
      <Box  
    maxH="10vh" width= "80%" align-items="center" my="auto" mx="auto" padding={"auto"} rounded={8}>
     <Input type="text" width={"90%"}
          placeholder="What's going on?"
          variant="outline"
          mb="10px"
          bg="gray.400"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}/>
          <Button mx={3} colorScheme="teal" alignItems="center" width="10vh">Post</Button>
          
    {preview? (<Button mx={3} colorScheme="orange" alignItems="center" width="20vh"onClick={() =>{ setPreview(null), setImage(null)}}>remove image</Button>):(<>
      <label for="inputImage"> <Tag variant='subtle' colorScheme='cyan'>
      <TagLeftIcon  boxSize={"12px"} as={AddIcon} />
      <TagLabel>
        Add Image
      </TagLabel>
    </Tag></label>
    <input id="inputImage" style={{visibility: 'hidden'}} type={"file"}
    onChange={onImageChange}/>
    </>)} 
   </Box >
      <Flex wrap={"wrap"} align='center'>
      {mappedPosts}
      </Flex>
    </VStack>
  )
}