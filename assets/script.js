document.addEventListener('DOMContentLoaded', () => {
    const cepInput = document.getElementById('cep-input');
    const searchButton = document.getElementById('search-button');
    const saveButton = document.getElementById('save-button');
    const addressInfo = document.getElementById('address-info');
    const logradouro = document.getElementById('logradouro');
    const bairro = document.getElementById('bairro');
    const localidade = document.getElementById('localidade');
    const uf = document.getElementById('uf');
    const addressList = document.getElementById('address-list');

    searchButton.addEventListener('click', async () => {
        const cep = cepInput.value.trim().replace("-", "");

        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (data.erro) {
                    alert('CEP não encontrado!');
                } else {
                    logradouro.textContent = data.logradouro;
                    bairro.textContent = data.bairro;
                    localidade.textContent = data.localidade;
                    uf.textContent = data.uf;
                    addressInfo.classList.remove('hidden');
                }
            } catch (error) {
                console.error('Erro ao consultar a API de CEP:', error);
            }
        } else {
            alert('Por favor, digite um CEP válido.');
        }
    });

    saveButton.addEventListener('click', () => {
        const address = {
            cep: cepInput.value.trim(),
            logradouro: logradouro.textContent,
            bairro: bairro.textContent,
            localidade: localidade.textContent,
            uf: uf.textContent
        };

        if (confirm('Deseja salvar este endereço?')) {
            let savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
            savedAddresses.push(address);
            localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));

            displaySavedAddresses();
        }
    });

    function deleteAddress(index) {
        if (confirm('Tem certeza de que deseja deletar este endereço?')) {
            let savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
            savedAddresses.splice(index, 1);
            localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));

            displaySavedAddresses();
        }
    }

    function displaySavedAddresses() {
        const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
        addressList.innerHTML = '';
        savedAddresses.forEach((address, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${address.cep}</td>
                <td>${address.logradouro}</td>
                <td>${address.bairro}</td>
                <td>${address.localidade}</td>
                <td>${address.uf}</td>
                <td><button class="delete-button" data-index="${index}">Deletar</button></td>
            `;
            addressList.appendChild(tr);
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                deleteAddress(index);
            });
        });
    }

    displaySavedAddresses();
});


