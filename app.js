const form = document.getElementById('credit-form');
const birth = document.getElementById('birth-date');
const cpf = document.getElementById('cpf');
const error = document.getElementById('form-error');
const digits = value => value.replace(/\D/g, '');

birth.addEventListener('input', () => {
  const value = digits(birth.value).slice(0, 8);
  birth.value = value.replace(/^(\d{2})(\d)/, '$1/$2').replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2');
});
cpf.addEventListener('input', () => {
  cpf.value = digits(cpf.value).slice(0, 11).replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2').replace(/(\d{3}\.\d{3}\.\d{3})(\d)/, '$1-$2');
});

function validCPF(value) {
  const number = digits(value);
  if (number.length !== 11 || /^(\d)\1{10}$/.test(number)) return false;
  for (let length = 9; length <= 10; length++) {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(number[i]) * (length + 1 - i);
    const check = (sum * 10) % 11;
    if ((check === 10 ? 0 : check) !== Number(number[length])) return false;
  }
  return true;
}

function validBirth(value) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [day, month, year] = value.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return year >= 1900 && date <= today && date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

form.addEventListener('input', event => {
  event.target.removeAttribute('aria-invalid');
  error.hidden = true;
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('full-name');
  const fail = (input, message) => {
    error.textContent = message;
    error.hidden = false;
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  };
  const fullName = name.value.trim().replace(/\s+/g, ' ');
  if (fullName.split(' ').length < 2) return fail(name, 'Informe seu nome completo, incluindo o sobrenome.');
  if (!validBirth(birth.value)) return fail(birth, 'Digite uma data de nascimento válida no formato DD/MM/AAAA.');
  if (!validCPF(cpf.value)) return fail(cpf, 'Confira o CPF e digite os 11 números corretamente.');
  const use = new FormData(form).get('uso');
  const message = [
    'Olá, Rosiely! Vim pela página do Grupo VR Multimarcas e gostaria de solicitar uma análise de crédito para uma moto.',
    '',
    `Nome completo: ${fullName}`,
    `Data de nascimento: ${birth.value}`,
    `CPF: ${cpf.value}`,
    `Uso da moto: ${use}`,
    '',
    'Autorizo o uso destes dados para atendimento e análise de crédito.',
    'Podemos conversar sobre os próximos passos?'
  ].join('\n');
  window.location.assign(`https://wa.me/5591985530569?text=${encodeURIComponent(message)}`);
});

