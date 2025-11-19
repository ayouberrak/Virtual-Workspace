let btnAdd = document.getElementById('btn-add');
let formulaire = document.getElementById('model-form');
let cancelBtn = document.getElementById('cancel-btn');
let photoInput = document.getElementById('Photo');
let photoPreview = document.getElementById('photoPreview');
let btnAddExpriances = document.getElementById('btn-Add-Expriances');
let exeperiancesContairer = document.getElementById('experiances-contairer');
let form = document.getElementById('formulaire');
let workersContainer = document.getElementById('workers-container');

const modalContainer = document.getElementById('modal-container');
const modalTitle = document.getElementById('modal-title');
const employeesList = document.getElementById('authorized-employees-list');
const noRoleMessage = document.getElementById('no-role-message');
const closeModalBtn = document.getElementById('close-modal-btn');

const containerReception = document.getElementById('container-reception');
const containerServeurs = document.getElementById('container-serveurs');
const containerSecurite = document.getElementById('container-securite');
const containerPersonnel = document.getElementById('container-personnel');
const containerArchives = document.getElementById('container-archives');
const containerConference = document.getElementById('container-conference');

const btnreception = document.getElementById('btn-reception');
const btnserveurs = document.getElementById('btn-salle-serveurs');
const btnsecurite = document.getElementById('btn-salle-securite');
const btnpersonnel = document.getElementById('btn-salle-personnel');
const btnarchives = document.getElementById('btn-salle-darchives');
const btnconference = document.getElementById('btn-salle-conference');

let roleInReceprion = ["Réceptionnistes", "Manager", "Nettoyage"];
let roleInServeurs = ["Techniciens IT", "Manager", "Nettoyage"];
let roleInSecurite = ["Agents de sécurité", "Manager", "Nettoyage"];
let roleInPersonnel = ["Agents de sécurité", "Manager", "Nettoyage", "Autres rôles", "Techniciens IT", "Receptionnistes"];
let roleInArchives = ["Manager"];
let roleInConference = ["Agents de sécurité", "Manager", "Nettoyage", "Autres rôles", "Techniciens IT", "Receptionnistes"];


btnAdd.addEventListener('click', () => {
    formulaire.classList.remove('hidden')
});
cancelBtn.addEventListener('click', () => {
    formulaire.classList.add('hidden')
});
closeModalBtn.addEventListener('click', () => {
    modalContainer.style.display = 'none'
});

photoInput.addEventListener('input', (e) => {
    photoPreview.innerHTML = '';

    let img = document.createElement('img');
    img.className = 'w-full h-full object-cover rounded-full';

    img.onerror = () => {
        img.src = './public/images/default-Photo.jpg';
    };

    img.src = e.target.value;

    photoPreview.appendChild(img);
});


form.addEventListener('submit', function (e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let position = document.getElementById('role').value;
    let image = document.getElementById('Photo').value;
    if (!image) image = './public/images/default-Photo.jpg';

    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;

    let experiences = [];
    document.querySelectorAll('#experiances-contairer .mt-4').forEach(div => {
        let ent = div.querySelector('input[name="Entreprise"]').value;
        let dFrom = div.querySelector('input[name="DateFrom"]').value;
        let dTo = div.querySelector('input[name="DateTo"]').value;

        if (ent && dFrom && dTo) {
            experiences.push({
                entreprise: ent,
                dateFrom: dFrom,
                dateTo: dTo
            });
        }
    });

    let worker = {
        id: Date.now(),
        fullname: name,
        role: position,
        photo: image,
        email: email,
        phone: phone,
        experiences: experiences,
        zonesAsigned: null
    };

    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    employes.push(worker);
    localStorage.setItem('employe', JSON.stringify(employes));

    form.reset();
    photoPreview.innerHTML = ''; // Nms7o preview
    formulaire.classList.add('hidden');

    refreshUI();
});

btnAddExpriances.addEventListener('click', () => {
    let div = document.createElement('div');
    div.className = 'mt-4';
    div.innerHTML = `
        <div class="mb-2 flex gap-2 items-center">
            <div class='w-[30rem]'><input type="text" name="Entreprise" placeholder="Entreprise" class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none"></div>
            <i class="fa-solid fa-trash-can text-red-600 cursor-pointer text-2xl delete-exp hover:text-red-400"></i>
        </div>
        <div class="flex gap-2">
            <input type="date" name="DateFrom" class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg outline-none">
            <input type="date" name="DateTo" class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg outline-none">
        </div>
    `;
    div.querySelector('.delete-exp').addEventListener('click', () => div.remove());
    exeperiancesContairer.appendChild(div);
});


function refreshUI() {
    workersContainer.innerHTML = "";
    containerReception.innerHTML = "";
    containerServeurs.innerHTML = "";
    containerSecurite.innerHTML = "";
    containerPersonnel.innerHTML = "";
    containerArchives.innerHTML = "";
    containerConference.innerHTML = "";

    let employes = JSON.parse(localStorage.getItem('employe')) || [];

    employes.forEach(emp => {
        if (emp.zonesAsigned === null) {
            createSidebarCard(emp);
        } else {
            createZoneCard(emp);
        }
    });
}

function createSidebarCard(emp) {
    let card = document.createElement('div');
    card.className = "cursor-pointer mt-4 p-4 bg-gray-300 rounded-lg text-white flex items-center gap-4 border border-transparent hover:border-green-500 transition-all p-2 border-b border-gray-700 cursor-pointer hover:bg-gray-800";
    card.innerHTML = `
        <img src="${emp.photo}" class="w-10 h-10 rounded-full object-cover" onerror="this.src='./public/images/default-Photo.jpg'">
            <div>
                <p class="text-white font-bold text-sm">${emp.fullname}</p>
                <p class="text-gray-400 text-xs">${emp.role}</p>
            </div>
    `;
    card.addEventListener('click', () => afichierInfoWorker(emp));
    workersContainer.appendChild(card);
}

function createZoneCard(emp) {
    let card = document.createElement('div');
    card.className = "relative cursor-pointer";

    card.innerHTML = `
        <div class="relative flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg max-w-[15rem] ">
            <img src="${emp.photo}" 
                 class="h-14 w-14 rounded-full object-cover border-4 "
                 onerror="this.src='./public/images/default-Photo.jpg'">

            <div class ='relative'>
                <h3 class="text-sm font-bold text-gray-800 mb-[15%] mb-[15%]">${emp.fullname}</h3>
                <h3 class="text-[0.7rem] font-sm text-gray-800 absolute top-[50%] ">${emp.role}</h3>
            </div>


            <button class="delete-btn w-5 h-5 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-trash-can text-red-600 cursor-pointer text-2xl delete-exp hover:text-red-400"></i>
            </button>
        </div>
    `;

    // AJOUT DE L'EVENT LISTENER POUR AFFICHER LES INFOS
    card.addEventListener('click', () => afichierInfoWorker(emp));

    card.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        updateEmployeeZone(emp.id, null);
    });

    if (emp.zonesAsigned === "Réception") {
        containerReception.appendChild(card);
    }
    else if (emp.zonesAsigned === "Salle Serveurs") {
        containerServeurs.appendChild(card)
    }
    else if (emp.zonesAsigned === "Salle Sécurité") containerSecurite.appendChild(card);
    else if (emp.zonesAsigned === "Salle Personnel") containerPersonnel.appendChild(card);
    else if (emp.zonesAsigned === "Salle d'Archives") containerArchives.appendChild(card);
    else if (emp.zonesAsigned === "Salle de Conférence") containerConference.appendChild(card);
}

function updateEmployeeZone(id, newZone) {
    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    for (let i = 0; i < employes.length; i++) {
        if (employes[i].id === id) {
            employes[i].zonesAsigned = newZone;
            break;
        }
    }
    localStorage.setItem('employe', JSON.stringify(employes));
    refreshUI();
}

function setupZoneButton(btn, rolesAllowed, zoneName) {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        modalContainer.style.display = 'flex';
        modalTitle.innerText = "Ajouter à : " + zoneName;
        employeesList.innerHTML = "";
        noRoleMessage.style.display = 'none';

        let employes = JSON.parse(localStorage.getItem('employe')) || [];
        let found = false;

        employes.forEach(emp => {
            if (rolesAllowed.includes(emp.role) && emp.zonesAsigned === null) {
                found = true;
                let div = document.createElement('div');
                div.className = "flex items-center gap-3 p-2 border-b border-gray-700 cursor-pointer hover:bg-gray-800";
                div.innerHTML = `
                    <img src="${emp.photo}" class="w-10 h-10 rounded-full object-cover" onerror="this.src='./public/images/default-Photo.jpg'">
                    <div>
                        <p class="text-white font-bold text-sm">${emp.fullname}</p>
                        <p class="text-gray-400 text-xs">${emp.role}</p>
                    </div>
                `;
                div.addEventListener('click', () => {
                    updateEmployeeZone(emp.id, zoneName);
                    modalContainer.style.display = 'none';
                });
                employeesList.appendChild(div);
            }
        });

        if (!found) noRoleMessage.style.display = 'block';
    });
}

setupZoneButton(btnreception, roleInReceprion, "Réception");
setupZoneButton(btnserveurs, roleInServeurs, "Salle Serveurs");
setupZoneButton(btnsecurite, roleInSecurite, "Salle Sécurité");
setupZoneButton(btnpersonnel, roleInPersonnel, "Salle Personnel");
setupZoneButton(btnarchives, roleInArchives, "Salle d'Archives");
setupZoneButton(btnconference, roleInConference, "Salle de Conférence");


function afichierInfoWorker(newwoker) {
    let divInfo = document.createElement('div');
    divInfo.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4';
    
    // Contenu HTML de base de la modale
    let modalContent = `
        <div class="bg-black/90 rounded-2xl w-[25rem] p-6 relative text-white border border-gray-700 shadow-2xl ">
            <div class="flex gap-4 items-center mb-6">
                <img src="${newwoker.photo}" class="w-24 h-24 rounded-full border-4 border-green-500 object-cover" onerror="this.src='./public/images/default-Photo.jpg'">
                <div>
                    <h2 class="text-2xl font-bold">${newwoker.fullname}</h2>
                    <p class="text-green-400 font-semibold">${newwoker.role}</p>
                </div>
            </div>
            
            <div id="contact-info" class="mb-6 bg-gray-800 p-3 rounded-lg">
                <p class="mb-1"><span class="text-gray-400 text-xs">EMAIL:</span> ${newwoker.email}</p>
                <p><span class="text-gray-400 text-xs">TEL:</span> ${newwoker.phone}</p>
            </div>
            
            <h3 class="border-b border-gray-600 mb-3 pb-1 font-bold text-lg">Expériences</h3>
            <ul id="exp-list" class="max-h-40 overflow-y-auto pr-2 no-scrollbar">
            </ul>
        </div>
    `;

    divInfo.innerHTML = modalContent;
    
    // Sélecteurs pour les éléments internes
    let modalBody = divInfo.querySelector('.bg-black\\/90');
    let ul = divInfo.querySelector('#exp-list');
    let contactInfoDiv = divInfo.querySelector('#contact-info');

    // --- Ajout Conditionnel de la Zone Assignée ---
    
    if (newwoker.zonesAsigned) {
        let divZone = document.createElement('div');
        divZone.className = 'mb-6 bg-green-900/40 p-3 rounded-lg border border-green-700';
        divZone.innerHTML = `
            <p><span class="text-green-400 text-xs">ZONE ASSIGNÉE:</span> <span class="font-bold text-lg block">${newwoker.zonesAsigned}</span></p>
        `;
        // Insérer la zone juste après les informations de contact
        contactInfoDiv.after(divZone);
    }
    
    // --- Traitement des Expériences ---
    
    if (newwoker.experiences && newwoker.experiences.length > 0) {
        newwoker.experiences.forEach(e => {
            let li = document.createElement('li');
            li.className = "mb-3 p-2 bg-gray-800/50 rounded border-l-4 border-green-500";
            li.innerHTML = `
                <div class="text-sm text-gray-400 mb-1">${e.dateFrom} <span class="mx-1">→</span> ${e.dateTo}</div>
                <div class="font-bold text-white uppercase">${e.entreprise}</div>
            `;
            ul.appendChild(li);
        });
    } else {
        ul.innerHTML = `<li class="text-gray-500 italic text-sm">Aucune expérience enregistrée.</li>`;
    }

    // --- Gestion de la Fermeture de la Modale ---
    
    divInfo.addEventListener('click', (e) => { 
        // Ferme la modale uniquement si on clique sur l'arrière-plan (l'élément divInfo lui-même)
        if (e.target === divInfo) divInfo.remove(); 
    });
    
    document.body.appendChild(divInfo);
}

refreshUI();