import React, { useEffect, useState } from "react";
//import { SafeAreaView, FlatList, Text, StyleSheet, StatusBar, TouchableOpacity, BackHandler } from 'react-native';

import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [ repositories, setRepositories ] = useState([]);

  useEffect( () => {
    api.get('/repositories').then(response => {
      //console.log(response.data);
      setRepositories(response.data)
    });
  }, [] ); // array de dependencia 

  async function handleLikeRepository(id) {
    // Implement "Like Repository" functionality
    const postResponse = await api.post(`repositories/${id}/like`);

    // armazeno a resposta do "post" dentro da variável updateRepository

    const repoIndex = repositories.findIndex( repository=> repository.id === id);

    // // cria uma copia do array da variavel repositorios
    // const updatedRepository = [...repositories];

    // console.log(updatedRepository);

    // updatedRepository[repoIndex] = postResponse.data;

    // console.log(updatedRepository);

    // setRepositories( [updatedRepository ]);

    const { likes } = postResponse.data;

     setRepositories([
         ...repositories.map((repository) => {
           if (repository.id === id) {
               return {...repository, likes };
           }
           return repository;
         }),
     ]);

}  
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: repository }) => (
          <View style={styles.repositoryContainer}>
            <Text style={styles.repository}>{repository.title}</Text>

            <View style={styles.techsContainer}>
                {repository.techs.map((tech) => (
                  <Text style={styles.tech} key={tech}>
                    {tech}
                  </Text>
                ))}
            </View>

            <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
        )}
       />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
