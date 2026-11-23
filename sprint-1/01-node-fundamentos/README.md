# Node: fundamentos e servidor http nativo

> Sprint 1 · Workshop 1 (Node + NestJS) · 25/11

## Pergunta-guia

**Pergunta:** No meu servidor feito na mão, onde ficaram misturados o código de "rota", o de "regra" e o de "dados"? Como o Nest separa isso?

**Minha resposta:**

## O que estudei

- [ ] Node como runtime (V8, sem DOM, acesso a arquivos/rede)
- [ ] Event loop e I/O não bloqueante
- [ ] CommonJS x ESM (`require` x `import`, `"type": "module"`)
- [ ] npm: `init`, dependências x devDependencies, scripts

## Conceitos-chave (com minhas palavras)

| Conceito | O que é | Analogia |
| --- | --- | --- |
| Event loop |  |  |
| I/O não bloqueante |  |  |

## Exercício

**Objetivo:** servidor com o módulo `http` nativo (sem Express) que:

- [ ] `GET /tarefas` → lista de tarefas em JSON
- [ ] `POST /tarefas` → lê o corpo, adiciona na lista, responde `201`
- [ ] qualquer outra rota → `404`

**Como rodar:**

```bash
node server.js
```

## O que deu errado (e por quê)

-

## Dúvidas em aberto

- [ ]

## Referências

- Udemy: seção
- Docs: https://nodejs.org/api/http.html
