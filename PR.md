# PR.md - ENGWEB2025-Normal

Este Exame de época normal consiste em duas aplicações:

1. **API de Dados (ex1)**: Uma API REST que disponibiliza informações sobre o Festival Eurovisão na porta 25000.
2. **Interface Web (ex2)**: Uma aplicação web que consome a API e apresenta os dados de forma amigável na porta 25001.

## Alterações ao Dataset

O dataset original foi transformado utilizando um script Python (`corrigirJson.py`) para garantir uma estrutura adequada para importação no MongoDB.

### Principais Alterações Realizadas:

1. **Estrutura de Dados**: Conversão de objeto com chaves dinâmicas para array de objetos para facilitar queries no MongoDB
2. **Tipos de Dados**: Conversão do campo `anoEdição` de string para número inteiro para permitir ordenação e comparações
3. **Campos Opcionais**: Substituição de campos ausentes por `null` em vez de omitir o campo (ex: `vencedor`)
4. **Normalização de Caracteres**: Remoção de acentos nos nomes dos campos (`título` → `titulo`, `país` → `pais`, `intérprete` → `interprete`)
5. **Identificadores**: Utilização do campo `id` da edição original como `_id` do MongoDB
6. **Ordenação**: Ordenação automática das edições por ano crescente, não era necessário no entanto como já estava a desenvolver uma codigo, fiz essa implementação.

### Justificação das Alterações:

- **Array vs Objeto**: MongoDB funciona melhor com arrays para operações de agregação
- **Tipos Corretos**: Números permitem operações matemáticas e ordenação adequada
- **Campos Null**: Facilita queries de verificação de existência
- **Sem Acentos**: Evita problemas futuros no codigo

## Persistência de Dados

### Setup da Base de Dados

Foi criada uma única coleção `edicoes` na base de dados `eurovisao`. Optei apenas por utilizar uma coleção em vez de optar por separar em duas por exemplo coleção `edições` e `musicas`, pois iria facilitar no desenvolvimento da aplicação, não iria ter que andar a fazer JOINs em queries, o mongoDB é orientado a documentos e assim fica tudo relacionado num só e estrutura mais simples e mais facil de intepretar.


### Comandos usados para fazer a importação do json para MongoDB
1. Transformar o dataset original
```python3 corrigirJson.py dataset.json```

2. Importar para o MongoDB
   1. Copiar o dataset novo para o docker 
        ```docker cp <ficheiro> <diretorio>```
        ```docker cp dataset_eurovision_corrigido.json mongoEW:/tmp```
    2. Após isso entrei no terminal do container
        ```docker exec -it <container> sh```
        ```docker exec -it mongoEW sh```
    3. Finalmente importei o json para mongo
        ```mongoimport -d <nomeBaseDados> -c <nomeColecao> <diretorioDoJson> --jsonArray```
        ```mongoimport -d eurovisao -c edicoes /tmp/dataset_eurovision_corrigido.json --jsonArray```

3. Verifiquei se a importação foi feita com sucesso
   1. Entrei no mongosh, visualizei as bases de dados e rodei uma query
    ```bash
    mongosh
    show dbs
    use <nomeColecao>
    db.edicoes.countDocuments()
    ```
## Instruções de Execução

### Exercício 1 - API de Dados (Porta 25000)

```bash
cd ex1
npm i
npm start
```
A API ficará disponível em `http://localhost:25000`

### Exercício 2 - Interface Web (Porta 25001)

```bash
cd ex2
npm install
npm start
```

A interface ficará disponível em `http://localhost:25001`

**Importante**: A API (ex1) deve estar a correr antes de iniciar a interface (ex2), pois a interface consome dados da API.

## Funcionalidades Implementadas

### Exercício 1 - API REST

**Rotas de Consulta:**
- `GET /edicoes` - Lista todas as edições (campos: anoEdicao, organizacao, vencedor)
- `GET /edicoes/:id` - Detalhes completos de uma edição específica
- `GET /edicoes?org=PAIS` - Edições organizadas por um país específico
- `GET /paises?papel=org` - Lista de países organizadores com anos
- `GET /paises?papel=venc` - Lista de países vencedores com anos
- `GET /interpretes` - Lista de intérpretes únicos com país representado

**Rotas de Modificação:**
- `POST /edicoes` - Adicionar nova edição
- `PUT /edicoes/:id` - Atualizar edição existente
- `DELETE /edicoes/:id` - Eliminar edição

### Exercício 2 - Interface Web

**Páginas Implementadas:**
1. **Página Principal** (`/`) - Tabela responsiva com todas as edições, links para detalhes e países
2. **Página de Edição** (`/:id`) - Informações completas da edição incluindo tabela de músicas participantes
3. **Página de País** (`/paises/:pais`) - Duas tabelas: participações do país e edições organizadas



## Testes Realizados

### API (Exercício 1)
- Testadas todas as rotas com Postman
- Verificação de respostas corretas para dados válidos
- Teste de tratamento de erros para IDs inexistentes
- Validação das operações CRUD

### Interface (Exercício 2)
- Navegação entre todas as páginas
- Verificação de links conforme especificação
- Teste de comportamento quando API está offline
- Validação da responsividade em diferentes dispositivos

## Conclusão

O teste foi desenvolvido seguindo rigorosamente as especificações do enunciado. A API fornece todas as rotas pedidas com os formatos de resposta corretos, e a interface apresenta os dados de forma organizada e intuitiva.

A escolha de uma única coleção no MongoDB mostrou-se adequada para este tipo de dados, permitindo queries eficientes e uma estrutura de código mais simples. A interface web consome corretamente a API e apresenta todas as funcionalidades pedidas.

Ambas as aplicações estão configuradas para executar com os comandos `npm install` e `npm start` conforme solicitado.

---

**Nome:** Pedro de Seabra Vieira 
**Número de Aluno:** A104352
**UC:** Engenharia Web (3º ano LEI)  
**Data:** 30 de Maio de 2025
