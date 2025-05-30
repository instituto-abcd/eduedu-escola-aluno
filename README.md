
# EduEdu Escola - Portal Aluno

## Gitflow

![image](https://github.com/user-attachments/assets/ef55ff15-0c99-4a93-bf18-762dfc1f9860)


## Instruções de uso e desenvolvimento

### Instalação

- No termiral rodar o comando:

```sh
npm install

```

- Criar arquivo `.env` com as variáveis

```sh
VITE_API_URL=
VITE_ADMIN_URL=
```

Os valores das variáveis dependem de em qual modo o projeto irá rodar.

Em desenvolvimento: usar URL do container em dev.

```sh
VITE_API_URL=https://dev-eduedu-escola-backend-3djofcpyaq-uc.a.run.app/
VITE_ADMIN_URL=https://dev-eduedu-escola-admin-3djofcpyaq-uc.a.run.app/
```

Em modo local: necessário instalação correta do ambiente em docker.

```sh
VITE_API_URL=http://localhost:3000/
VITE_ADMIN_URL=http://localhost:5174/
```

Em modo staging: usar a URL do container em staging.

```sh
VITE_API_URL=https://eduedu-escola-backend-3djofcpyaq-uc.a.run.app/
VITE_ADMIN_URL=https://eduedu-escola-admin-3djofcpyaq-uc.a.run.app/
```

### Rodar o projeto (em modo de desenvolvimento)

- No terminal rodar o comando:

```sh
npm run dev
```

- Abrir no navegador a url http://localhost:5173/
