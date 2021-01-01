import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert } from 'react-native';
import { AsyncStorage } from '@react-native-community/async-storage'
import api from './services/api';

const App = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [loggedInUser, setLoggedIn] = useState(null)
  const [projects, setProjects] = useState([])

  const signIn = async () => {
    try {
      const response = await api.post('/auth/authenticate', {
        email: 'guilherme@bergamo.univem.edu.br',
        password: '123456'
      })

      const { user, token } = response.data

      await AsyncStorage.multiSet([
        ['@token', token],
        ['@user', JSON.stringify(user)]
      ])
      Alert.alert('Login com sucesso!')
    }
    catch (res) {
      console.log(res)
      setErrorMessage(res.data.error)
    }
  }

  getProjectList = async () => {
    try {
      const response = await api.get('/projects');
      const { projects } = response.data;
      setProjects(projects);
    } catch (err) {
      setErrorMessage(err.data.error);
    }
  };

  useEffect(() => {
    await AsyncStorage.clear();

    const token = await AsyncStorage.getItem('@token');
    const user = JSON.parse(await AsyncStorage.getItem('@user')) || null;

    if (token && user)
      setLoggedIn(user);
  }, [])

  return (
    <View style={styles.container}>
      { !!errorMessage && <Text>{errorMessage}</Text>}
      { loggedInUser
        ? <Button onPress={getProjectList} title="Carregar projetos" />
        : <Button onPress={signIn} title="Entrar" />}

      { projects.map(project => (
        <View key={project._id} style={{ marginTop: 15 }}>
          <Text style={{ fontWeight: 'bold' }}>{project.title}</Text>
          <Text>{project.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
})

export default App;