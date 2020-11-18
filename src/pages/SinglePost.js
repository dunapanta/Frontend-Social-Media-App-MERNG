import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import moment from 'moment'
import { Button, Card, Grid, Image, Icon, Label } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import  LikeButton  from '../components/LikeButton'
import  DeleteButton  from '../components/DeleteButton'

export default function SinglePost(props){
    const { user } = useContext(AuthContext)
    const postId = props.match.params.postId
    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
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