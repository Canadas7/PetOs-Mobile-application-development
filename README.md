PetOS

Vídeo de apresentação:
https://youtube.com/shorts/3k8P1Fca4cI?si=Ib036zEHVZC59WaG

Sobre o Projeto

O PetOS é uma plataforma digital de cuidado contínuo para pets, desenvolvida para centralizar informações de saúde, rotina e histórico dos animais em um único sistema.

Nesta Sprint 3, o projeto deixou de funcionar apenas como um protótipo local e passou a consumir uma API REST real, com autenticação, persistência de sessão, integração entre perfis de usuário e operações completas de CRUD.

A solução possui dois perfis principais:

Tutor, responsável pelo cadastro e gerenciamento dos próprios pets, registro de cuidados e acompanhamento do histórico;

Clínica Veterinária, responsável pela consulta dos pets cadastrados e gerenciamento das vacinas.

O objetivo é facilitar a organização das informações dos animais e melhorar a comunicação entre tutor e clínica dentro de uma única aplicação.

Objetivo da Solução

O PetOS busca resolver problemas comuns no acompanhamento da saúde e rotina dos pets, como:

dificuldade em organizar informações dos animais;

esquecimento ou falta de acompanhamento de vacinas;

perda de histórico de cuidados;

falta de centralização das informações entre tutor e clínica;

dificuldade em acompanhar rotinas realizadas com o pet.

Nesta Sprint 3, a aplicação passou a oferecer:

autenticação real;

cadastro de usuários;

controle de sessão;

perfis com permissões diferentes;

CRUD completo de pets;

CRUD completo de vacinas;

CRUD de cuidados e rotinas;

histórico do pet;

alertas;

integração real entre aplicativo mobile e backend.

Tecnologias Utilizadas

Desenvolvimento Mobile

React Native

Expo

TypeScript

Navegação

React Navigation

Native Stack Navigation

Comunicação com API

API REST

Fetch

TanStack Query

Autenticação

JWT

AsyncStorage para persistência da sessão

Componentes Visuais

Expo Vector Icons

StyleSheet API

Backend

Java

Spring Boot

Spring Security

JWT

Funcionalidades Implementadas

Autenticação

O aplicativo possui autenticação real integrada ao backend.

Foram implementados:

cadastro de usuário;

login;

persistência da sessão;

recuperação dos dados do usuário;

rotas protegidas;

logout.

Ao entrar no aplicativo, o usuário permanece autenticado mesmo após fechar e abrir novamente o app.

Perfis de Usuário

O PetOS possui dois perfis:

Tutor

O Tutor pode:

cadastrar pets;

visualizar seus pets;

editar informações dos pets;

excluir pets;

visualizar vacinas;

registrar cuidados;

editar cuidados;

excluir cuidados;

consultar histórico;

visualizar alertas.

Clínica Veterinária

A Clínica pode:

consultar os pets cadastrados;

visualizar os detalhes dos pets;

consultar cuidados registrados pelo tutor;

cadastrar vacinas;

editar vacinas;

excluir vacinas.

Cada perfil possui permissões diferentes dentro da aplicação.

CRUD de Pets

Foi implementado um CRUD completo de pets integrado à API.

O Tutor pode:

Create: cadastrar um novo pet;

Read: visualizar a lista e os detalhes do pet;

Update: editar as informações cadastradas;

Delete: excluir o pet.

Informações disponíveis:

nome;

espécie;

raça;

data de nascimento;

idade;

peso;

tutor responsável;

telefone do tutor.

CRUD de Vacinas

A Clínica Veterinária possui acesso ao gerenciamento de vacinas.

Foram implementadas as operações:

cadastrar vacina;

listar vacinas;

editar vacina;

excluir vacina.

As vacinas podem apresentar diferentes status, como:

pendente;

aplicada;

próxima do vencimento;

vencida.

O Tutor consegue visualizar essas informações no aplicativo.

Cuidados e Rotinas

O Tutor pode registrar cuidados realizados com o pet.

Entre os tipos disponíveis estão:

passeio;

alimentação;

medicamento;

banho;

higiene;

consulta veterinária;

treinamento;

outros.

Também foram implementadas as operações de:

cadastro;

consulta;

edição;

exclusão.

Essas informações ficam disponíveis no histórico do pet.

Histórico do Pet

A aplicação possui uma área de histórico integrada ao backend.

O histórico reúne informações relacionadas a:

vacinas;

cuidados e rotinas;

alertas.

A tela de detalhes do pet também apresenta um resumo dessas informações, permitindo uma consulta mais completa do animal.

Alertas

O PetOS consulta alertas registrados pelo backend e apresenta essas informações ao Tutor.

Os alertas podem estar relacionados, por exemplo, ao acompanhamento de vacinas.

Nesta versão, os alertas são exibidos dentro da aplicação e não utilizam notificações push.

Navegação Entre Telas

A aplicação possui mais de seis telas funcionais, entre elas:

LoginScreen

RegisterScreen

HomeScreen

ClinicHomeScreen

PetsListScreen

PetRegisterScreen

PetDetailsScreen

HistoryScreen

VaccinesScreen

ProfileScreen

A navegação é protegida de acordo com o estado de autenticação do usuário.

TanStack Query

O TanStack Query foi utilizado para controlar as requisições realizadas pelo aplicativo.

A lógica foi separada das telas utilizando hooks personalizados.

Exemplos:

usePets
usePetDetails
useVaccines
useAllVaccines
useRoutines
usePetHistory
useAlerts
useTutorVaccines
useLogin
useRegister

Dessa forma, as telas ficam responsáveis principalmente pela interface, enquanto os hooks controlam:

consultas;

mutations;

loading;

erros;

atualização dos dados;

invalidação de cache.

Exemplo de fluxo:

PetsListScreen
      ↓
usePets
      ↓
petService
      ↓
api.ts
      ↓
Backend

Estrutura do Projeto

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

Integração com o Backend

O aplicativo utiliza uma API REST real desenvolvida em Spring Boot.

Backend em produção:

https://petos-java.onrender.com

Repositório do backend:

https://github.com/gugomesx10/PetOS-Java

Principais Endpoints Utilizados

Autenticação

POST /auth/register
POST /auth/login
GET  /auth/me

Pets

GET    /pets
GET    /pets/{id}
POST   /pets
PUT    /pets/{id}
DELETE /pets/{id}

Vacinas

GET    /vaccines
GET    /vaccines/{id}
GET    /pets/{petId}/vaccines
POST   /vaccines
PUT    /vaccines/{id}
DELETE /vaccines/{id}

Cuidados / Rotinas

GET    /pets/{petId}/routines
POST   /routines
PUT    /routines/{id}
DELETE /routines/{id}

Histórico

GET /pets/{id}/history

Alertas

GET /alerts/pending

Persistência de Dados

Na Sprint 3, os dados principais do aplicativo não ficam mais armazenados localmente.

Pets, vacinas, cuidados, histórico e alertas são obtidos através da API.

O AsyncStorage é utilizado para persistir a sessão de autenticação, permitindo manter o usuário conectado mesmo após fechar o aplicativo.

Como Executar o Projeto

Clone o repositório:

git clone https://github.com/Canadas7/PetOs-Mobile-application-development.git

Entre na pasta do projeto:

cd PetOs-Mobile-application-development

Instale as dependências:

npm install

Inicie o Expo:

npx expo start

Depois, utilize o Expo Go ou um emulador compatível para executar o aplicativo.

Validação do Projeto

Para verificar possíveis erros de TypeScript:

npx tsc --noEmit

Para verificar a compatibilidade das dependências do Expo:

npx expo-doctor@latest

Repositórios

Mobile

https://github.com/Canadas7/PetOs-Mobile-application-development

Backend

https://github.com/gugomesx10/PetOS-Java

Integrantes

Preencher com os dados da equipe:

Nome:
RM:

Nome:
RM:

Sprint 3

Nesta Sprint, o foco principal foi transformar o protótipo mobile em uma aplicação integrada de forma real ao backend.

Foram implementados:

autenticação com JWT;

persistência de sessão;

integração com API REST;

CRUD completo de pets;

CRUD completo de vacinas;

CRUD de cuidados;

histórico;

alertas;

diferenciação entre Tutor e Clínica;

TanStack Query;

hooks personalizados;

separação entre interface, lógica e serviços.

O resultado é uma aplicação mobile funcional, integrada ao backend e preparada para evolução nas próximas etapas do projeto.
