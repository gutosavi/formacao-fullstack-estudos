# Node: fundamentos e servidor http nativo

> Sprint 1 · Workshop 1 (Node + NestJS) · 25/11

## Pergunta-guia

**Pergunta:** No meu servidor feito na mão, onde ficaram misturados o código de "rota", o de "regra" e o de "dados"? Como o Nest separa isso?

**Minha resposta:**

## O que estudei

- [x] Node como runtime (V8, sem DOM, acesso a arquivos/rede)
- [x] Event loop e I/O não bloqueante
- [x] CommonJS x ESM (`require` x `import`, `"type": "module"`)
- [x] npm: `init`, dependências x devDependencies, scripts
- [x] Projeto Jobbee API

## Conceitos-chave (com minhas palavras)

| Conceito               | O que é                                                                                                                                                            | Analogia                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Event Loop**         | Mecanismo que coordena a execução de tarefas assíncronas, verificando a Call Stack e encaminhando callbacks e microtasks (Promises) para execução quando possível. | É como um vigia que monitora constantemente se a Call Stack está vazia e verifica quais tarefas estão prontas para serem executadas. |
| **I/O não bloqueante** | Capacidade de realizar operações de entrada e saída (I/O) sem bloquear a thread principal enquanto aguarda a conclusão dessas operações.                           | É como o serviço de um garçom: ele faz o pedido na cozinha e, enquanto aguarda o preparo, continua atendendo outras mesas.           |

## Exercício

**Objetivo:** servidor com o módulo `http` nativo (sem Express) que:

- [x] `GET /tarefas` → lista de tarefas em JSON
- [x] `POST /tarefas` → lê o corpo, adiciona na lista, responde `201`
- [x] qualquer outra rota → `404`

**Como rodar:**

```bash
node server.js
```

## O que deu errado (e por quê)

**Dificuldade com o módulo http nativo**: Inicialmente, tive dificuldade em estruturar o servidor e compreender o fluxo de uma requisição HTTP, principalmente por ainda não estar familiarizado com a sintaxe e a API do módulo nativo do Node.js. Isso dificultou a implementação das rotas `GET /tarefas` e `POST /tarefas`. Após consultar a documentação oficial e compreender melhor o ciclo de uma requisição, desde o recebimento até o envio da resposta, consegui implementar o exercício corretamente.

## Dúvidas em aberto

- [ ]

## Referências

- Udemy: Node.js - The Complete RESTful API Masterclass [2026];
- Docs: https://nodejs.org/api/http.html
