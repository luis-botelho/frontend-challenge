import { createField } from './form.js';

const form = document.querySelector('#form');
const status = document.querySelector('#status');
const retry = document.querySelector('#retry');
const submit = document.querySelector('#submit');
const groups = document.querySelector('#groups');
const back = document.querySelector('#back');
const progress = document.querySelector('#progress');
const stepLabel = document.querySelector('#step-label');
let controls = [];
let currentStep = 0;

function showStep(focus = false) {
  controls.forEach((entry, index) => { entry.wrapper.hidden = index !== currentStep; });
  back.hidden = currentStep === 0;
  progress.max = controls.length;
  progress.value = currentStep + 1;
  stepLabel.textContent = `Passo ${currentStep + 1} de ${controls.length}`;
  submit.textContent = currentStep === controls.length - 1 ? 'Concluir pedido' : 'Continuar →';
  status.textContent = '';
  if (focus) controls[currentStep].control.focus();
}

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
    for (const key of ['request_fields', 'user_fields']) {
      data[key].forEach((field, index) => {
        const entry = createField(field, `${key}-${index}`, document);
        nextControls.push(entry);
        fragment.append(entry.wrapper);
      });
    }
    groups.replaceChildren(fragment);
    controls = nextControls;
    submit.disabled = false;
    currentStep = 0;
    showStep();
  } catch {
    status.textContent = 'Não foi possível carregar o formulário. Tente novamente.';
    retry.hidden = false;
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!controls.length) return;
  const current = controls[currentStep];
  if (!current.validate()) {
    status.textContent = 'Confira o campo destacado antes de continuar.';
    current.control.focus();
    return;
  }
  if (currentStep < controls.length - 1) {
    currentStep += 1;
    showStep(true);
    return;
  }
  const invalidIndex = controls.findIndex((entry) => !entry.validate());
  if (invalidIndex !== -1) {
    currentStep = invalidIndex;
    showStep(true);
    return;
  }
  status.textContent = 'Formulário preenchido com sucesso! Esta demonstração não envia seus dados.';
});
form.addEventListener('input', () => { status.textContent = ''; });
back.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep -= 1;
    showStep(true);
  }
});
retry.addEventListener('click', loadFields);
loadFields();
