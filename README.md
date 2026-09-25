# Frontend do CRUD de Produtos

Frontend simples em HTML, CSS e JavaScript que utiliza todas as rotas do backend.

## Executar

1. Inicie o backend na porta 3000.
2. Abra esta pasta em outro terminal.
3. Execute um servidor HTTP local:

```bash
npx serve .
```

4. Abra no navegador o endereço informado pelo comando.

Não abra o arquivo `index.html` diretamente. O servidor HTTP é necessário para o funcionamento correto do PWA.

## Endereço da API

O endereço está definido no início do arquivo `app.js`:

```javascript
const API_URL = "http://localhost:3000/produtos";
```

Altere esse valor caso o backend seja executado em outro endereço ou porta (por exemplo, o endereço do backend depois do deploy no Render).

## Operações disponíveis

| Ação | Método | Rota |
|---|---|---|
| Listar produtos | GET | `/produtos` |
| Buscar por ID | GET | `/produtos/:id` |
| Cadastrar | POST | `/produtos` |
| Atualizar | PUT | `/produtos/:id` |
| Excluir | DELETE | `/produtos/:id` |
