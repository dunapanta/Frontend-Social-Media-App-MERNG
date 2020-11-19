import React, { useContext, useState, useRef } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import moment from 'moment'
import { Button, Form, Card, Grid, Image, Icon, Label } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import  LikeButton  from '../components/LikeButton'
import  DeleteButton  from '../components/DeleteButton'

export default function SinglePost(props){
    const { user } = useContext(AuthContext)
    const commentInputRef = useRef(null)

    const postId = props.match.params.postId
    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    const [comment, setComment] =  useState('')

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update(){
            setComment('')
            commentInputRef.current.blur()
        },
        variables:{
            postId,
            body: comment
        }
    })

    const deletePostCard = () => {
        props.history.push('/')
    }

    let postMarkup = <p>Loading Post...</p>
   
    if(data !== undefined){
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost
    
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            size="small"
                            float="rigth"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={ user } post={{ id, likeCount, likes }}/>
                                <Button 
                                    as="div"
                                    labelPosition="right"
                                    onClick={ () => console.log('Comment on post')}
                                >
                                    <Button basic color="teal">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                { user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCard}/>
                                )}
                            </Card.Content>
                        </Card>
                        { user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Agregar Comentario</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comentar"
                                                name="comment"
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button 
                                                type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}
                                            >
                                                Enviar
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                              <Card.Content>
                                  {user && user.username === comment.username && (
                                      <DeleteButton postId={id} commentId={comment.id} />
                                  )}
                                  <Card.Header>{comment.username}</Card.Header>
                                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                  <Card.Description>{comment.body}</Card.Description>
                              </Card.Content>  
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup
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

const SUBMIT_COMMENT_MUTATION = gql `
    mutation($postId: String!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`