import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
 import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

export default function Register(props){
    const [error, setError] = useState({})
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value })
    }

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        // trigger if the mutation was successfully executes
        update(proxy, result){
            console.log(result)
            props.history.push('/')
        },
        onError(err){
            console.log(err.graphQLErrors[0].extensions.exception.errors)
            setError(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    const onSubmit = (e) => {
        e.preventDefault();
        addUser()
    }


    return(
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Registro</h1>
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
                    label="Correo Electrónico"
                    placeholder="Correo Electrónico..."
                    name="email"
                    type="email"
                    value={values.email}
                    error={error.email ? true : false}
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
                <Form.Input
                    label="Confirmar Contraseña"
                    placeholder="Confirmar Contraseña..."
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    error={error.confirmPassword ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>Resgistrarse</Button>
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

const REGISTER_USER = gql `
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ){
        register(
            registerInput:{
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            id 
            email
            username
            token
            createdAt
        }
    }
`