# Segurança

Achou uma falha no Maré Boa? Não abra uma issue pública. Use **Security → Report a vulnerability** neste repositório (aviso privado).

- O app não guarda dados pessoais no GitHub. Pontos de pesca e diário ficam só no aparelho de cada pessoa.
- A chave `apiKey` do Firebase no `index.html` é pública por natureza; o acesso aos dados é controlado pelo `firestore.rules`.
