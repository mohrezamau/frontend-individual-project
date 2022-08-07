import { Input, Button, Flex, Box, Tag, TagLeftIcon, TagLabel, Text, Link, VStack, Badge, HStack, Spacer
,Stack, Image, Alert, AlertIcon } from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import {getSession} from 'next-auth/react'
import { useRouter } from 'next/router';
import {Icon, AddIcon, StarIcon} from '@chakra-ui/icons'
import axiosInstance from '../services/axiosinstance'
import next from 'next'


export default function Home(props) {

  const [isLiked, setIsLiked] = useState("false")
  const [caption, setCaption] = useState("")
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(props.user);
  const [allPosts, setAllPosts] = useState(props.allPosts);
  const router = useRouter()
  const [session, setSession] = useState(false)
 
  console.log({props})

  function renderPosts (post) {
    const addressAPI = "http://localhost:2105"
    const addressImage = addressAPI.concat(`${post.image}`)
    const createdAt = post.createdAt
    const slicedCreatedAt = createdAt.slice(0,10)
    const postId = post.post_id
    // key={postId} href={`/postdetail/${postId}'}
    return (
        <Link key={postId} href={`/postdetail/${postId}`}>
        <Box as='button' bg={"gray.100"} alignContent={"center"} alignItems={"center"} boxShadow={"2xl"}
        width={480} maxH={1200} borderWidth='1px' borderRadius='lg' overflow='hidden' mt={20} mx={12} _hover={{    background: "white",
        color: "orange.400",}}>
      <Image src={addressImage} width={480} height={320} borderWidth='1px' borderRadius='lg' overflow='hidden'/>
      <Box p='3'>
        <Box display='flex' alignItems='baseline'>
        <Badge borderRadius='md' px='2' colorScheme='teal'>
            Posted by {post.username}
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
        <></>
          <Box as='span' ml='2' color='gray.600' fontSize='sm'>
            {post.likeCount}
          </Box>
        </Box>
      </Box>
    </Box>
        </Link>
          
    )
  }
  const [] = allPosts;
  //const mappedPosts = testPosts.map(renderPosts)
  const mappedPosts = allPosts.map(renderPosts)
  
  async function getSessionAsync(){
    const session = await getSession()
    setSession(true)
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
          window.location.reload();
      } catch (error) {
        alert(error)
        console.log(error)
      } finally {
        setLoading(false)
        setImage(null)
        setCaption(null)
        setPreview(null)
      }
    }
  
  

  return (
    <VStack spacing='18px'>
      {user.isVerified?(<>
        <Box  
    maxH="10vh" width= "80%" align-items="center" my="auto" mx="auto" padding={"auto"} rounded={8}>
      <Text mb={3} fontSize={"3xl"} fontWeight={"semibold"} color={"teal.500"} fontStyle={'normal'}>Hi! {user.username}!</Text>
     <Input type="text" width={"100%"}
          placeholder="What's going on?"
          variant="outline"
          mb="10px"
          bg="gray.50"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}/>
          {loading?(
            <Button mx={3} isLoading
            variant={"outline"} colorScheme="teal" alignItems="center" width="20vh" 
            onClick={onPostClick}>
              Pepe Post!
            </Button>
          ):(
            <Button mx={3} 
          variant={"outline"} colorScheme="teal" alignItems="center" width="20vh" 
          onClick={onPostClick}>
            Pepe Post!
          </Button>
          )}
          
    {preview? 
    (<>{loading?(
      <Button mx={3} isLoading colorScheme="orange" alignItems="center" width="22vh" onClick={() =>{ setPreview(null), setImage(null)}}>Remove Image</Button>
    ):(
      <Button mx={3} colorScheme="orange" alignItems="center" width="22vh" onClick={() =>{ setPreview(null), setImage(null)}}>Remove Image</Button>
    )}
    </>):(<>
      <label for="inputImage"> <Tag variant='outline' colorScheme='teal'>
      <TagLeftIcon boxSize={"12px"} as={AddIcon} />
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
      </>):(<Alert status='info' rounded={6} mt={3}>
      <AlertIcon />
      Your account is not verified! please check your profile to send a new email verification!
    </Alert>)}
      
    </VStack>
  )
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({req: context.req});

    if (!session) return {redirect: {destination: "/login"}};
      console.log(`HOME SESSION ${session}`)
    const {accessToken} = session.user;

    const config = {
      headers: {Authorization: `Bearer ${accessToken}`},
    };

    const user_id = session.user.user_id;
   // console.log({user_id})
    const res = await axiosInstance.get(`/users/profile/${user_id}`, config);
    const postRes = await axiosInstance.get(`/posts`);

    return {
      props: {user: res.data.data.result, allPosts: postRes.data.data, session},
    };
  } catch (error) {
    console.log({error});
    return {props: {}};
  }
}