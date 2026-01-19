# 👔 Nossa Betânia - Onde o Caos Vira Lucro

![Nossa Betânia Banner](public/icone.png)

> *"Por que chorar no banheiro se você pode apostar em qual horário o chefe vai surtar?"*

Bem-vindo à **Nossa Betânia**, a primeira (e única) **Casa de Apostas do Caos Corporativo**. Uma plataforma revolucionária que transforma reuniões intermináveis, prazos estourados e café frio em oportunidades de investimento de alto risco.

Aqui, não apostamos em cavalos ou futebol. Apostamos no que realmente importa: **A sobrevivência no escritório.**

---

## 🚀 O Projeto

Desenvolvido como uma vitrine de tecnologia moderna aplicada a um problema ancestral: o tédio corporativo. Este projeto utiliza o que há de mais recente no ecossistema React/Next.js para criar uma experiência fluida, responsiva e, acima de tudo, terapeuticamente divertida.

### 💼 Funcionalidades (O que dá pra fazer?)

- **Mercados de Aposta Dinâmicos**: Odds calculadas com base na "Rádio Peão".
  - *"O Gerente vai usar a palavra 'Mindset' hoje?"*
  - *"O Deploy de sexta vai derrubar o banco?"*
- **Economia Própria ($AMD)**: Operamos com **Armandólars**, uma moeda criptográfica lastreada em promessas de promoção e banco de horas não pago.
- **Elenco do Caos**:
  - **Ativos**: Guerreiros que ainda tankam o CLT diariamente.
  - **Exilados**: Lendas que já pediram as contas (ou foram convidados a se retirar).
- **Ranking de Milho-nários**: Veja quem está lucrando mais com a desgraça alheia.
- **Dashboard Personalizado**: Card de boas-vindas que te julga baseado na sua Bio.
- **Autenticação Segura**: Porque o RH não pode saber quem está apostando.

---

## 🛠️ Tech Stack (A Parte Séria)

Por trás das piadas, existe uma arquitetura robusta e escalável:

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) - Server Components, Server Actions.
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) - Tipagem estrita para evitar `undefined` na produção (igual seu aumento).
- **Database & ORM**:
  - [PostgreSQL](https://www.postgresql.org/) (via Neon Tech).
  - [Prisma ORM](https://www.prisma.io/) - Modelagem de dados e Migrations.
- **Estilização**:
  - [Tailwind CSS](https://tailwindcss.com/) - Para estilizar mais rápido que o prazo do cliente.
  - [Lucide React](https://lucide.dev/) - Ícones bonitos.
- **Autenticação**: [NextAuth.js v5](https://authjs.dev/) - Gestão de sessões.
- **Deployment**: Vercel.

---

## 🏗️ Como Rodar o Caos Localmente

Quer instalar a firma na sua máquina? Siga os passos (sem abrir chamado na TI):

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/nossa-betania.git
cd nossa-betania
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
# ou
pnpm install (se você for hipster)
```

### 3. Configure o Ambiente
Crie um arquivo `.env` na raiz (copie o `.env.example` se tiver, se não, improvise):

```env
DATABASE_URL="postgresql://user:password@host:port/db?schema=public"
AUTH_SECRET="um_segredo_muito_seguro_que_o_estagiario_nao_descubra"
```

### 4. Prepare o Banco de Dados
Rode as migrações para criar as tabelas (User, Bet, Market, etc):

```bash
npx prisma migrate dev
```

### 5. Plante a Semente do Mal (Seed)
Popule o banco com usuários fictícios (o elenco) e mercados iniciais:

```bash
npx prisma db seed
```
*Isso vai criar admins, usuários com avatares aleatórios e bios engraçadas.*

### 6. Suba o Servidor
```bash
npm run dev
```
Acesse `http://localhost:3000` e comece a apostar.

---

## 📸 Screenshots

| Dashboard | Elenco |
|:---:|:---:|
| *Onde você vê seu saldo (ou a falta dele)* | *Hall da Fama e da Vergonha* |

---

## 🤝 Contribuição

Quer adicionar uma nova feature ou corrigir um bug?
1. Faça um Fork.
2. Crie uma Branch (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas mudanças (`git commit -m 'Adiciona botão de Pânico'`).
4. Push para a Branch (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request (e aguarde a aprovação em 3 a 5 dias úteis).

---

## 📄 Licença

Este projeto está sob a licença **(GPL 3.0)[https://github.com/Melksedeque/nossa-betania?tab=GPL-3.0-1-ov-file]** - ou seja, pode copiar, mantenha o código aberto pros coleguinhas, mas se quebrar a produção a culpa é sua.

---

## ⚠️ Disclaimer Jurídico (O famoso "Tira o meu da reta")

Este projeto é uma obra de **ficção e sátira corporativa**, criada exclusivamente para fins educacionais, de portfólio e entretenimento.

1.  **Personagens Fictícios:** Qualquer semelhança com gerentes reais, colegas tóxicos ou aquele estagiário que apagou o banco de produção é **mera coincidência** (ou trauma compartilhado).
2.  **Dinheiro Fictício:** A moeda "Armandólar ($AMD)" não possui valor comercial, não pode ser trocada por Reais, Dólares ou Vale-Coxinha. Não somos uma casa de apostas real (ainda bem, senão a CVM batia aqui).
3.  **Isenção de Responsabilidade:** O autor não se responsabiliza se você tentar implementar um sistema de apostas real na sua empresa e for convocado pelo RH. Use com moderação.

**Resumo:** É tudo brincadeira. Por favor, não me processem. Eu sou apenas um dev tentando pagar os boletos.

---

<div align="center">
  <sub>Feito na base do ódio, mas com 🧡 e muito ☕ por alguém que deveria estar trabalhando.</sub>
</div>
