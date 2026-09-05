document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('#form');

  const response = await fetch('/api/fields');
  const data = await response.json();
  const fields = data._embedded;

  const requestFields = fields.request_fields;
  const userFields = fields.user_fields;

  // Junta os dois grupos numa lista só, pra percorrer tudo de uma vez.
  // O spread (...) "abre" cada array e coloca os itens num array novo.
  const todosOsCampos = [...requestFields, ...userFields];

  // Acumulador de HTML. Só vamos tocar o DOM UMA vez, no final.
  let html = '';

  todosOsCampos.forEach((campo) => {
    html += renderCampo(campo);
  });

  form.innerHTML = html;
});

// Decide qual "molde" de HTML usar, de acordo com o type do campo
function renderCampo(campo) {
  let inputHtml;

  if (campo.type === 'enumerable') {
    inputHtml = renderSelect(campo);
  } else if (campo.type === 'big_text') {
    inputHtml = renderTextarea(campo);
  } else {
    // 'small_text', 'email', 'cep', 'phone' caem todos aqui,
    // só muda o atributo "type" do input (explico isso na seção Conceito)
    inputHtml = renderInput(campo);
  }

  // Envolve o input com label + mensagem de erro (escondida por padrão)
  return `
    <div class="campo">
      <label for="${campo.name}">${campo.label}</label>
      ${inputHtml}
      ${campo.required ? '<span class="erro" data-erro-de="' + campo.name + '">este campo é requerido</span>' : ''}
    </div>
  `;
}

function renderSelect(campo) {
  // Object.entries transforma { "Corte": "Corte" } em [["Corte", "Corte"], ...]
  const options = Object.entries(campo.values)
    .map(([chave, valor]) => `<option value="${chave}">${valor}</option>`)
    .join('');

  return `
    <select id="${campo.name}" name="${campo.name}" ${campo.required ? 'required' : ''}>
      <option value="" disabled selected hidden>${campo.placeholder}</option>
      ${options}
    </select>
  `;
}

function renderTextarea(campo) {
  return `
    <textarea id="${campo.name}" name="${campo.name}"
      placeholder="${campo.placeholder}"
      ${campo.required ? 'required' : ''}></textarea>
  `;
}

function renderInput(campo) {
  // Mapeia o "type" do JSON pro type real de um <input> HTML
  const tiposHtml = {
    small_text: 'text',
    email: 'email',
    cep: 'text',
    phone: 'tel',
  };

  const tipoInput = tiposHtml[campo.type] || 'text';

  return `
    <input type="${tipoInput}" id="${campo.name}" name="${campo.name}"
      placeholder="${campo.placeholder}"
      ${campo.required ? 'required' : ''}>
  `;
}