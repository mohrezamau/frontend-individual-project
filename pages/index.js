import { Input, Button, Flex, Box, Tag, TagLeftIcon, TagLabel, Text, Link } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import {getSession} from 'next-auth/react'
import { useRouter } from 'next/router';
import {Icon, AddIcon} from '@chakra-ui/icons'

export default function Home() {

  const [caption, setCaption] = useState("")
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const router = useRouter()

  function imagePreview () {
    if (preview){
      return (
        <Box mt={3} px={50} py={25} bg={'gray.100'} width={"85%"} rounded={8}>
        <Image src={preview} width={480} height={320}/>
      </Box>     
    )
    } 
  }

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

  return (
    <Box  
    maxH="10vh" width= "80%" align-items="center" my="auto" mx="auto" padding={"auto"} rounded={6}>
     <Input type="text" width={"90%"}
          placeholder="What's going on?"
          variant="outline"
          mb="10px"
          bg="gray.400"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}/>
          <Button mx={3} colorScheme="teal" alignItems="center" width="10vh">Post</Button>
          
    {preview? (<Button mx={3} colorScheme="orange" alignItems="center" width="10vh"onClick={() =>{ setPreview(null), setImage(null)}}>cancel</Button>):(<>
      <label for="inputImage"> <Tag variant='subtle' colorScheme='cyan'>
      <TagLeftIcon  boxSize={"12px"} as={AddIcon} />
      <TagLabel>
        Add Image
      </TagLabel>
    </Tag></label>
    <input id="inputImage" style={{visibility: 'hidden'}} type={"file"}
    onChange={onImageChange}/>
    </>)}
    
    {imagePreview()}
   </Box>
  )
}


