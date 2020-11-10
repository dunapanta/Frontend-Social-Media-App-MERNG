import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Label, Button } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

export default function LikeButton({ user, post: { id, likeCount, likes }}) {
    const [liked, setLiked] = useState(false);
    useEffect( () => {
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [user, likes])

    const [likePost] = useMutation(LIKED_POST_MUTATION, {
        variables: { postId: id }
    })

    const likeButton = user ? (
        liked ? (
            <Button color='red'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='red' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        <Button as={Link} to="/login" color='red' basic>
            <Icon name='heart' />
        </Button>
    )

    return(
            <Button as='div' labelPosition='right' onClick={likePost}>
                {likeButton}
                <Label basic color='red' pointing='left'>
                    {likeCount}
                </Label>
            </Button>
    )
}

/* al obtener el id del post no es necesario actualizar el front con proxy apollo se da cuenta */

const LIKED_POST_MUTATION = gql `
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id
                username
            }
            likeCount
        }
    }
`