export function validationMessage(field, value) {
  const text = value.trim();
  if (!text) return field.required ? 'este campo é requerido' : '';
  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return 'Informe um email válido';
  if (field.type === 'cep' && !/^\d{5}-?\d{3}$/.test(text)) return 'Informe um CEP com 8 dígitos';
  if (field.type === 'phone' && !/^\(?[1-9]\d\)?\s?9\d{4}-?\d{4}$/.test(text)) return 'Informe um celular com DDD e 11 dígitos';
  if (field.type === 'enumerable' && !Object.hasOwn(field.values, value)) return 'Selecione uma opção válida';
  return '';
}

export function createField(field, id, document) {
  const wrapper = document.createElement('div');
  wrapper.className = 'campo';
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = `${field.label}${field.required ? ' *' : ' (opcional)'}`;
  const control = document.createElement(field.type === 'enumerable' ? 'select' : field.type === 'big_text' ? 'textarea' : 'input');
  control.id = id;
  control.name = field.name;
  control.required = field.required;
  if (field.type === 'enumerable') {
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = field.placeholder || 'Selecione';
    control.append(placeholder);
    for (const [value, text] of Object.entries(field.values)) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      control.append(option);
    }
  } else {
    control.placeholder = field.placeholder || '';
    if (field.type !== 'big_text') control.type = { email: 'email', phone: 'tel' }[field.type] || 'text';
    const autocomplete = { cep: 'postal-code', small_text: 'name', email: 'email', phone: 'tel-national' }[field.type];
    if (autocomplete) control.autocomplete = autocomplete;
    if (field.type === 'cep') control.inputMode = 'numeric';
  }
  const error = document.createElement('span');
  error.id = `${id}-error`;
  error.className = 'erro';
  error.hidden = true;
  control.setAttribute('aria-describedby', error.id);
  const validate = () => {
    error.textContent = validationMessage(field, control.value);
    error.hidden = !error.textContent;
    control.setAttribute('aria-invalid', String(!error.hidden));
    return error.hidden;
  };
  control.addEventListener('blur', validate);
  control.addEventListener('input', () => {
    if (!error.hidden) validate();
  });
  control.addEventListener('change', validate);
  wrapper.append(label, control, error);
  return { wrapper, control, validate };
}
