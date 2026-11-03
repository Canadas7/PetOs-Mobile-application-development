# Tema claro e escuro — Sprint 4

Em **Perfil → Aparência**, selecione **Claro** ou **Escuro**. A alteração acontece
durante o uso e é salva no dispositivo, inclusive depois de fechar o aplicativo
ou sair da conta. A preferência é do aplicativo neste dispositivo, não da conta.
O padrão inicial é escuro, mantendo o fundo azul-marinho da identidade PetOS.
O verde da marca é preservado nos dois modos.

## Estrutura

- `src/styles/colors.ts`: cores da marca e paletas semânticas `light`/`dark`.
- `src/storage/themeStorage.ts`: leitura e gravação de `@petos:theme` no AsyncStorage 2.x.
- `src/contexts/ThemeContext.tsx`: restauração, troca e tratamento de falhas.
- `src/hooks/useTheme.ts`: acesso ao tema atual e às ações.
- `src/hooks/useThemedStyles.ts`: memoriza estilos por paleta.
- `App.tsx`: provider, tema da navegação, fundo de transição e barra de status.
- Telas e `BottomNavigation`: estilos reativos, sem chamadas de armazenamento na UI.

A restauração termina antes de exibir as telas de autenticação ou navegação.
Valores salvos inválidos usam o padrão escuro. Se a gravação falhar, o tema anterior
é restaurado e o perfil exibe uma mensagem para tentar novamente. Os controles
ficam desabilitados durante a gravação para evitar trocas concorrentes.
O tema não remonta a navegação nem limpa formulários, sessão ou cache de consultas.

Use `background`, `surface` e `surfaceMuted` para fundos; `text` e `textSecondary`
para conteúdo; `accent` para botões verdes e `onAccent` para seus textos/ícones.
`accentText` atende links e ícones sobre cartões. Alertas usam tokens próprios de
erro para manter contraste. Evite cores literais ou importar uma paleta fixa nas telas.

## Validação automatizada

```sh
npx tsc --noEmit
node --test tests/theme.test.cjs
npx expo export --platform android --output-dir dist/theme-android
npx expo export --platform ios --output-dir dist/theme-ios
```

Os testes cobrem restauração em nova instância, troca entre os dois valores,
preferência inválida, preservação do token da sessão, propagação de falhas e
contraste mínimo de 4,5:1 dos pares de texto das paletas.
O export valida o pacote JavaScript/Hermes; não equivale a um build instalável.

Referências: [temas do React Navigation](https://reactnavigation.org/docs/themes/)
e [API do AsyncStorage 2.x](https://react-native-async-storage.github.io/2.0/API/).

## Conferência manual no aparelho

Esta conferência precisa ser feita em Android/iPhone; os testes automatizados não
confirmam o comportamento visual nem os fluxos com o backend no aparelho.

1. Entrar como Tutor, abrir Perfil e alternar Claro/Escuro. Conferir a seleção e a barra de status.
2. Navegar por Início, Pets, Detalhes, cadastro/edição de pet e Cuidados/Histórico em ambos os temas.
3. Conferir campos, teclado, seletores ativos/inativos, alertas, estados vazios, carregamento e erro.
4. Fechar e abrir o app. Conferir a preferência restaurada.
5. Sair da conta. Conferir Login e Cadastro no tema escolhido e entrar novamente.
6. Repetir como Clínica, incluindo painel e cadastro/edição/exclusão de vacina.
7. Conferir o Perfil em uma tela pequena e com fonte ampliada: rolar até o seletor e Sair da conta.
8. Gerar um alerta real, tocar na notificação e conferir a abertura do pet correspondente.

## Organização dos commits

1. `feat: implementa tema claro e escuro persistente no PetOS` — infraestrutura, integração e telas.
2. `test: valida persistencia e contraste dos temas da Sprint 4` — testes e este roteiro.

As dependências e os serviços de autenticação, pets, vacinas, cuidados e notificações
não precisam ser alterados para esta funcionalidade.
