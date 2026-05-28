<p align="center">
  <img width="600" height="200" alt="Anoto Banner" src="https://github.com/user-attachments/assets/3ad8ab55-4b47-409f-a4cb-1d5264a95c1f" />
</p>

O **anoto** é uma aplicação web moderna, minimalista e intuitiva projetada para a criação, organização e gerenciamento de notas pessoais. Desenvolvido com uma arquitetura totalmente desacoplada, o projeto une a robustez e segurança do ecossistema Java no backend com a dinamicidade e performance do Angular no frontend.

---

## 🔗 Links do Projeto

* **Acesse a Aplicação (Frontend):** [Clique aqui para abrir o Anoto](https://anoto-seven.vercel.app/login)
* **Link da API (Backend):** [Clique aqui para abrir a API](https://anoto-backend.onrender.com) *(Substitua pelo seu link real do Render)*

---

## ✨ Funcionalidades

* **Autenticação Segura:** Sistema de login e cadastro de usuários para proteger suas notas.
* **CRUD Completo de Notas:** Criação, leitura, edição e exclusão de anotações em tempo real.
* **Organização Eficiente:** Sistema de busca e filtragem de notas por título ou conteúdo.
* **Interface Responsiva:** Design limpo e adaptável para telas de computadores, tablets e smartphones.

---

## 🛠️ Tecnologias e Stacks

O ecossistema do projeto foi planejado para simular um ambiente de produção real e escalável:

* **Frontend:** [Angular](https://angular.io/) — Framework robusto utilizado para a construção de uma interface SPA (Single Page Application) fluida.
* **Backend:** [Java com Spring Boot](https://spring.io/projects/spring-boot) — API RESTful responsável pelas regras de negócio, segurança e persistência de dados.
* **Banco de Dados:** [Supabase](https://supabase.com/) — Banco de dados relacional PostgreSQL hospedado na nuvem, garantindo confiabilidade e integridade dos dados.
* **Hospedagem Frontend:** [Vercel](https://vercel.com/) — Deploy automatizado (CI/CD) com entrega rápida via CDN global.
* **Hospedagem Backend:** [Render](https://render.com/) — Plataforma Cloud moderna para containerização e execução do backend em nuvem.

---

## 📐 Arquitetura do Projeto

A aplicação segue o modelo **Client-Server**:
1. O usuário interage com a interface rica construída em **Angular** (hospedada na Vercel).
2. O frontend faz requisições HTTP seguras (via `HttpClient`) para os endpoints da API **Spring Boot** (hospedada no Render).
3. O servidor Java processa as requisições e se comunica com o banco de dados PostgreSQL do **Supabase** para salvar e buscar as informações.

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js e Angular CLI instalados.
* Java JDK (17 ou superior) e Maven instalados.

### Passos Rápidos

1. **Clonar o repositório:**
```bash
   git clone [https://github.com/seu-usuario/anoto.git](https://github.com/seu-usuario/anoto.git)
   cd anoto

