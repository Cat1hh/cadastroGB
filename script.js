const apiBase = '/api/users';

async function fetchUsers() {
  const res = await fetch(apiBase);
  const data = await res.json();
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';

  data.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.nome}</td>
      <td>${u.email}</td>
      <td>${u.telefone || ''}</td>
      <td>
        <button class="action" onclick="deleteUser(${u.id})">Excluir</button>
        <button class="action" onclick="editUser(${u.id})">Editar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteUser(id) {
  if (!confirm('Confirma remoção?')) return;
  await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
  fetchUsers();
}

async function editUser(id) {
  const res = await fetch(`${apiBase}/${id}`);
  if (!res.ok) return alert('Erro ao buscar usuário');

  const u = await res.json();
  document.getElementById('nome').value = u.nome;
  document.getElementById('email').value = u.email;
  document.getElementById('telefone').value = u.telefone || '';
  document.getElementById('formCadastro').setAttribute('data-edit-id', u.id);
}

document.getElementById('formCadastro').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nomeInput = document.getElementById('nome');
  const nome = nomeInput.value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const form = e.target;
  const editId = form.getAttribute('data-edit-id');

  // 🚨 impede envio se o campo estiver inválido
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (editId) {
    await fetch(`${apiBase}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone })
    });
    form.removeAttribute('data-edit-id');
  } else {
    await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone })
    });
  }

  form.reset();
  fetchUsers();
});

// inicializar
fetchUsers();

/* ===== VALIDAÇÃO DO NOME (AVISO, NÃO BLOQUEIA DIGITAÇÃO) ===== */
const nomeInput = document.getElementById('nome');

nomeInput.addEventListener('input', () => {
  if (nomeInput.value.length > 50) {
    nomeInput.setCustomValidity('O nome não pode ter mais de 50 caracteres');
    nomeInput.reportValidity(); // mostra o aviso na hora
  } else {
    nomeInput.setCustomValidity('');
  }
});
