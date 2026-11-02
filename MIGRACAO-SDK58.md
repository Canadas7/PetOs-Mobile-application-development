# Migracao Expo SDK 57 para 58 - Sprint 4

Branch: chore/sprint4-expo-sdk-58. A branch sprint4/finalizacao-mobile foi preservada.

## Commits
- 5c3c0c9: salva os ajustes existentes da SDK 57 como ponto de retorno.
- def0ceb: atualiza Expo para 58.0.22, React para 19.3.0 e React Native para 0.88.1, com dependencias alinhadas pelo Expo.
- Correcao separada: ScrollViewInstance na referencia de rolagem de VaccinesScreen.

## Reproducao da migracao
Na base SDK 57 salva e sem alteracoes pendentes:
```powershell
npx expo install expo@^58.0.0 --fix
npx tsc --noEmit
npx expo-doctor@latest
npx expo export --platform ios --output-dir .expo/sdk58-export
```
Corrigir useRef<ScrollView> para useRef<ScrollViewInstance>, importando o tipo de react-native.

## Verificacoes realizadas
- TypeScript antes e depois da migracao: passou.
- expo-doctor depois: 20/20.
- Exportacao JavaScript/Hermes para iOS: passou, 1079 modulos.
- Isso nao constitui compilacao nativa nem teste funcional no aparelho.
- npm audit reportou 18 alertas (1 baixo, 12 moderados, 4 altos, 1 critico). Inclui dependencias transitivas de ferramentas e navegacao; exposicao no aplicativo nao foi determinada. Resolver em trabalho separado. Nao foi aplicado audit fix --force, que sugere inclusive downgrades de SDK.

## Antes de integrar na Sprint 4
```powershell
npx expo start --go --clear
```
Abrir o QR code no iPhone com Expo Go SDK 58 e testar:
- Login, logout e restauracao de sessao.
- Lista, cadastro e detalhes de pets.
- Vacinas: cadastrar, editar e conferir rolagem.
- Rotinas e historico.
- Permissao de notificacao aceita e recusada.
- Novo alerta local, som/banner e toque abrindo o pet correto.
- Reabrir o app e verificar que alertas ja processados nao duplicam.
O backend precisa estar acessivel. O servico atual gera notificacoes locais; migrar nao implementa push remoto nem execucao de consulta com o app encerrado.
Somente integrar/publicar depois do teste no iPhone. Nenhum push ou merge foi feito.

## Retorno sem apagar commits
Com arvore limpa:
```powershell
git switch -c chore/sprint4-sdk57-backup 5c3c0c9
npm ci
```
Isso restaura a base salva da SDK 57 em outra branch. O Expo Go 58 continuara exigindo SDK 58.

## Referencias
- https://expo.dev/blog/how-to-upgrade-to-sdk-58
- https://expo.dev/changelog/sdk-58
- https://docs.expo.dev/versions/v58.0.0/sdk/notifications/