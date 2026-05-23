# PetOS
https://youtube.com/shorts/3k8P1Fca4cI?si=Ib036zEHVZC59WaG
## Sobre o Projeto

O PetOS é uma plataforma digital de cuidado contínuo para pets, desenvolvida para centralizar saúde, rotina e histórico dos animais em um único sistema.

O projeto busca resolver problemas comuns enfrentados por tutores, como:

- esquecimento de vacinas
- baixa adesão a cuidados preventivos
- dificuldade no acompanhamento contínuo da saúde do pet
- perda de histórico entre clínicas veterinárias
- falta de organização da rotina dos animais

Nesta primeira sprint, foi desenvolvido um protótipo funcional mobile utilizando React Native com Expo, simulando o funcionamento inicial da solução.

---

# Objetivo da Solução

A proposta do PetOS é oferecer um ecossistema digital moderno para acompanhamento da saúde e rotina dos pets, permitindo:

- cadastro e gerenciamento de pets
- controle de vacinas e consultas
- registro de rotinas e cuidados
- geração de alertas automáticos
- acompanhamento contínuo da saúde do animal

O projeto também possui foco em:

- experiência do usuário
- organização das informações
- persistência de dados
- escalabilidade futura da plataforma
- integração entre mobile, backend e serviços inteligentes

---

# Tecnologias Utilizadas

## Desenvolvimento Mobile

- React Native
- Expo
- TypeScript

## Navegação

- React Navigation
- Native Stack Navigation

## Persistência Local

- AsyncStorage

## Manipulação de Imagens

- Expo Image Picker

## Componentes Visuais

- Expo Vector Icons
- StyleSheet API

---

# Funcionalidades Implementadas

## Login do Tutor

O aplicativo possui tela de login com persistência do nome do usuário utilizando AsyncStorage.

---

## Cadastro de Pets

O sistema permite cadastrar:

- nome
- espécie
- raça
- idade
- imagem do pet

As informações ficam armazenadas localmente no dispositivo.

---

## Upload de Imagens

O aplicativo permite selecionar imagens diretamente da galeria do dispositivo utilizando Expo Image Picker.

As imagens aparecem:

- na Home
- na lista de pets
- nos detalhes do pet

---

## Lista de Pets

O usuário consegue visualizar todos os pets cadastrados no aplicativo.

Também foi implementada a funcionalidade de exclusão de pets.

---

## Detalhes do Pet

A tela de detalhes exibe:

- nome
- espécie
- raça
- idade
- imagem do pet
- informações simuladas de saúde

---

## Dashboard

O Dashboard exibe informações reais cadastradas no aplicativo:

- quantidade de pets
- resumo dos pets cadastrados
- espécie principal
- status do sistema

---

## Tela de Perfil

A tela de perfil recupera os dados do tutor armazenados localmente utilizando AsyncStorage.

---

# Navegação Entre Telas

O aplicativo possui navegação funcional entre múltiplas telas:

- LoginScreen
- HomeScreen
- PetRegisterScreen
- PetsListScreen
- PetDetailsScreen
- DashboardScreen
- ProfileScreen

A navegação foi implementada utilizando React Navigation.

---

# Manipulação de Estado

O projeto utiliza `useState` para controle dinâmico dos dados e formulários.

Exemplos implementados:

- nome do tutor
- cadastro de pets
- atualização da lista de pets
- upload de imagens
- exibição dinâmica dos dados

---

# Persistência de Dados

Foi utilizado AsyncStorage para armazenamento local das informações.

Os dados permanecem salvos mesmo após:

- fechar o aplicativo
- reiniciar o Expo
- navegar entre telas

Dados persistidos:

- nome do tutor
- pets cadastrados
- imagens dos pets
- informações dos pets

---

# Estrutura do Projeto

```bash
screens/
components/
storage/
types/
styles/
