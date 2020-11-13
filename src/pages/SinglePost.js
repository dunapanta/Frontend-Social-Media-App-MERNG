import React from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

export default function SinglePost(props){
    const postId = props.match.params.postId
    const { data: { getPost }} = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })
    let postMarkup
    if(!getPost){
        postMarkup = <p>Loading...</p>
    }
}

const FETCH_POST_QUERY = gql `
    query($postId: ID!){
        getPost(postId: $postId){
            id
            body
            createdAt
            username
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id
                username
                createdAt
                body
            }
        }
    }
`