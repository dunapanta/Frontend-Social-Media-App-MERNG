import React from 'react'
import App from './App'
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client'
import { setContext } from 'apollo-link-context'

// apunta al endpoit del server
const httpLink = createHttpLink({
    uri: 'http://localhost:5000/'
});

//middleware to add token in header for send a new post
const authLink = setContext((req, prev) => {
    const token = localStorage.getItem('jwtToken')
    return {
        headers:{
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);