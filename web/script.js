import { createField } from './form.js';

const form = document.querySelector('#form');
const status = document.querySelector('#status');
const retry = document.querySelector('#retry');
const submit = document.querySelector('#submit');
const groups = document.querySelector('#groups');
let controls = [];

async function loadFields() {
  status.textContent = 'Carregando formulário…';
  retry.hidden = true;
  submit.disabled = true;
  try {
    const response = await fetch('/api/fields');
    if (!response.ok) throw new Error('Falha na API');
    const { _embedded: data } = await response.json();
    if (!Array.isArray(data?.request_fields) || !Array.isArray(data?.user_fields)) throw new Error('Formato inválido');
    const fragment = document.createDocumentFragment();
    const nextControls = [];
    for (const [key, title] of [['request_fields', 'Sobre o serviço'], ['user_fields', 'Seus dados']]) {
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = title;
      fieldset.append(legend);
      data[key].forEach((field, index) => {
        const entry = createField(field, `${key}-${index}`, document);
        nextControls.push(entry);
        fieldset.append(entry.wrapper);
      });
      fragment.append(fieldset);
    }
    groups.replaceChildren(fragment);
    controls = nextControls;
    submit.disabled = false;
    status.textContent = '';
  } catch {
    status.textContent = 'Não foi possível carregar o formulário. Tente novamente.';
    retry.hidden = false;
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const invalid = controls.filter((entry) => !entry.validate());
  if (invalid.length) {
    status.textContent = 'Confira os campos destacados antes de continuar.';
    invalid[0].control.focus();
    return;
  }
  status.textContent = 'Formulário preenchido com sucesso! Esta demonstração não envia seus dados.';
});
form.addEventListener('input', () => { status.textContent = ''; });
retry.addEventListener('click', loadFields);
loadFields();
