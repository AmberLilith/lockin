# Lockin

Caso precise encriptografar ou descriptografar vários logins ao mesmo tempo, use um dos 2 codigos abaixo no depurador do browser.

<p style="color:red;margin:0px">
IMPORTANTE:
</p>
<p style="background-color: #46C2E8; padding:10px;margin:0px">
Lembre sempre de ao chamar o método decryptFirebaseLogins, substituir 'sua-chave-secreta-32-caracteres!!' pela mesma que foi usada para encriptar
</p>


## Subindo localmente
Execute o comando abaixo para instalar as dependências do projeto:

```
npm install
``` 
Após a instalação, execute o comando abaixo para iniciar o projeto:

```
npm start
```

ou 

```
ng serve
```

## Subida para produção
O repositório já possuir a pipeline de deploy configurada, então basta dar push na branch main ou realizar pull request para a main que o deploy será feito automaticamente.

