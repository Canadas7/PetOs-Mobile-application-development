# PetOS

Vídeo de apresentação:  
https://youtu.be/lcFd6p04ea4?is=i5uhJgpmSKX5rLi4

---

## Sobre o Projeto

O **PetOS** é uma plataforma digital de cuidado contínuo para pets, desenvolvida para centralizar informações de saúde, rotina, vacinação e histórico dos animais em um único sistema.

Na Sprint 4, o projeto foi consolidado como uma aplicação mobile completa, integrada a uma API REST real e preparada para entrega final.

A solução possui dois perfis principais:

- Tutor
- Clínica Veterinária

O Tutor pode gerenciar seus pets, registrar cuidados, acompanhar vacinas, consultar o histórico, visualizar alertas e receber notificações relacionadas à saúde dos animais.

A Clínica Veterinária pode consultar os pets cadastrados e realizar o gerenciamento das vacinas.

---

# Objetivo da Solução

O PetOS busca facilitar o acompanhamento da saúde e da rotina dos animais, centralizando informações importantes em uma única aplicação.

O projeto busca resolver problemas como:

- dificuldade na organização das informações dos pets
- falta de acompanhamento das vacinas
- perda do histórico de cuidados
- dificuldade de comunicação entre tutor e clínica
- falta de organização da rotina dos animais
- ausência de alertas relacionados à saúde dos pets

Na versão atual foram implementados:

- autenticação real
- cadastro de usuários
- persistência de sessão
- perfis Tutor e Clínica
- CRUD completo de Pets
- CRUD completo de Vacinas
- CRUD de Cuidados e Rotinas
- histórico do pet
- alertas integrados ao backend
- notificações locais
- navegação através da notificação
- tema claro e escuro
- tela Sobre o App
- integração com API REST
- TanStack Query
- hooks personalizados
- organização em camadas
- persistência local com AsyncStorage

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

## Notificações

- Expo Notifications
- Local Notifications

## Interface

- Expo Vector Icons
- StyleSheet API
- Tema claro e escuro

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

O `AsyncStorage` é utilizado para persistir os dados necessários da sessão.

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
- receber notificações relacionadas aos pets
- acessar o perfil
- alternar entre tema claro e escuro
- acessar a tela Sobre o App
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
- alternar entre tema claro e escuro
- acessar a tela Sobre o App
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

O acompanhamento das vacinas também é utilizado pelo sistema de alertas e notificações.

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

O PetOS consulta os alertas registrados pelo backend e apresenta essas informações ao Tutor.

Os alertas podem estar relacionados ao acompanhamento das vacinas e demais informações relevantes do pet.

Os alertas são obtidos através da API e utilizados tanto para exibição dentro da aplicação quanto para a geração das notificações locais.

---

# Notificações Locais

Na Sprint 4 foi implementado um sistema de notificações locais integrado aos alertas reais do backend.

O fluxo funciona da seguinte forma:

```text
Backend gera um alerta
        ↓
Aplicativo consulta os alertas pendentes
        ↓
useAlerts processa os dados
        ↓
notificationService gera a notificação local
        ↓
Tutor recebe a notificação
        ↓
Tutor toca na notificação
        ↓
Aplicativo abre o pet correspondente
```

As notificações apresentam informações relacionadas ao pet e ao alerta recebido.

Exemplo:

```text
PetOS

Alerta de Thor

A vacina está próxima do vencimento.
```

Ao tocar na notificação, o usuário é direcionado para a tela de detalhes do pet relacionado ao alerta.

Para evitar notificações repetidas, os alertas já exibidos são registrados localmente utilizando `AsyncStorage`.

---

# Tema Claro e Escuro

A Sprint 4 também adicionou suporte a tema claro e escuro.

O usuário pode alternar entre os modos através da aplicação.

A preferência de tema é mantida para que a experiência permaneça consistente entre as sessões.

O recurso foi implementado preservando a identidade visual do PetOS e garantindo contraste adequado nos dois modos.

---

# Sobre o App

O aplicativo possui uma tela **Sobre o App**, criada para identificar a versão utilizada na entrega.

A tela apresenta informações da aplicação e o commit de referência correspondente à versão publicada.

Isso permite relacionar a versão instalada do aplicativo com o código-fonte disponível no repositório.

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

A tela também pode ser acessada através de uma notificação relacionada ao pet.

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
- AboutScreen

A navegação é controlada de acordo com o estado de autenticação e o perfil do usuário.

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

Essa separação reduz o acoplamento entre interface e acesso aos dados.

---

# Arquitetura da Aplicação

A aplicação foi organizada separando interface, lógica de negócio, estado e comunicação com a API.

```text
src/
├── components/
│   └── BottomNavigation.tsx
│
├── contexts/
│   ├── AuthContext.tsx
│   └── ...
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
│   ├── ProfileScreen.tsx
│   └── AboutScreen.tsx
│
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── petService.ts
│   ├── vaccineService.ts
│   ├── routineService.ts
│   ├── historyService.ts
│   ├── alertService.ts
│   └── notificationService.ts
│
├── storage/
│   └── authStorage.ts
│
├── styles/
│   └── colors.ts
│
└── types/
```

---

# Organização em Camadas

O projeto foi estruturado buscando separar responsabilidades.

## Screens

Responsáveis pela interface e interação com o usuário.

## Hooks

Responsáveis pelo gerenciamento de consultas, mutations e estados relacionados aos dados.

## Services

Responsáveis pela comunicação com a API e serviços externos.

## Contexts

Responsáveis por estados globais, como autenticação e configurações compartilhadas.

## Storage

Responsável pela persistência local de informações.

Essa organização facilita a manutenção, leitura e evolução do projeto.

---

# API REST

O aplicativo consome uma API REST desenvolvida em Java com Spring Boot.

Backend:

```text
https://petos-java.onrender.com
```

Entre os principais recursos utilizados estão:

```text
/auth
/pets
/vaccines
/routines
/alerts
/history
```

O aplicativo realiza as operações utilizando requisições HTTP e autenticação JWT.

---

# Fluxo Principal da Aplicação

Um dos principais fluxos do PetOS funciona da seguinte forma:

```text
Usuário realiza login
        ↓
Sessão é validada
        ↓
Perfil Tutor ou Clínica é identificado
        ↓
Aplicativo carrega os dados da API
        ↓
Tutor acompanha pets, cuidados, vacinas e alertas
        ↓
Clínica gerencia informações de vacinação
        ↓
Backend gera alertas
        ↓
Tutor recebe notificações relacionadas ao pet
```

---

# Execução do Projeto

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npx expo start
```

Caso seja necessário limpar o cache:

```bash
npx expo start -c
```

Para validar possíveis problemas no projeto Expo:

```bash
npx expo-doctor@latest
```

Para verificar erros do TypeScript:

```bash
npx tsc --noEmit
```

---

# Sprint 4

Na Sprint 4 o projeto foi finalizado com foco em integração, arquitetura, experiência do usuário e preparação para publicação.

Entre as principais evoluções estão:

- conclusão das funcionalidades das Sprints anteriores
- integração real com backend
- refatoração da arquitetura
- isolamento do TanStack Query em hooks
- notificações locais baseadas em eventos reais
- navegação através das notificações
- tema claro e escuro
- persistência das preferências
- tela Sobre o App
- identificação da versão publicada através do commit de referência
- revisão dos fluxos de Tutor e Clínica

---

# Status do Projeto

Principais funcionalidades concluídas:

```text
Autenticação                     ✅
Cadastro de usuário              ✅
Persistência de sessão           ✅
Perfil Tutor                     ✅
Perfil Clínica                   ✅
CRUD de Pets                     ✅
CRUD de Vacinas                  ✅
CRUD de Cuidados                 ✅
Histórico                        ✅
Alertas                          ✅
Notificações Locais              ✅
Navegação pela notificação       ✅
Tema Claro/Escuro                ✅
Sobre o App                      ✅
Integração com API REST          ✅
Arquitetura com Hooks/Services   ✅
```

---

# Repositórios

## Mobile

```text
https://github.com/Canadas7/PetOs-Mobile-application-development
```

## Backend

```text
https://github.com/gugomesx10/PetOS-Java
```

---

# Conclusão

O PetOS evoluiu durante as Sprints para uma aplicação mobile integrada e funcional, permitindo que Tutores e Clínicas Veterinárias compartilhem informações importantes relacionadas à saúde e aos cuidados dos animais.

A solução utiliza autenticação, persistência de sessão, API REST, gerenciamento de estado assíncrono, histórico, alertas, notificações, temas e diferentes níveis de acesso.

A organização do código em telas, hooks, serviços, contextos e componentes facilita a manutenção e permite a evolução futura da aplicação.
