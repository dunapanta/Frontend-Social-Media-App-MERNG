import React, { useContext } from 'react'
import { Card, Icon, Label, Image, Button, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'


export default function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes }}){

    const { user } = useContext(AuthContext)

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/post/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }}/>
                <Popup
                    content="Comentarios del Post"
                    inverted
                    trigger={
                        <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                            <Button color='teal' basic>
                                <Icon name='comments' />
                            </Button>
                            <Label basic color='teal' pointing='left'>
                                {commentCount}
                            </Label>
                        </Button>
                    }
                />
                {/* Verify if is the owner */}
                { user && user.username === username  && <DeleteButton postId={id} />}
            </Card.Content>
        </Card>
    )
}