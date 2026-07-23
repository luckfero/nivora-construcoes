# Nívora Construções

Site institucional trilíngue criado como projeto conceitual de portfólio para uma construtora de médio e alto padrão. O idioma principal é português do Brasil, com versões completas em espanhol da Espanha e inglês internacional.

## Experiência

- páginas institucionais, serviços, projetos, estudos de caso, contato e privacidade;
- seis projetos conceituais com filtros por categoria;
- comparador acessível de antes e depois;
- formulário de diagnóstico em quatro etapas, exclusivamente demonstrativo;
- seletor de idioma com rotas localizadas;
- tipografia local, imagens WebP, responsividade e preferência por movimento reduzido.

Os números, projetos e a trajetória da Nívora são conceituais. O site não informa CNPJ, endereço, certificações, avaliações ou contatos reais.

## Ambiente local

Requisitos: Node.js `>=22.13.0` e npm.

```bash
npm ci
npm run dev
```

Comandos de qualidade:

```bash
npm run lint
npm test
```

## Publicação no Cloudflare Workers

O projeto usa Vinext e o plugin oficial do Cloudflare para executar no runtime Workers. As imagens são servidas como arquivos WebP estáticos, sem dependência de Cloudflare Images.

No Cloudflare, conecte a branch `main` e configure:

- nome do Worker: `nivora-construcoes`;
- comando de build: `npm run build`;
- comando de deploy: `npm run deploy:cloudflare`;
- diretório raiz: vazio;
- versão do Node.js: 22.13 ou superior.

O deploy requer as credenciais padrão do Cloudflare (`CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`) no ambiente de CI. Nenhuma variável de aplicação é necessária nesta versão.

Para uma prévia isolada no Cloudflare:

```bash
npm run preview:cloudflare
```

## Pendências antes de uso comercial

- substituir o aviso conceitual e os contatos demonstrativos por dados reais;
- conectar o formulário a um serviço autorizado;
- configurar domínio, URL canônica, sitemap e ferramentas de medição somente após aprovação;
- revisar juridicamente a política de privacidade para a operação real.
