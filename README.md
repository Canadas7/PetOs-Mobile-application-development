# PetOS

Vídeo de apresentação:  
[https://youtube.com/shorts/3k8P1Fca4cI?si=Ib036zEHVZC59WaG](https://www.youtube.com/watch?is=h-qsFgHqqMRPVpt4&v=qPNdumC8XH8&feature=youtu.be)

## Sobre o Projeto

O PetOS é uma plataforma digital de cuidado contínuo para pets, desenvolvida para centralizar informações de saúde, rotina e histórico dos animais em um único sistema.

Na Sprint 3, o projeto evoluiu de um protótipo mobile para uma aplicação integrada a uma API REST real, com autenticação, persistência de sessão, diferentes perfis de usuário e operações completas de CRUD.

A solução possui dois perfis principais:

- Tutor
- Clínica Veterinária

O Tutor pode gerenciar seus pets, registrar cuidados, acompanhar vacinas, consultar o histórico e visualizar alertas.

A Clínica Veterinária pode consultar os pets cadastrados e realizar o gerenciamento das vacinas.

---

# Objetivo da Solução

O PetOS busca facilitar o acompanhamento da saúde e da rotina dos animais, centralizando informações importantes dentro de uma única aplicação.

O projeto busca resolver problemas como:

- dificuldade na organização das informações dos pets
- falta de acompanhamento das vacinas
- perda do histórico de cuidados
- dificuldade de comunicação entre tutor e clínica
- falta de organização da rotina dos animais

Nesta Sprint foram implementados:

- autenticação real
- cadastro de usuários
- persistência de sessão
- perfis Tutor e Clínica
- CRUD completo de Pets
- CRUD completo de Vacinas
- CRUD de Cuidados
- histórico do pet
- alertas
- integração com API REST
- TanStack Query
- hooks personalizados

---

# Tecnologias Utilizadas

## Desenvolvimento Mobile

- React Native
- Expo
- TypeScript

## Navegação

- React Navigation
- Native Stack Navigation

## Gerenciamento de Dados

- TanStack Query
- Fetch API

## Persistência

- AsyncStorage

## Autenticação

- JWT

## Interface

- Expo Vector Icons
- StyleSheet API

## Backend

- Java
- Spring Boot
- Spring Security
- API REST

---

# Autenticação

O aplicativo possui autenticação real integrada ao backend.

Foram implementadas as seguintes funcionalidades:

- cadastro de usuário
- login
- autenticação com JWT
- persistência da sessão
- recuperação dos dados do usuário
- rotas protegidas
- logout

Após realizar o login, a sessão permanece salva mesmo após fechar e abrir novamente o aplicativo.

O AsyncStorage é utilizado para persistir os dados necessários da sessão.

---

# Perfis de Usuário

## Tutor

O Tutor pode:

- cadastrar pets
- visualizar seus pets
- consultar detalhes dos pets
- editar pets
- excluir pets
- visualizar vacinas
- registrar cuidados
- editar cuidados
- excluir cuidados
- consultar histórico
- visualizar alertas
- acessar o perfil
- realizar logout

---

## Clínica Veterinária

A Clínica pode:

- consultar os pets cadastrados
- visualizar detalhes dos pets
- consultar os cuidados registrados pelos tutores
- cadastrar vacinas
- editar vacinas
- excluir vacinas
- acompanhar informações dos animais
- acessar o perfil
- realizar logout

A Clínica não possui permissão para editar ou excluir os pets dos Tutores.

---

# CRUD de Pets

Foi implementado um CRUD completo de Pets integrado à API.

## Create

O Tutor pode cadastrar um novo pet.

## Read

O Tutor e a Clínica podem consultar os pets cadastrados e acessar seus detalhes.

## Update

O Tutor pode alterar as informações de seus pets.

## Delete

O Tutor pode excluir seus pets.

As informações cadastradas incluem:

- nome
- espécie
- raça
- data de nascimento
- idade
- peso
- tutor responsável
- telefone do tutor

---

# CRUD de Vacinas

A Clínica Veterinária possui acesso ao gerenciamento das vacinas.

Foram implementadas as operações:

- cadastrar vacina
- listar vacinas
- editar vacina
- excluir vacina

As vacinas podem apresentar diferentes status:

- Pendente
- Aplicada
- Próxima do vencimento
- Vencida

As informações cadastradas pela Clínica também podem ser visualizadas pelo Tutor.

---

# Cuidados e Rotinas

O Tutor pode registrar cuidados realizados com o pet.

Os tipos de cuidados disponíveis incluem:

- Passeio
- Alimentação
- Medicamento
- Banho
- Higiene
- Consulta Veterinária
- Treinamento
- Outros

Também foram implementadas as operações de:

- cadastro
- consulta
- edição
- exclusão

Os cuidados registrados ficam disponíveis no histórico do animal.

---

# Histórico do Pet

A aplicação possui uma área de histórico integrada ao backend.

O histórico reúne informações relacionadas a:

- vacinas
- cuidados
- rotinas
- alertas

A tela de detalhes do pet também apresenta um resumo dessas informações.

Dessa forma, Tutor e Clínica conseguem visualizar informações importantes do animal de forma centralizada.

---

# Alertas

O PetOS consulta alertas registrados pelo backend e apresenta essas informações ao Tutor.

Os alertas podem estar relacionados, por exemplo, ao acompanhamento das vacinas.

Nesta versão do projeto, os alertas são exibidos dentro da aplicação.

Não foi implementado envio de notificações push.

---

# Detalhes do Pet

A tela de detalhes apresenta informações completas do animal.

São exibidos:

- nome
- espécie
- raça
- idade
- peso
- tutor
- telefone
- quantidade de vacinas
- cuidados recentes
- alertas
- histórico resumido

O Tutor também pode editar as informações do pet diretamente por essa tela.

Para a Clínica, a tela funciona principalmente como consulta.

---

# Navegação Entre Telas

O aplicativo possui navegação funcional entre múltiplas telas.

As principais telas são:

- LoginScreen
- RegisterScreen
- HomeScreen
- ClinicHomeScreen
- PetsListScreen
- PetRegisterScreen
- PetDetailsScreen
- HistoryScreen
- VaccinesScreen
- ProfileScreen

A navegação é controlada de acordo com o estado de autenticação do usuário.

---

# TanStack Query

O TanStack Query foi utilizado para controlar as requisições realizadas pelo aplicativo.

A lógica de requisições foi separada da interface utilizando hooks personalizados.

Entre os hooks utilizados estão:

- usePets
- usePetDetails
- useVaccines
- useAllVaccines
- useRoutines
- usePetHistory
- useAlerts
- useTutorVaccines
- useLogin
- useRegister

Os hooks são responsáveis por:

- consultas
- mutations
- loading
- tratamento de erros
- atualização dos dados
- invalidação de cache

As telas ficam responsáveis principalmente pela interface e interação com o usuário.

---

# Arquitetura da Aplicação

A aplicação foi organizada separando interface, lógica e comunicação com a API.

```text
src/
├── components/
│   └── BottomNavigation.tsx
│
├── contexts/
│   └── AuthContext.tsx
│
├── hooks/
│   ├── useAlerts.ts
│   ├── useAllVaccines.ts
│   ├── useLogin.ts
│   ├── usePetDetails.ts
│   ├── usePetHistory.ts
│   ├── usePets.ts
│   ├── useRegister.ts
│   ├── useRoutines.ts
│   ├── useTutorVaccines.ts
│   └── useVaccines.ts
│
├── screens/
│   ├── LoginScreen.tsx
│   ├── Register.tsx
│   ├── HomeScreen.tsx
│   ├── ClinicHomeScreen.tsx
│   ├── PetsListScreen.tsx
│   ├── PetRegisterScreen.tsx
│   ├── PetDetailsScreen.tsx
│   ├── HistoryScreen.tsx
│   ├── VaccinesScreen.tsx
│   └── ProfileScreen.tsx
│
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── petService.ts
│   ├── vaccineService.ts
│   ├── routineService.ts
│   ├── historyService.ts
│   └── alertService.ts
│
├── storage/
│   └── authStorage.ts
│
├── styles/
│   └── colors.ts
│
└── types/
