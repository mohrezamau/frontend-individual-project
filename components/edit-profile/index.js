import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader
    ,ModalCloseButton, ModalFooter, ModalOverlay, ModalBody, Input, } from "@chakra-ui/react";


function editProfile(props) {
  const {isOpen, onClose, userProfile, onSaveProfile} = props;
  const [user, setUser] = useState(userProfile);
  const {username, bio, fullname, email} = user;


  const onHandleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  return (
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
            <Button colorScheme='teal' onClick={onSaveProfile}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}

export default editProfile