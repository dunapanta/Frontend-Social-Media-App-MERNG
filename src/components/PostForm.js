import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { useForm } from '../hooks/useForm'

export default function PostForm(){

    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body:""
    })

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,

        update(proxy, result) {
            values.body = "";
        },
        onError(err) {
            //console.log(err)
        },
        refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Crear nuevo post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Qué estás pensando?"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type="submit" color="teal">
                        Crear
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" styele={{ marginBotton: 20 }}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id
            body
            createdAt
            username
            likes{
                id
                username
                createdAt
            }
            likeCount
            comments{
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`

const FETCH_POSTS_QUERY = gql `
    {
        getPosts {
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
                id username createdAt body
            }
        }
    }
`


