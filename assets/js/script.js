
// IndexedDB Setup
const DB_NAME = 'jobCalculatorDB';
const DB_VERSION = 1;
const STORE_NAME = 'workHours';
let db;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
        request.onerror = (event) => reject(event.target.error);
    });
}

function saveRow(rowData) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(rowData);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function updateRow(rowData) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(rowData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function getAllRows() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function deleteRows(ids) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        let completed = 0;
        ids.forEach(id => {
            const request = store.delete(id);
            request.onsuccess = () => {
                if (++completed === ids.length) resolve();
            };
            request.onerror = () => reject(request.error);
        });
    });
}

// Utility Functions
function parse(horario) {
    let [hora, minuto] = horario.split(':').map(v => parseInt(v));
    return minuto + (hora * 60);
}

function duracao(entrada, saida) {
    return parse(saida) - parse(entrada);
}

function formatar(minutos) {
    let horas = Math.floor(minutos / 60);
    minutos = minutos % 60;
    return horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0') + 'hs';
}

// Page Navigation
const ligarButton = document.querySelector('.buttonOnOff');
let isOn = false;

function ligaLetreiro() {
    let audio2 = document.querySelector('#som2');
    audio2.play();
}

ligarButton.addEventListener('click', function (e) {
    e.preventDefault();
    isOn = !isOn;
    const link = ligarButton.querySelector('a');
    const tituloLuminoso = document.querySelector('#tituloLumi');

    if (isOn) {
        link.style.color = 'lime';
        tituloLuminoso.classList.add('neon');
        tituloLuminoso.classList.remove('neonOff');
        let audio1 = document.querySelector('#som1');
        audio1.play();
        setTimeout(ligaLetreiro, 500);
    } else {
        link.style.color = 'red';
        tituloLuminoso.classList.remove('neon');
        tituloLuminoso.classList.add('neonOff');
    }
});

document.querySelector('.job a').addEventListener('click', function (e) {
    e.preventDefault();
    let tituloLuminoso = document.querySelector('#tituloLumi');
    if (tituloLuminoso.classList.contains('neon')) {
        let audio3 = document.querySelector('#som3');
        audio3.play();
        abreForm();
    } else {
        alert('A máquina está desligada. Por favor, ligue-a para prosseguir!');
    }
});

function abreForm() {
    let sectionOpen = document.querySelector('#open');
    let sectionDados = document.querySelector('#entradaDados');

    sectionOpen.classList.remove('aberturaOpen');
    sectionOpen.classList.add('aberturaClosed');
    sectionDados.classList.remove('dadosClosed');
    sectionDados.classList.add('dadosOpen');

    carregarDadosTabela();
}

document.getElementById('encerrar').addEventListener('click', function () {
    let sectionOpen = document.querySelector('#open');
    let sectionDados = document.querySelector('#entradaDados');

    sectionDados.classList.remove('dadosOpen');
    sectionDados.classList.add('dadosClosed');
    sectionOpen.classList.remove('aberturaClosed');
    sectionOpen.classList.add('aberturaOpen');
});

// Data Input Formatting
document.querySelector("#entradaData").addEventListener('input', function () {
    let entradaData = this.value;
    let entradaDataNumeros = entradaData.replace(/\D/g, '');

    if (entradaDataNumeros.length >= 2) {
        let dia = entradaDataNumeros.substring(0, 2);
        let resto = entradaDataNumeros.substring(2);

        if (resto.length >= 2) {
            let mes = resto.substring(0, 2);
            let ano = resto.substring(2, 6);
            this.value = dia + '/' + mes + (ano ? '/' + ano : '');
        } else if (resto.length > 0) {
            this.value = dia + '/' + resto;
        } else {
            this.value = dia;
        }
    } else {
        this.value = entradaDataNumeros;
    }
});

// Launch Data
document.getElementById('lancaInfos').addEventListener('click', function (e) {
    e.preventDefault();
    let audio4 = document.querySelector('#som4');
    audio4.play();
    lancar();
});

function lancar() {
    let dataInput = document.getElementById('entradaData').value;
    let local = document.querySelector('input[name="local"]:checked')?.value;
    let horaInicio = document.getElementById("horaInicio").value;
    let horaFim = document.getElementById("horaFim").value;

    if (!dataInput) {
        alert('Preencha a data!');
        document.querySelector("#entradaData").focus();
        return;
    }

    let dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dataRegex.test(dataInput)) {
        alert('Formato de data inválido. Utilize dd/mm/aaaa!');
        document.querySelector("#entradaData").value = "";
        document.querySelector("#entradaData").focus();
        return;
    }

    if (!local) {
        alert('Selecione o tipo de serviço!');
        return;
    }

    if (!horaInicio || !horaFim) {
        alert('Preencha os campos Hora de Início e Hora de Fim!');
        return;
    }

    if (parse(horaInicio) > parse(horaFim)) {
        alert('A hora de início não pode ser maior que a hora final!');
        return;
    }

    let duracaoPeriodo = duracao(horaInicio, horaFim);
    let resultado = formatar(duracaoPeriodo);

    const rowData = {
        data: dataInput,
        local: local,
        horaInicio: horaInicio,
        horaFim: horaFim,
        subTotal: resultado
    };

    saveRow(rowData).then(() => {
        carregarDadosTabela();
        document.querySelector('#formulario').reset();
        document.getElementById('entradaData').focus();
        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Dados lançados com sucesso!',
            timer: 1500,
            showConfirmButton: false
        });
    }).catch(error => {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar dados!');
    });
}

// Load Table Data
function carregarDadosTabela() {
    const tabela = document.getElementById('tabela');
    getAllRows().then(rows => {
        while (tabela.rows.length > 1) {
            tabela.deleteRow(1);
        }
        rows.forEach(row => {
            const tr = tabela.insertRow();
            tr.dataset.id = row.id;
            tr.innerHTML = `
    <td><input type="checkbox" class="row-checkbox"></td>
    <td>${row.data}</td>
    <td>${row.local}</td>
    <td>${row.horaInicio}</td>
    <td>${row.horaFim}</td>
    <td>${row.subTotal}</td>
    `;
        });
        atualizarTotal();
        updateCheckboxListeners();
    }).catch(error => {
        console.error('Erro ao carregar dados:', error);
    });
}

function atualizarTotal() {
    let totalHoras = 0;
    const tabela = document.getElementById("tabela");
    const linhas = tabela.getElementsByTagName('tr');

    for (let i = 1; i < linhas.length; i++) {
        if (linhas[i].style.display !== 'none') {
            let inicio = linhas[i].cells[3].innerHTML;
            let fim = linhas[i].cells[4].innerHTML;
            totalHoras += duracao(inicio, fim);
        }
    }

    const totalFormatado = formatar(totalHoras);
    document.getElementById('calcTotalHoras').innerHTML = totalFormatado;
}

// Search Filter
const input_busca = document.querySelector('#input-busca');
input_busca.addEventListener('keyup', function () {
    let expressoes = input_busca.value.toLowerCase().split(' ');
    let linhas = document.getElementById('tabela').getElementsByTagName('tr');

    for (let posicao = 1; posicao < linhas.length; posicao++) {
        let conteudoDaLinha = linhas[posicao].innerHTML.toLowerCase();
        let correspondencia = expressoes.every(expressao => conteudoDaLinha.includes(expressao));
        linhas[posicao].style.display = correspondencia ? '' : 'none';
    }
    atualizarTotal();
});

// Edit Functions
let edicaoIniciada = false;

document.getElementById('editarDados').addEventListener('click', function () {
    edicaoIniciada = true;
    let tabela = document.getElementById("tabela");
    for (let i = 1; i < tabela.rows.length; i++) {
        for (let j = 1; j < tabela.rows[i].cells.length - 1; j++) {
            tabela.rows[i].cells[j].contentEditable = "true";
            tabela.rows[i].cells[j].style.backgroundColor = "#fffacd";
        }
    }
    Swal.fire('IMPORTANTE', 'Edite os dados respeitando os formatos! Após a edição clique no botão Finalizar edição!', 'info');
});

document.getElementById('finalizaEdit').addEventListener('click', function () {
    if (!edicaoIniciada) {
        let audio5 = document.getElementById('somAlert');
        audio5.play();
        Swal.fire({
            title: 'Alerta!',
            text: 'Você está tentando finalizar uma edição que não foi iniciada! Clique primeiro no botão com o ícone do lápis!',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
        });
        return;
    }

    edicaoIniciada = false;
    let tabela = document.getElementById("tabela");
    const updates = [];

    for (let i = 1; i < tabela.rows.length; i++) {
        for (let j = 1; j < tabela.rows[i].cells.length; j++) {
            tabela.rows[i].cells[j].contentEditable = "false";
            tabela.rows[i].cells[j].style.backgroundColor = "";
        }

        const row = tabela.rows[i];
        const rowData = {
            id: parseInt(row.dataset.id),
            data: row.cells[1].innerText,
            local: row.cells[2].innerText,
            horaInicio: row.cells[3].innerText,
            horaFim: row.cells[4].innerText,
            subTotal: formatar(duracao(row.cells[3].innerText, row.cells[4].innerText))
        };
        row.cells[5].innerHTML = rowData.subTotal;
        updates.push(rowData);
    }

    Promise.all(updates.map(updateRow)).then(() => {
        Swal.fire('Sucesso', 'Edição finalizada com sucesso!', 'success');
        carregarDadosTabela();
    });
});

// Delete Functions
const btnDeletarLinha = document.getElementById('btnDeletarLinha');
const selectAll = document.getElementById('selectAll');

function updateCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.row-checkbox:not(#selectAll)');
    checkboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', updateDeleteButtonState);
        checkbox.addEventListener('change', updateDeleteButtonState);
    });
}

function updateDeleteButtonState() {
    const checkboxes = document.querySelectorAll('.row-checkbox:not(#selectAll)');
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    btnDeletarLinha.classList.toggle('pulsar', anyChecked);
}

selectAll.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll('.row-checkbox:not(#selectAll)');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
    updateDeleteButtonState();
});

btnDeletarLinha.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.row-checkbox:not(#selectAll)');
    const checkedIds = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.closest('tr').dataset.id));

    if (checkedIds.length === 0) {
        Swal.fire('Atenção', 'Por favor, selecione as linhas que deseja deletar marcando as caixas de seleção.', 'warning');
        return;
    }

    Swal.fire({
        title: 'Você tem certeza?',
        text: `Você irá excluir ${checkedIds.length} linha(s) selecionada(s). Esta ação não pode ser desfeita!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
    }).then(result => {
        if (result.isConfirmed) {
            deleteRows(checkedIds).then(() => {
                carregarDadosTabela();
                selectAll.checked = false;
                Swal.fire('Excluído!', 'As linhas foram excluídas com sucesso.', 'success');
            });
        } else {
            checkboxes.forEach(cb => cb.checked = false);
            selectAll.checked = false;
            updateDeleteButtonState();
        }
    });
});

// Export JSON
document.getElementById('btnExportarJson').addEventListener('click', function () {
    Swal.fire({
        title: 'Exportar JSON',
        html: `
                    <input type="text" id="mes" class="swal2-input" placeholder="Mês (ex: junho)">
                    <input type="text" id="ano" class="swal2-input" placeholder="Ano (ex: 2025)">
                `,
        confirmButtonText: 'Exportar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const mes = Swal.getPopup().querySelector('#mes').value;
            const ano = Swal.getPopup().querySelector('#ano').value;
            if (!mes || !ano) {
                Swal.showValidationMessage('Por favor, insira o mês e o ano.');
                return false;
            }
            return { mes, ano };
        }
    }).then(result => {
        if (result.isConfirmed) {
            const { mes, ano } = result.value;
            getAllRows().then(rows => {
                const json = JSON.stringify(rows, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relatorioDeHoras${mes}${ano}.json`;
                a.click();
                URL.revokeObjectURL(url);
                Swal.fire('Sucesso!', 'Arquivo exportado com sucesso!', 'success');
            });
        }
    });
});

// Import JSON
document.getElementById('btnImportarJson').addEventListener('click', () => {
    document.getElementById('inputImportarJson').click();
});

document.getElementById('inputImportarJson').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            Swal.fire({
                title: 'Atenção!',
                text: 'Importar dados irá substituir todos os dados atuais. Deseja continuar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, importar!',
                cancelButtonText: 'Cancelar'
            }).then(result => {
                if (result.isConfirmed) {
                    const transaction = db.transaction([STORE_NAME], 'readwrite');
                    const store = transaction.objectStore(STORE_NAME);
                    store.clear().onsuccess = () => {
                        let completed = 0;
                        data.forEach(row => {
                            delete row.id;
                            const addRequest = store.add(row);
                            addRequest.onsuccess = () => {
                                completed++;
                                if (completed === data.length) {
                                    carregarDadosTabela();
                                    Swal.fire('Sucesso!', 'Dados importados com sucesso!', 'success');
                                }
                            };
                        });
                    };
                }
            });
        } catch (error) {
            console.error('Erro ao importar:', error);
            Swal.fire('Erro', 'Falha ao importar o arquivo JSON. Verifique se o arquivo está correto.', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
});

// Generate PDF Report
document.getElementById('relatorio').addEventListener('click', function () {
    Swal.fire({
        title: 'Gerar Relatório',
        html: `
                    <input type="text" id="nome" class="swal2-input" placeholder="Nome do trabalhador">
                    <input type="text" id="mes" class="swal2-input" placeholder="Mês (ex: junho)">
                    <input type="text" id="ano" class="swal2-input" placeholder="Ano (ex: 2025)">
                `,
        confirmButtonText: 'Gerar PDF',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nome = Swal.getPopup().querySelector('#nome').value.trim();
            const mes = Swal.getPopup().querySelector('#mes').value.trim().toLowerCase();
            const ano = Swal.getPopup().querySelector('#ano').value.trim();
            const meses = [
                "janeiro", "jan", "fevereiro", "fev", "março", "mar", "abril", "abr",
                "maio", "mai", "junho", "jun", "julho", "jul", "agosto", "ago",
                "setembro", "set", "outubro", "out", "novembro", "nov", "dezembro", "dez",
                "1", "01", "2", "02", "3", "03", "4", "04", "5", "05", "6", "06",
                "7", "07", "8", "08", "9", "09", "10", "11", "12"
            ];
            const anoAtual = new Date().getFullYear();

            if (!nome) {
                Swal.showValidationMessage('O nome do trabalhador é obrigatório!');
                return false;
            }
            if (!meses.includes(mes)) {
                Swal.showValidationMessage('Digite um mês válido (nome por extenso, abreviação ou número)!');
                return false;
            }
            if (!ano || ano < 1900 || ano > anoAtual || ano.length < 2 || ano.length > 4) {
                Swal.showValidationMessage('O ano deve estar entre 1900 e o ano corrente!');
                return false;
            }
            return { nome, mes, ano };
        }
    }).then(result => {
        if (result.isConfirmed) {
            const { nome, mes, ano } = result.value;
            const nomeFormatado = nome.toLowerCase().split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            document.getElementById("name").innerHTML = nomeFormatado;
            document.getElementById("monthYear").innerHTML = `Mês: ${mes} / ${ano}`;
            document.getElementById("tituloRelatorio").classList.add("tituloVisivel");
            document.getElementById("tituloRelatorio").classList.remove("oculto");
            document.getElementById("name").classList.add("tituloVisivel");
            document.getElementById("name").classList.remove("oculto");
            document.getElementById("monthYear").classList.add("tituloVisivel");
            document.getElementById("monthYear").classList.remove("oculto");

            setTimeout(() => {
                geraPdf(mes, ano);
            }, 100);

            setTimeout(() => {
                document.getElementById("tituloRelatorio").classList.remove("tituloVisivel");
                document.getElementById("tituloRelatorio").classList.add("oculto");
                document.getElementById("name").classList.remove("tituloVisivel");
                document.getElementById("name").classList.add("oculto");
                document.getElementById("monthYear").classList.remove("tituloVisivel");
                document.getElementById("monthYear").classList.add("oculto");
            }, 3000);
        }
    });
});

function geraPdf(mes, ano) {
    const conteudo = document.querySelector('.content');
    const checkboxTh = document.querySelector('#tabela th:first-child');
    const checkboxTds = document.querySelectorAll('#tabela td:first-child');

    if (checkboxTh) checkboxTh.style.display = 'none';
    checkboxTds.forEach(td => td.style.display = 'none');

    const options = {
        margin: [10, 10, 10, 10],
        filename: `relatorioDeHoras${mes}${ano}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().set(options).from(conteudo).save().then(() => {
        if (checkboxTh) checkboxTh.style.display = '';
        checkboxTds.forEach(td => td.style.display = '');
        Swal.fire('Sucesso!', 'Relatório gerado com sucesso!', 'success');
    });
}

// Help Button
let ajuda = document.querySelector('.help');
let audioAjuda = document.querySelector('#helpi');
let isPlaying = false;
let swalInstance = null;

ajuda.addEventListener('click', function () {
    if (!isPlaying) {
        audioAjuda.play();
        isPlaying = true;

        swalInstance = Swal.fire({
            title: 'Instruções do DreamBuild',
            html: `
                <div style="text-align: left; padding: 15px; line-height: 1.6;">
                    <strong>Bem-vindo ao DreamBuild!</strong><br><br>
                    Este aplicativo permite registrar e calcular horas de trabalho.<br><br>
                    <strong>Como usar:</strong><br>
                    1️⃣ Preencha a data no formato dd/mm/aaaa<br>
                    2️⃣ Selecione o tipo de serviço (Garçom, Massa ou Garçom + Massa)<br>
                    3️⃣ Informe a hora de início e fim<br>
                    4️⃣ Clique em "Lançar" para adicionar<br>
                    5️⃣ Use o filtro para buscar registros específicos<br>
                    6️⃣ Edite, delete ou exporte seus dados conforme necessário<br><br>
                    <strong>💡 Dica:</strong> Exporte regularmente seus dados em JSON para backup!<br><br>
                    <strong>🎯 Funcionalidades:</strong><br>
                    • ✏️ Editar linhas<br>
                    • 🗑️ Deletar linhas selecionadas<br>
                    • 📤 Exportar em JSON<br>
                    • 📥 Importar JSON<br>
                    • 📄 Gerar relatório PDF
                </div>
                <button id="toggleAudio" class="swal2-confirm swal2-styled">Pausar Áudio</button>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            allowOutsideClick: false,
            didOpen: () => {
                const toggleButton = document.getElementById('toggleAudio');
                toggleButton.addEventListener('click', toggleAudio);
            },
            willClose: () => {
                audioAjuda.pause();
                audioAjuda.currentTime = 0;
                isPlaying = false;
            }
        });
    } else {
        audioAjuda.pause();
        audioAjuda.currentTime = 0;
        isPlaying = false;
        if (swalInstance) {
            swalInstance.close();
        }
    }
});

function toggleAudio() {
    const toggleButton = document.getElementById('toggleAudio');
    if (isPlaying) {
        audioAjuda.pause();
        isPlaying = false;
        toggleButton.textContent = 'Retomar Áudio';
    } else {
        audioAjuda.play();
        isPlaying = true;
        toggleButton.textContent = 'Pausar Áudio';
    }
}

audioAjuda.addEventListener('ended', function () {
    isPlaying = false;
    if (swalInstance) {
        swalInstance.close();
    }
});

// Initialize
openDB().then(() => {
    console.log('Banco de dados aberto com sucesso!');
    carregarDadosTabela();
}).catch(error => {
    console.error('Erro ao abrir banco de dados:', error);
    alert('Erro ao inicializar o aplicativo!');
});
