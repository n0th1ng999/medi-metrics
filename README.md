# MediMetrics
MediMetrics é uma aplicação desenvolvida para monitorização de indicadores de saúde de forma prática e eficiente. O projeto envolve a criação de uma API GraphQL que permite aos utilizadores registar, consultar e gerir dados de saúde, como frequência cardíaca, pressão arterial, glicose, peso e horas de sono.

---

## Funcionalidades

- Registo de Indicadores de Saúde: Permite registar dados como frequência cardíaca, pressão arterial, glicose, peso e horas de sono.

- Consulta de Histórico: Visualize registos passados e acompanhe a sua saúde ao longo do tempo.

- Insights Personalizados: Receba análises e recomendações baseadas nos seus dados de saúde.

- Lembretes e Alertas: Configure lembretes para medições e receba notificações sobre valores fora da faixa recomendada.

- Definição de Metas: Crie metas de saúde e acompanhe o seu progresso.

---

## Tecnologias Utilizadas

### Backend

- Node.js: Ambiente de execução do servidor.

- Apollo Server: Framework para construir a API GraphQL.

### Base de Dados:

- MongoDB.

### Frontend

- React

---

## Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter instalado:

Node.js (v16 ou superior)

Yarn ou npm

### Clone o repositório:

```
git clone https://github.com/seu-usuario/healthtrack.git
cd healthtrack
```
### Instale as dependências:

```
npm install

yarn install
```
### Configure a base de dados no ficheiro .env:

```
DATABASE_URL=sua_base_de_dados_aqui
```
### Inicie o servidor:

```
npm run dev
```

```
yarn dev
```

### Aceda à API GraphQL no navegador:

Normalmente estará disponível em http://localhost:4000/graphql.

---

## Estrutura do Projeto
```
healthtrack/
├── src/
│   ├── resolvers/       # Lógica GraphQL
│   ├── schemas/         # Schemas GraphQL
│   ├── database/        # Configuração da base de dados
│   ├── utils/           # Funções auxiliares
│   └── index.js         # Ponto de entrada da aplicação
├── .env                 # Variáveis de ambiente
├── package.json         # Dependências e scripts
└── README.md            # Documentação do projeto
```

---

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo:

Faça um fork do projeto.

### Crie uma branch para a sua funcionalidade ou correção:
```
git checkout -b minha-funcionalidade
```

### Faça o commit das alterações:
```
git commit -m "Adiciona nova funcionalidade"
```
### Envie para o repositório remoto:
```
git push origin minha-funcionalidade
```
Abra um Pull Request no repositório original.
---
## Licença

Este projeto está licenciado sob a MIT License.

--- 

## Contacto

Se tiver dúvidas ou sugestões, entre em contacto:

E-mail: <a href="mailto:tigasdeveloper@gmail.com">tigasdeveloper@gmail.com</a>

GitHub: <a href="https://github.com/n0th1ng999">n0th1ng999</a>

