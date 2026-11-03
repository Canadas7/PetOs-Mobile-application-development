# Sobre o App — Sprint 4 / 2026

Acesse **Perfil → Sobre o App** como Tutor ou Clínica. A tela acompanha o tema
selecionado e mostra PetOS, versão do `app.json`, entrega, tecnologia e commit.
O botão de voltar retorna ao perfil.

## Identificação da versão distribuída

`app.config.js` incorpora os primeiros sete caracteres de
`EAS_BUILD_GIT_COMMIT_HASH` (em builds EAS) ou de `git rev-parse HEAD` (localmente)
em `extra.referenceCommit`. O aplicativo lê esse valor com `expo-constants`.
O hash fica incluído no pacote; não consulta o Git em tempo de execução.
Sem Git, informe a variável com o commit real usado para gerar o pacote.
Uma build EAS sem commit identificado falha; uma execução local sem Git exibe
“Não disponível nesta execução”.

Antes de gerar a versão para distribuição, faça commit de todas as alterações,
confirme que `git status --short` está vazio e gere o pacote desse checkout.
Não fixe o hash no código: o próprio commit mudaria esse valor.
No desenvolvimento com arquivos alterados, o hash indica somente o último commit,
e não representa as alterações ainda não commitadas.

## Conferência

- `npx tsc --noEmit`
- `node --test tests/theme.test.cjs`
- `npx expo config --type public`: verificar versão e `extra.referenceCommit`.
- `npx expo export --platform android --output-dir dist/about-android`
- No aparelho, abrir Perfil → Sobre o App nos dois temas e nos dois perfis;
  conferir rolagem com fonte ampliada, botão voltar e hash da build instalada.

O export verifica o empacotamento, mas não substitui a conferência no aparelho
nem gera um APK para distribuição.
