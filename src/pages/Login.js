import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
 import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import { useForm } from '../hooks/useForm'

export default function Login(props){
    const [error, setError] = useState({})
    
    const initialState = {
        username: '',
        password: ''
    }
    // Because of hoisting the functions reconice at the begining of the program
    const { onChange, onSubmit, values } = useForm(loginUserCallback, initialState)

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        // trigger if the mutation was successfully executes
        update(proxy, result){
            props.history.push('/')
        },
        onError(err){
            /* console.log(err.graphQLErrors[0].extensions.exception.errors) */
            setError(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    function loginUserCallback() {
        loginUser()
    }

    return(
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Login</h1>
                <Form.Input
                    label="Nombre de Usuario"
                    placeholder="Nombre de Usuario..."
                    name="username"
                    type="text"
                    value={values.username}
                    error={error.username ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Contraseña"
                    placeholder="Contraseña..."
                    name="password"
                    type="password"
                    value={values.password}
                    error={error.password ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>Login</Button>
            </Form>

            { Object.keys(error).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(error).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

// Mutation para validaciones del server

const LOGIN_USER = gql `
    mutation login(
        $username: String!
        $password: String!
    ){
        login(
            username: $username
            password: $password
        ){
            id 
            email
            username
            token
            createdAt
        }
    }
`